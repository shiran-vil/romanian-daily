import { BookOpen, Languages } from 'lucide-react';
import TopicPicker from '../TopicPicker.jsx';
import Skeleton from '../Skeleton.jsx';
import ErrorBanner from '../ErrorBanner.jsx';
import Ro from '../Ro.jsx';
import { PRACTICE_TOPICS } from '../../lib/constants.js';
import { useModeRequest } from './useModeRequest.js';

const GENDER = {
  m: { label: 'masc.', className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200' },
  f: { label: 'fem.', className: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200' },
  n: { label: 'neut.', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' },
};

const PERSONS = [
  ['eu', 'eu'],
  ['tu', 'tu'],
  ['el_ea', 'el/ea'],
  ['noi', 'noi'],
  ['voi', 'voi'],
  ['ei_ele', 'ei/ele'],
];

export default function VocabMode() {
  const { topic, setTopic, result, loading, error, run } = useModeRequest('vocab');

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <div>
          <h2 className="section-title">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Vocabulary builder
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Key nouns, verbs and idioms for a topic, with gender, plurals and conjugations.</p>
        </div>
        <TopicPicker
          topics={PRACTICE_TOPICS}
          value={topic}
          onChange={setTopic}
          onSubmit={run}
          loading={loading}
          buttonLabel="Build vocabulary"
          placeholder="Topic, e.g. “Public transport”"
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={loading ? null : run} />}
      {loading && <Skeleton messages={['Collecting nouns…', 'Conjugating verbs…', 'Finding idioms…']} blocks={3} />}

      {result && !loading && (
        <>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{result.topic}</h2>

          <div className="card">
            <h3 className="section-title">Nouns</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Singular</th>
                    <th className="py-2 pr-3 font-medium">Gender</th>
                    <th className="py-2 pr-3 font-medium">Definite</th>
                    <th className="py-2 pr-3 font-medium">Plural</th>
                    <th className="py-2 font-medium">English</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {result.nouns.map((n, i) => {
                    const g = GENDER[n.gender] || GENDER.n;
                    return (
                      <tr key={i}>
                        <td className="py-2 pr-3"><Ro className="font-semibold text-slate-900 dark:text-white">{n.singular}</Ro></td>
                        <td className="py-2 pr-3"><span className={`badge ${g.className}`}>{g.label}</span></td>
                        <td className="py-2 pr-3"><Ro>{n.definite}</Ro></td>
                        <td className="py-2 pr-3"><Ro>{n.plural}</Ro></td>
                        <td className="py-2 text-slate-600 dark:text-slate-400">{n.en}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Verbs (present tense)</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {result.verbs.map((v, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p>
                    <Ro className="font-semibold text-slate-900 dark:text-white">{v.infinitive}</Ro>
                    <span className="text-sm text-slate-500"> · {v.en}</span>
                  </p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5 text-sm">
                    {PERSONS.map(([key, label]) => (
                      <div key={key} className="flex gap-2">
                        <dt className="w-12 shrink-0 text-slate-400">{label}</dt>
                        <dd><Ro>{v.present?.[key]}</Ro></dd>
                      </div>
                    ))}
                  </dl>
                  <Ro as="p" className="mt-2 text-sm italic text-slate-600 dark:text-slate-400">{v.example_ro}</Ro>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Idioms & expressions</h3>
            <ul className="mt-3 space-y-3">
              {result.idioms.map((d, i) => (
                <li key={i}>
                  <Ro className="font-semibold text-slate-900 dark:text-white">{d.ro}</Ro>
                  <span className="text-slate-700 dark:text-slate-300"> — {d.meaning_en}</span>
                  <span className="block text-xs text-slate-500">Literally: {d.literal_en}</span>
                  <Ro as="p" className="text-sm italic text-slate-600 dark:text-slate-400">{d.example_ro}</Ro>
                </li>
              ))}
            </ul>
          </div>

          {result.spanish_notes?.length > 0 && (
            <div className="card border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
              <h3 className="section-title">
                <Languages className="h-5 w-5 text-amber-600" aria-hidden="true" />
                Spanish speaker notes
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900 dark:text-amber-200">
                {result.spanish_notes.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
