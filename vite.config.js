import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const FUNCTION_PATH = '/.netlify/functions/gemini';
const SERVER_ENV_KEYS = ['GEMINI_API_KEY', 'GEMINI_MODELS', 'GEMINI_TIMEOUT_MS'];

/**
 * Lets `npm run dev` serve the Netlify function without netlify-cli.
 * Server-only env vars from .env are copied into process.env for the handler;
 * they are never exposed to the client bundle (only VITE_* vars are).
 */
function netlifyFunctionDev() {
  return {
    name: 'netlify-function-dev',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      for (const key of SERVER_ENV_KEYS) {
        if (env[key] && !process.env[key]) process.env[key] = env[key];
      }

      server.middlewares.use(FUNCTION_PATH, async (req, res) => {
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const { handler } = await server.ssrLoadModule('/netlify/functions/gemini.js');
          const result = await handler({
            httpMethod: req.method,
            headers: req.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          });
          res.statusCode = result.statusCode;
          for (const [key, value] of Object.entries(result.headers || {})) res.setHeader(key, value);
          res.end(result.body);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Dev function crashed: ${err.message}` }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyFunctionDev()],
});
