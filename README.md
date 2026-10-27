# Română B1 Practice

A single-page app for practicing Romanian at B1 level (ILR / CEFR), powered by Gemini.

- **Daily Practice**: 8 questions (3 vocabulary, 3 grammar, 2 idioms) plus a guided writing task, then an ILR-style evaluation: score, grammar check, errors, calques with Spanish notes, and a polished version of your text.
- **Vocab**: nouns with gender/definite/plural, verbs with present-tense conjugation, idioms.
- **Grammar**: rule, examples, common mistakes, Spanish comparison and a short drill.
- **Flashcards**: 12 flip cards per topic.
- **History**: saved in your browser (localStorage).

The Gemini API key stays on the server: the browser only talks to the Netlify function `/.netlify/functions/gemini`, which builds all prompts itself.

## Run locally

```bash
npm install
cp .env.example .env      # then put your key in GEMINI_API_KEY
npm run dev               # http://localhost:5173
```

Get a free key at https://aistudio.google.com/apikey. `npm run dev` serves the function through a small Vite plugin, so `netlify-cli` isn't needed (`netlify dev` also works).

## Deploy to Netlify

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project** and pick the repo. The settings come from `netlify.toml` (build `npm run build`, publish `dist`, functions `netlify/functions`).
3. **Site configuration → Environment variables**: add `GEMINI_API_KEY`.
4. Deploy.

Or from the command line: `npx netlify-cli deploy --build --prod`.

## Configuration (environment variables)

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | (required) | Google AI Studio key |
| `GEMINI_MODELS` | `gemini-3.5-flash-lite,gemini-3.8-flash,gemini-3.5-flash` | Model fallback chain, tried in order on 404/429/5xx |
| `GEMINI_TIMEOUT_MS` | `50000` | Total time budget per request (Netlify functions stop at 60 s); each model gets at most 25 s |
