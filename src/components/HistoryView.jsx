import { History, Trash2 } from 'lucide-react';

/** Saved practices (with their evaluation, if submitted), newest first. */
export default function HistoryView({ history, onOpen, onDelete, onClear }) {
  if (!history.length) {
    return (
      <div className="card text-center text-slate-500 dark:text-slate-400">
        <History className="mx-auto mb-2 h-8 w-8" aria-hidden="true" />
        No practices yet. Generate one in the Daily Practice tab and it will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">History</h2>
        <button
          type="button"
          className="btn-ghost text-red-600 dark:text-red-400"
          onClick={() => window.confirm('Delete all saved practices?') && onClear()}
        >
          <Trash2 className="h-4 w-4" /> Clear all
        </button>
      </div>
      <ul className="space-y-2">
        {history.map((entry) => {
          const total = entry.practice?.questions?.length || 8;
          return (
            <li key={entry.id} className="card flex items-center gap-3 p-3 sm:p-4">
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onOpen(entry)}>
                <p className="truncate font-semibold text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300">{entry.topic}</p>
                <p className="text-sm text-slate-500">
                  {new Date(entry.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  {' · '}
                  {entry.evaluation ? (
                    <>
                      {entry.score}/{total} correct
                      {entry.evaluation.cefr_estimate && entry.evaluation.cefr_estimate !== 'n/a' && ` · writing ${entry.evaluation.cefr_estimate}`}
                    </>
                  ) : (
                    'not submitted'
                  )}
                </p>
              </button>
              <button type="button" className="btn-ghost" onClick={() => onDelete(entry.id)} aria-label={`Delete ${entry.topic}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
