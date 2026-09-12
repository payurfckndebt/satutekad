export default function ProgressBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-3 w-full rounded-full bg-ink-soft/40 overflow-hidden">
      <div
        className="h-full rounded-full bg-tekad-gold transition-all duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
