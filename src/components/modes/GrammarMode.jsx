import { useEffect, useState } from 'react';
import { Check, GraduationCap, Languages, X } from 'lucide-react';
import TopicPicker from '../TopicPicker.jsx';
import Skeleton from '../Skeleton.jsx';
import ErrorBanner from '../ErrorBanner.jsx';
import Ro from '../Ro.jsx';
import QuestionCard from '../practice/QuestionCard.jsx';
import { GRAMMAR_TOPICS } from '../../lib/constants.js';
import { useModeRequest } from './useModeRequest.js';

export default function GrammarMode() {
  const { topic, setTopic, result, loading, error, run } = useModeRequest('grammar');
  const [answers, setAnswers] = useState([]);
  const [checked, setChecked] = useState(false);

  // Reset the drill whenever a new explanation arrives.
  useEffect(() => {
    setAnswers([]);
    setChecked(false);
  }, [result]);

  const drill = result?.drill || [];
  const drillScore = drill.filter((q, i) => answers[i] === q.correctIndex).length;

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <div>
          <h2 className="section-title">
            <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Grammar explainer
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A clear rule, examples, typical mistakes, a Spanish comparison and a quick drill.</p>
        </div>
        <TopicPicker
          topics={GRAMMAR_TOPICS}
          value={topic}
          onChange={setTopic}
          onSubmit={run}
          loading={loading}
          buttonLabel="Explain"
          placeholder="Grammar point, e.g. “Vocative case”"
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={loading ? null : run} />}
      {loading && <Skeleton messages={['Looking up the rule…', 'Writing examples…', 'Preparing a drill…']} blocks={2} />}

      {result && !loading && (
        <>
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{result.title}</h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">{result.rule_en}</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {result.key_points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="card">
              <h3 className="section-title">
                <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" /> Correct usage
              </h3>
              <ul className="mt-3 space-y-2">
                {result.correct_examples.map((e, i) => (
                  <li key={i}>
                    <Ro className="font-semibold text-slate-900 dark:text-white">{e.ro}</Ro>
                    <span className="block text-sm text-slate-500">{e.en}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="section-title">
                <X className="h-5 w-5 text-red-600" aria-hidden="true" /> Common mistakes
              </h3>
              <ul className="mt-3 space-y-3">
                {result.incorrect_examples.map((e, i) => (
                  <li key={i}>
                    <Ro className="block text-red-600 line-through decoration-red-400 dark:text-red-400">{e.wrong}</Ro>
                    <Ro className="block font-semibold text-emerald-700 dark:text-emerald-400">{e.right}</Ro>
                    <span className="block text-sm text-slate-500">{e.why_en}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
            <h3 className="section-title">
              <Languages className="h-5 w-5 text-amber-600" aria-hidden="true" /> Compared with Spanish
            </h3>
            <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">{result.spanish_comparison_en}</p>
          </div>

          <div className="space-y-4">
            <h3 className="section-title">Quick drill</h3>
            {drill.map((q, i) => (
              <QuestionCard
                key={i}
                number={i + 1}
                question={{ ...q, type: 'grammar', stem_ro: q.question_ro }}
                selected={answers[i]}
                reviewed={checked}
                onSelect={(choice) => setAnswers((a) => { const next = [...a]; next[i] = choice; return next; })}
              />
            ))}
            <div className="flex flex-wrap items-center gap-3">
              {checked ? (
                <>
                  <p className="font-semibold">Score: {drillScore}/{drill.length}</p>
                  <button type="button" className="btn-secondary" onClick={() => { setAnswers([]); setChecked(false); }}>Try again</button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  disabled={drill.some((_, i) => !Number.isInteger(answers[i]))}
                  onClick={() => setChecked(true)}
                >
                  Check answers
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
