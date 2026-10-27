import { useRef, useState } from 'react';
import { CalendarCheck, Loader2, RefreshCw, Send } from 'lucide-react';
import TopicPicker from '../TopicPicker.jsx';
import Skeleton from '../Skeleton.jsx';
import ErrorBanner from '../ErrorBanner.jsx';
import QuestionCard from './QuestionCard.jsx';
import WritingPrompt from './WritingPrompt.jsx';
import AnswerKey from './AnswerKey.jsx';
import EvaluationView from '../evaluation/EvaluationView.jsx';
import { callGemini } from '../../lib/api.js';
import { PRACTICE_TOPICS } from '../../lib/constants.js';

const GENERATE_MESSAGES = ['Choosing today’s situations…', 'Writing B1 questions…', 'Preparing the writing task…'];
const EVALUATE_MESSAGES = ['Reading your answers…', 'Checking grammar and articles…', 'Looking for calques…', 'Polishing your text…'];

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * Daily practice flow: generate → answer 8 questions + write → evaluate.
 * The session lives in App (persisted) so a refresh or a reopen from History restores it.
 */
export default function PracticeView({ session, setSession, upsertHistory }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(null); // 'generate' | 'evaluate' | null
  const [error, setError] = useState(null);
  const lastAction = useRef(null);
  const evaluationRef = useRef(null);

  const practice = session?.practice;
  const answers = session?.answers || [];
  const evaluation = session?.evaluation;
  const answeredCount = answers.filter((a) => Number.isInteger(a)).length;
  const allAnswered = practice && answeredCount === practice.questions.length;

  const update = (changes) => setSession((s) => ({ ...s, ...changes }));

  async function generate() {
    lastAction.current = generate;
    setLoading('generate');
    setError(null);
    try {
      const data = await callGemini('practice', { topic: topic.trim() });
      const next = {
        id: newId(),
        createdAt: new Date().toISOString(),
        topic: data.topic || topic.trim() || 'Mixed',
        practice: data,
        answers: Array(data.questions.length).fill(null),
        writing: '',
        evaluation: null,
        score: null,
      };
      setSession(next);
      upsertHistory(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  async function evaluate() {
    lastAction.current = evaluate;
    setLoading('evaluate');
    setError(null);
    const { questions, writing: task } = practice;
    const score = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    const mistakes = questions
      .map((q, i) => ({ id: i + 1, stem: q.stem_ro, options: q.options, userIndex: answers[i], correctIndex: q.correctIndex }))
      .filter((m) => m.userIndex !== m.correctIndex);
    try {
      const data = await callGemini('evaluate', {
        topic: session.topic,
        writingTask: task.prompt_en,
        writing: session.writing.trim(),
        mistakes,
      });
      const next = { ...session, evaluation: data, score, evaluatedAt: new Date().toISOString() };
      setSession(next);
      upsertHistory(next);
      requestAnimationFrame(() => evaluationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  const retry = () => lastAction.current?.();

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <div>
          <h2 className="section-title">
            <CalendarCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Daily practice
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            8 questions (3 vocabulary, 3 grammar, 2 idioms) plus a short guided writing task. Pick a topic or leave it empty for a mix.
          </p>
        </div>
        <TopicPicker
          topics={PRACTICE_TOPICS}
          value={topic}
          onChange={setTopic}
          onSubmit={generate}
          loading={loading === 'generate'}
          buttonLabel={practice ? 'New practice' : 'Generate Daily Practice'}
          placeholder="Or type any topic, e.g. “At the doctor”"
          requireTopic={false}
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={loading ? null : retry} />}

      {loading === 'generate' && <Skeleton messages={GENERATE_MESSAGES} blocks={3} />}

      {practice && loading !== 'generate' && (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Topic: {session.topic}</h2>
            <span className="text-sm text-slate-500">{new Date(session.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="space-y-4">
            {practice.questions.map((q, i) => (
              <QuestionCard
                key={i}
                number={i + 1}
                question={q}
                selected={answers[i]}
                reviewed={Boolean(evaluation)}
                onSelect={(choice) => update({ answers: answers.map((a, j) => (j === i ? choice : a)) })}
              />
            ))}
          </div>

          <WritingPrompt
            writing={practice.writing}
            value={session.writing}
            onChange={(writing) => update({ writing })}
            readOnly={Boolean(evaluation) || loading === 'evaluate'}
          />

          {!evaluation && (
            <div className="card flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {allAnswered
                  ? session.writing.trim()
                    ? 'Ready. Your answers and text will be evaluated.'
                    : 'Ready. You can submit without writing, but the text gets the most useful feedback.'
                  : `Answer all questions to submit (${answeredCount}/${practice.questions.length}).`}
              </p>
              <button type="button" className="btn-primary" onClick={evaluate} disabled={!allAnswered || Boolean(loading)}>
                {loading === 'evaluate' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit for Evaluation
              </button>
            </div>
          )}

          {loading === 'evaluate' && <Skeleton messages={EVALUATE_MESSAGES} blocks={2} />}

          {evaluation && (
            <div ref={evaluationRef} className="scroll-mt-16">
              <EvaluationView evaluation={evaluation} score={session.score} total={practice.questions.length} writing={session.writing} />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => update({ answers: answers.map(() => null), evaluation: null, score: null })}
                >
                  <RefreshCw className="h-4 w-4" /> Retry this practice
                </button>
              </div>
            </div>
          )}

          <AnswerKey questions={practice.questions} />
        </>
      )}
    </div>
  );
}
