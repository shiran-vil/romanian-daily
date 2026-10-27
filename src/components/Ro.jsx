/** Marks Romanian text (correct hyphenation, screen-reader pronunciation, serif styling). */
export default function Ro({ as: Tag = 'span', className = '', children }) {
  return (
    <Tag lang="ro" className={`ro ${className}`}>
      {children}
    </Tag>
  );
}

/** Renders "**bold**" markers as highlighted spans without using innerHTML. */
export function Highlighted({ text }) {
  const parts = String(text || '').split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-emerald-100 px-0.5 font-semibold text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
