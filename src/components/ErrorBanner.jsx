import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
      <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="flex-1">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary py-1.5">
          <RotateCcw className="h-4 w-4" /> Retry
        </button>
      )}
    </div>
  );
}
