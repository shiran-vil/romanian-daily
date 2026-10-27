import { buildRequest } from '../lib/prompts.js';

const DEFAULT_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-3.5-flash'];
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_BODY_BYTES = 20_000;
// Netlify synchronous functions stop at 60s; keep a margin, and cap each model so the fallback still gets a turn.
const DEFAULT_TIMEOUT_MS = 50_000;
const PER_MODEL_TIMEOUT_MS = 25_000;
// Statuses that move on to the next model in the chain.
const FALLBACK_STATUSES = new Set([404, 429, 500, 503, 504]);

const respond = (statusCode, data) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(data),
});

function modelChain() {
  const fromEnv = (process.env.GEMINI_MODELS || '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_MODELS;
}

function requestBody(req, withThinking) {
  return {
    systemInstruction: { parts: [{ text: req.system }] },
    contents: [{ role: 'user', parts: [{ text: req.prompt }] }],
    generationConfig: {
      temperature: req.temperature,
      maxOutputTokens: req.maxOutputTokens,
      responseMimeType: 'application/json',
      responseSchema: req.schema,
      ...(withThinking && req.thinkingLevel && { thinkingConfig: { thinkingLevel: req.thinkingLevel } }),
    },
  };
}

async function callModel(model, req, apiKey, timeoutMs, withThinking = true) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(requestBody(req, withThinking)),
      signal: controller.signal,
    });
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const message = String(body?.error?.message || res.statusText || 'Unknown error').slice(0, 300);
      // Some models reject thinkingConfig; retry once without it.
      if (res.status === 400 && withThinking && /thinking/i.test(message)) {
        clearTimeout(timer);
        return callModel(model, req, apiKey, timeoutMs - (Date.now() - started), false);
      }
      return { ok: false, status: res.status, message, retryable: FALLBACK_STATUSES.has(res.status) };
    }

    const candidate = body?.candidates?.[0];
    const textOut = (candidate?.content?.parts || [])
      .filter((p) => !p.thought && typeof p.text === 'string')
      .map((p) => p.text)
      .join('');
    if (!textOut) {
      const reason = candidate?.finishReason || body?.promptFeedback?.blockReason || 'empty response';
      return { ok: false, status: 502, message: `Model returned no content (${reason}).`, retryable: true };
    }
    try {
      const data = JSON.parse(textOut);
      return { ok: true, data: req.postProcess ? req.postProcess(data) : data };
    } catch {
      return { ok: false, status: 502, message: 'Model returned malformed JSON.', retryable: true };
    }
  } catch (err) {
    if (err.name === 'AbortError') return { ok: false, status: 504, message: 'Model timed out.', retryable: true };
    return { ok: false, status: 502, message: `Network error contacting Gemini: ${err.message}`, retryable: true };
  } finally {
    clearTimeout(timer);
  }
}

function userMessage(error) {
  if (!error) return 'The AI service did not respond in time. Please try again.';
  if (error.status === 429) return 'Gemini rate limit reached on all models. Wait a minute and try again.';
  if (error.status === 503) return 'Gemini is overloaded right now. Please try again in a moment.';
  if (error.status === 504) return 'The AI took too long to answer. Gemini may be busy, so please try again in a moment.';
  if (error.status === 400 || error.status === 403) return `Gemini rejected the request: ${error.message}`;
  if (error.status === 404) return 'None of the configured Gemini models were found. Check GEMINI_MODELS.';
  return error.message || 'Unexpected error from the AI service.';
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return respond(405, { error: 'Method not allowed.' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return respond(500, { error: 'Server is missing GEMINI_API_KEY. Add it to .env (local) or to the Netlify site environment variables.' });
  }

  if (!event.body || Buffer.byteLength(event.body, 'utf8') > MAX_BODY_BYTES) {
    return respond(413, { error: 'Request is empty or too large.' });
  }

  let req;
  try {
    const { action, payload } = JSON.parse(event.body);
    req = buildRequest(action, payload);
  } catch (err) {
    return respond(400, { error: err instanceof SyntaxError ? 'Invalid JSON body.' : err.message });
  }

  const deadline = Date.now() + Number(process.env.GEMINI_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  let lastError = null;

  for (const model of modelChain()) {
    const remaining = deadline - Date.now();
    if (remaining < 1500) break;
    const result = await callModel(model, req, apiKey, Math.min(remaining, PER_MODEL_TIMEOUT_MS));
    if (result.ok) return respond(200, { data: result.data, model });
    console.warn(`[gemini] ${model} failed: ${result.status} ${result.message}`);
    lastError = result;
    if (!result.retryable) break;
  }

  return respond(lastError?.status && lastError.status !== 404 ? lastError.status : 502, { error: userMessage(lastError) });
};
