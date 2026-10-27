const ENDPOINT = '/.netlify/functions/gemini';

/** Calls the serverless Gemini proxy. Resolves with the structured JSON data or throws an Error with a readable message. */
export async function callGemini(action, payload) {
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });
  } catch {
    throw new Error('Network error. Check your connection and try again.');
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // Netlify returns a non-JSON body when a function hits its time limit.
  }

  if (!res.ok || !body?.data) {
    if (body?.error) throw new Error(body.error);
    if (res.status === 502 || res.status === 504) throw new Error('The request timed out. Please try again.');
    if (res.status === 404) throw new Error('API function not found. Run the app with "npm run dev" or "netlify dev".');
    throw new Error(`Request failed (${res.status}).`);
  }
  return body.data;
}
