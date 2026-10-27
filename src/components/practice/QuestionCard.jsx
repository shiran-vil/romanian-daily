import { useId } from 'react';
import { Check, Lightbulb, X } from 'lucide-react';
import Ro from '../Ro.jsx';
import { OPTION_LETTERS, QUESTION_TYPES } from '../../lib/constants.js';

/** One multiple-choice question. After evaluation (`reviewed`) it locks and marks right/wrong options. */
export default function QuestionCard({ question, number, selected, onSelect, reviewed }) {
  const type = QUESTION_TYPES[question.type] || QUESTION_TYPES.vocab;
  const name = useId();
  const isCorrect = selected === question.correctIndex;

  return (
    <fieldset className="card space-y-3">
      <legend className="sr-only">Question {number}</legend>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{number}.</span>
        <span className={`badge ${type.className}`}>{type.label}</span>
        {reviewed && (
          <span className={`ml-auto badge ${isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}>
            {isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        )}
      </div>

      <Ro as="p" className="text-lg leading-relaxed text-slate-900 dark:text-white">
        {question.stem_ro}
      </Ro>

      {question.hint_en && (
        <p className="flex items-start gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {question.hint_en}
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option, i) => {
          const chosen = selected === i;
          let state = chosen
            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-950/40'
            : 'border-slate-200 hover:border-indigo-300 dark:border-slate-700 dark:hover:border-indigo-500';
          if (reviewed) {
            if (i === question.correctIndex) state = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
            else if (chosen) state = 'border-red-400 bg-red-50 dark:bg-red-950/40';
            else state = 'border-slate-200 opacity-60 dark:border-slate-700';
          }
          return (
            <label
              key={i}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${state} ${reviewed ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={chosen}
                disabled={reviewed}
                onChange={() => onSelect(i)}
              />
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {reviewed && i === question.correctIndex ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-label="Correct answer" />
                ) : reviewed && chosen ? (
                  <X className="h-3.5 w-3.5 text-red-600" aria-label="Your answer" />
                ) : (
                  OPTION_LETTERS[i]
                )}
              </span>
              <Ro>{option}</Ro>
            </label>
          );
        })}
      </div>

      {reviewed && <p className="text-sm text-slate-600 dark:text-slate-400">{question.explanation_en}</p>}
    </fieldset>
  );
}
