import { useCallback } from 'react';
import Header from './components/Header.jsx';
import TabNav from './components/TabNav.jsx';
import PracticeView from './components/practice/PracticeView.jsx';
import VocabMode from './components/modes/VocabMode.jsx';
import GrammarMode from './components/modes/GrammarMode.jsx';
import FlashcardsMode from './components/modes/FlashcardsMode.jsx';
import HistoryView from './components/HistoryView.jsx';
import { HISTORY_LIMIT, usePersistentState } from './lib/storage.js';

export default function App() {
  const [tab, setTab] = usePersistentState('tab', 'practice');
  const [session, setSession] = usePersistentState('session', null);
  const [history, setHistory] = usePersistentState('history', []);

  const upsertHistory = useCallback(
    (entry) => setHistory((items) => [entry, ...items.filter((e) => e.id !== entry.id)].slice(0, HISTORY_LIMIT)),
    [setHistory],
  );

  const openFromHistory = (entry) => {
    setSession(entry);
    setTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Views stay mounted so each tab keeps its state while switching.
  const views = {
    practice: <PracticeView session={session} setSession={setSession} upsertHistory={upsertHistory} />,
    vocab: <VocabMode />,
    grammar: <GrammarMode />,
    flashcards: <FlashcardsMode />,
    history: (
      <HistoryView
        history={history}
        onOpen={openFromHistory}
        onDelete={(id) => setHistory((items) => items.filter((e) => e.id !== id))}
        onClear={() => setHistory([])}
      />
    ),
  };

  return (
    <div className="min-h-screen">
      <Header />
      <TabNav active={tab} onChange={setTab} historyCount={history.length} />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-6 sm:px-6">
        {Object.entries(views).map(([key, view]) => (
          <section key={key} hidden={tab !== key} aria-labelledby={`tab-${key}`} role="tabpanel">
            {view}
          </section>
        ))}
      </main>
      <footer className="pb-8 text-center text-xs text-slate-400 dark:text-slate-500">
        Aligned with ILR B1 (CEFR) · Powered by Gemini · Your history stays in this browser
      </footer>
    </div>
  );
}
