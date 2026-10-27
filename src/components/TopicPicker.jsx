import { Loader2, Sparkles } from 'lucide-react';

/** Preset topic chips + free-text topic + action button. */
export default function TopicPicker({ topics, value, onChange, onSubmit, loading, buttonLabel, placeholder, requireTopic = true }) {
  const canSubmit = !loading && (!requireTopic || value.trim().length > 0);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(value === t ? '' : t)}
            className={`chip ${value === t ? 'chip-active' : ''}`}
            aria-pressed={value === t}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="input"
          value={value}
          maxLength={80}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Topic"
        />
        <button type="submit" className="btn-primary shrink-0" disabled={!canSubmit}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
