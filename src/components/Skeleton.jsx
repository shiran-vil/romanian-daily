import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

/** Shimmering placeholder blocks with a rotating status message. */
export default function Skeleton({ messages = ['Thinking…'], blocks = 3 }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % messages.length), 2200);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <p className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        {messages[i]}
      </p>
      {Array.from({ length: blocks }, (_, b) => (
        <div key={b} className="card space-y-3">
          <div className="skeleton h-4 w-1/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="skeleton h-9" />
            <div className="skeleton h-9" />
          </div>
        </div>
      ))}
    </div>
  );
}
