import { useState } from 'react';
import { ChevronDown, PenLine } from 'lucide-react';
import Ro from '../Ro.jsx';

const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);
const countSentences = (text) => text.split(/[.!?]+/).filter((s) => s.trim()).length;

/** Guided writing task: prompt, anchor phrases, collapsible model answer and the learner's textarea. */
export default function WritingPrompt({ writing, value, onChange, readOnly }) {
  const [showReference, setShowReference] = useState(false);
  const sentences = countSentences(value);

  return (
    <div className="card space-y-4">
      <h3 className="section-title">
        <PenLine className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
        Guided writing
      </h3>
      <div className="space-y-1">
        <p className="text-slate-800 dark:text-slate-200">{writing.prompt_en}</p>
        <Ro as="p" className="text-sm italic text-slate-500 dark:text-slate-400">
          {writing.prompt_ro}
        </Ro>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Useful phrases</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {writing.anchors.map((a, i) => (
            <li key={i} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
              <Ro className="font-semibold text-slate-900 dark:text-white">{a.ro}</Ro>
              <span className="block text-sm text-slate-500 dark:text-slate-400">{a.en}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label htmlFor="writing" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Your text (3-5 sentences, in Romanian)
        </label>
        <textarea
          id="writing"
          lang="ro"
          spellCheck
          rows={6}
          maxLength={3000}
          className="input ro resize-y text-base leading-relaxed"
          placeholder="Scrie aici…"
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className={`mt-1 text-xs ${sentences > 0 && (sentences < 3 || sentences > 5) ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
          {countWords(value)} words · {sentences} sentences · {value.length}/3000
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Tip: for ă â î ș ț, enable a Romanian keyboard layout or long-press the letter on a phone.
        </p>
      </div>

      <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
        <button type="button" className="btn-ghost -ml-3" onClick={() => setShowReference((v) => !v)} aria-expanded={showReference}>
          <ChevronDown className={`h-4 w-4 transition ${showReference ? 'rotate-180' : ''}`} />
          {showReference ? 'Hide' : 'Show'} model answer
        </button>
        {showReference && (
          <Ro as="blockquote" className="mt-2 border-l-4 border-indigo-300 pl-4 leading-relaxed text-slate-700 dark:border-indigo-700 dark:text-slate-300">
            {writing.reference_ro}
          </Ro>
        )}
      </div>
    </div>
  );
}
