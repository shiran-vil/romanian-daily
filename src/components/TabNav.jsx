import { BookOpen, CalendarCheck, GraduationCap, History, Layers } from 'lucide-react';

const TABS = [
  { key: 'practice', label: 'Daily Practice', icon: CalendarCheck },
  { key: 'vocab', label: 'Vocab', icon: BookOpen },
  { key: 'grammar', label: 'Grammar', icon: GraduationCap },
  { key: 'flashcards', label: 'Flashcards', icon: Layers },
  { key: 'history', label: 'History', icon: History },
];

export default function TabNav({ active, onChange, historyCount }) {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div role="tablist" className="no-scrollbar mx-auto flex max-w-4xl gap-1 overflow-x-auto px-2 sm:px-4">
        {TABS.map(({ key, label, icon: Icon }) => {
          const selected = active === key;
          return (
            <button
              key={key}
              id={`tab-${key}`}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(key)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${
                selected
                  ? 'border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
              {key === 'history' && historyCount > 0 && (
                <span className="rounded-full bg-slate-200 px-1.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-200">{historyCount}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
