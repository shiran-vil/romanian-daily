import { useState } from 'react';
import { callGemini } from '../../lib/api.js';
import { usePersistentState } from '../../lib/storage.js';

/** Topic input + one Gemini action, with the last result persisted per mode. */
export function useModeRequest(action) {
  const [topic, setTopic] = usePersistentState(`${action}:topic`, '');
  const [result, setResult] = usePersistentState(`${action}:result`, null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      setResult(await callGemini(action, { topic: topic.trim() }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { topic, setTopic, result, loading, error, run };
}
