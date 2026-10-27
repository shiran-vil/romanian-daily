import Ro from '../Ro.jsx';

/** A flip card: Romanian on the front, meaning + grammar note on the back. */
export default function Flashcard({ card, flipped, onFlip }) {
  return (
    <button
      type="button"
      onClick={onFlip}
      className="perspective block h-72 w-full text-left sm:h-64"
      aria-label={flipped ? 'Show Romanian side' : 'Show translation'}
    >
      <div className={`preserve-3d relative h-full w-full transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}>
        <div className="backface-hidden card absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
          <Ro as="p" className="text-3xl font-semibold text-slate-900 dark:text-white">{card.ro}</Ro>
          <Ro as="p" className="text-lg italic text-slate-600 dark:text-slate-400">{card.sentence_ro}</Ro>
          <span className="absolute bottom-3 text-xs text-slate-400">Tap to flip</span>
        </div>
        <div className="backface-hidden rotate-y-180 card absolute inset-0 flex flex-col items-center justify-center gap-3 bg-indigo-50 text-center dark:bg-indigo-950/40">
          <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">{card.en}</p>
          <p className="italic text-slate-700 dark:text-slate-300">{card.sentence_en}</p>
          <p className="rounded-lg bg-white/70 px-3 py-1.5 text-sm text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">{card.grammar_note_en}</p>
        </div>
      </div>
    </button>
  );
}
