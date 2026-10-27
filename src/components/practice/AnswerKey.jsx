import { useState } from 'react';
import { ChevronDown, KeyRound } from 'lucide-react';
import Ro from '../Ro.jsx';
import { OPTION_LETTERS } from '../../lib/constants.js';

/** Collapsible list of correct answers and explanations. */
export default function AnswerKey({ questions }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="section-title">
          <KeyRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          Answer key
        </span>
        <ChevronDown className={`h-5 w-5 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ol className="mt-4 space-y-3">
          {questions.map((q, i) => (
            <li key={i} className="text-sm">
              <span className="font-semibold">{i + 1}. </span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {OPTION_LETTERS[q.correctIndex]}) <Ro>{q.options[q.correctIndex]}</Ro>
              </span>
              <span className="block text-slate-600 dark:text-slate-400">{q.explanation_en}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
