import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Layers, RotateCcw, Shuffle } from 'lucide-react';
import TopicPicker from '../TopicPicker.jsx';
import Skeleton from '../Skeleton.jsx';
import ErrorBanner from '../ErrorBanner.jsx';
import Flashcard from './Flashcard.jsx';
import { PRACTICE_TOPICS } from '../../lib/constants.js';
import { useModeRequest } from './useModeRequest.js';

const range = (n) => Array.from({ length: n }, (_, i) => i);

export default function FlashcardsMode() {
  const { topic, setTopic, result, loading, error, run } = useModeRequest('flashcards');
  const cards = result?.cards || [];
  const [order, setOrder] = useState(() => range(cards.length));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set());

  // New deck: reset position, order and progress.
  useEffect(() => {
    setOrder(range(cards.length));
    setPos(0);
    setFlipped(false);
    setKnown(new Set());
  }, [result, cards.length]);

  // Only cards not yet marked as known stay in the rotation.
  const remaining = order.filter((i) => !known.has(i));
  const current = remaining.length ? remaining[Math.min(pos, remaining.length - 1)] : null;

  const go = (delta) => {
    if (!remaining.length) return;
    setFlipped(false);
    setPos((p) => (Math.min(p, remaining.length - 1) + delta + remaining.length) % remaining.length);
  };

  const markKnown = () => {
    setFlipped(false);
    setKnown((k) => new Set(k).add(current));
  };

  const shuffle = () => {
    const next = range(cards.length);
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrder(next);
    setPos(0);
    setFlipped(false);
  };

  useEffect(() => {
    if (current == null) return undefined;
    const onKey = (e) => {
      if (e.target.closest('input, textarea') || document.querySelector('[role="tabpanel"]:not([hidden]) [data-flashcards]') == null) return;
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <div>
          <h2 className="section-title">
            <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Flashcards
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">12 cards per topic. Flip, then mark the ones you know to remove them from the deck.</p>
        </div>
        <TopicPicker
          topics={PRACTICE_TOPICS}
          value={topic}
          onChange={setTopic}
          onSubmit={run}
          loading={loading}
          buttonLabel="Make cards"
          placeholder="Topic, e.g. “Family”"
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={loading ? null : run} />}
      {loading && <Skeleton messages={['Picking words…', 'Writing example sentences…']} blocks={1} />}

      {cards.length > 0 && !loading && (
        <div className="space-y-4" data-flashcards>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span className="font-semibold text-slate-900 dark:text-white">{result.topic}</span>
            <span>
              {known.size}/{cards.length} known
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(known.size / cards.length) * 100}%` }} />
          </div>

          {current == null ? (
            <div className="card space-y-3 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" aria-hidden="true" />
              <p className="text-lg font-semibold">You know all {cards.length} cards!</p>
              <div className="flex justify-center gap-2">
                <button type="button" className="btn-secondary" onClick={() => { setKnown(new Set()); setPos(0); }}>
                  <RotateCcw className="h-4 w-4" /> Review again
                </button>
                <button type="button" className="btn-primary" onClick={run}>New deck</button>
              </div>
            </div>
          ) : (
            <>
              <Flashcard card={cards[current]} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
              <div className="flex items-center justify-between gap-2">
                <button type="button" className="btn-secondary" onClick={() => go(-1)} aria-label="Previous card">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-500">
                  {Math.min(pos, remaining.length - 1) + 1} / {remaining.length}
                </span>
                <button type="button" className="btn-secondary" onClick={() => go(1)} aria-label="Next card">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button type="button" className="btn-ghost" onClick={shuffle}>
                  <Shuffle className="h-4 w-4" /> Shuffle
                </button>
                <button type="button" className="btn-primary bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800" onClick={markKnown}>
                  <CheckCircle2 className="h-4 w-4" /> I know this
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
