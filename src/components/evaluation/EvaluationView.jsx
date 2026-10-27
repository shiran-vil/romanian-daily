import { AlertCircle, ArrowRight, Award, CheckCircle2, CircleDashed, Languages, Sparkles } from 'lucide-react';
import Ro, { Highlighted } from '../Ro.jsx';

const AREA_LABELS = {
  noun_articles: 'Noun articles',
  subjunctive_sa: 'Subjunctive with “să”',
  prepositions_in_la: 'Prepositions “în” / “la”',
  verb_tenses: 'Verb tenses',
};

const STATUS = {
  good: { label: 'Good', icon: CheckCircle2, className: 'text-emerald-600 dark:text-emerald-400' },
  needs_work: { label: 'Needs work', icon: AlertCircle, className: 'text-amber-600 dark:text-amber-400' },
  not_used: { label: 'Not used', icon: CircleDashed, className: 'text-slate-400' },
};

const CATEGORY_LABELS = {
  article: 'Article',
  case: 'Case',
  agreement: 'Agreement',
  subjunctive: 'Subjunctive',
  preposition: 'Preposition',
  tense: 'Tense',
  word_order: 'Word order',
  vocabulary: 'Vocabulary',
  spelling_diacritics: 'Spelling / diacritics',
  other: 'Other',
};

/** ILR-style feedback report for one submitted practice. */
export default function EvaluationView({ evaluation, score, total, writing }) {
  const { overall_en, cefr_estimate, mcq_feedback = [], grammar = [], errors = [], calques = [], polished_ro } = evaluation;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const hasWriting = Boolean(writing?.trim());

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="section-title">
          <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          Evaluation
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_auto_1fr] sm:items-center">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-wide text-slate-500">Questions</p>
            <p className={`text-3xl font-bold ${pct >= 75 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
              {score}/{total}
            </p>
          </div>
          {hasWriting && cefr_estimate && cefr_estimate !== 'n/a' && (
            <div className="text-center sm:border-l sm:border-slate-200 sm:pl-4 sm:text-left dark:sm:border-slate-800">
              <p className="text-xs uppercase tracking-wide text-slate-500">Writing level</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{cefr_estimate}</p>
            </div>
          )}
          <p className="text-slate-700 sm:border-l sm:border-slate-200 sm:pl-4 dark:text-slate-300 dark:sm:border-slate-800">{overall_en}</p>
        </div>
      </div>

      {mcq_feedback.length > 0 && (
        <div className="card">
          <h3 className="section-title">Your question mistakes</h3>
          <ul className="mt-3 space-y-2">
            {mcq_feedback.map((m, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold">Question {m.id}: </span>
                <span className="text-slate-700 dark:text-slate-300">{m.explanation_en}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasWriting && (
        <>
          <div className="card">
            <h3 className="section-title">Grammar check</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {grammar.map((g, i) => {
                const status = STATUS[g.status] || STATUS.not_used;
                const Icon = status.icon;
                return (
                  <li key={i} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <p className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                      <Icon className={`h-4 w-4 ${status.className}`} aria-hidden="true" />
                      {AREA_LABELS[g.area] || g.area}
                      <span className={`ml-auto text-xs font-medium ${status.className}`}>{status.label}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{g.note_en}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card">
            <h3 className="section-title">Errors {errors.length > 0 && <span className="text-sm font-normal text-slate-500">({errors.length})</span>}</h3>
            {errors.length === 0 ? (
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">No errors found. Well done!</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
                {errors.map((e, i) => (
                  <li key={i} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Ro className="text-red-600 line-through decoration-red-400 dark:text-red-400">{e.original}</Ro>
                      <ArrowRight className="h-4 w-4 text-slate-400" aria-label="should be" />
                      <Ro className="font-semibold text-emerald-700 dark:text-emerald-400">{e.corrected}</Ro>
                      <span className="badge ml-auto bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {CATEGORY_LABELS[e.category] || e.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{e.explanation_en}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {calques.length > 0 && (
            <div className="card">
              <h3 className="section-title">
                <Languages className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                More natural phrasing
              </h3>
              <ul className="mt-3 space-y-3">
                {calques.map((c, i) => (
                  <li key={i} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <div className="flex flex-wrap items-center gap-2">
                      <Ro className="text-slate-500">“{c.original}”</Ro>
                      <ArrowRight className="h-4 w-4 text-slate-400" aria-label="more natural" />
                      <Ro className="font-semibold text-slate-900 dark:text-white">“{c.natural}”</Ro>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.explanation_en}</p>
                    {c.spanish_note && (
                      <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                        <span className="font-semibold">Spanish note: </span>
                        {c.spanish_note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {polished_ro && (
            <div className="card">
              <h3 className="section-title">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                Polished version
              </h3>
              <p className="mt-1 text-xs text-slate-500">Changes are highlighted.</p>
              <Ro as="blockquote" className="mt-3 border-l-4 border-emerald-400 pl-4 text-lg leading-relaxed text-slate-800 dark:text-slate-200">
                <Highlighted text={polished_ro} />
              </Ro>
            </div>
          )}
        </>
      )}
    </div>
  );
}
