import { useMemo, useState } from 'react';
import { shuffle } from '../../../lib/utils';

// sequence: { prompt, steps: [ordered strings] }
// Interaction: tap items in what you believe is the correct order.
export default function DragSort({ sequence, onAnswered }) {
  const pool = useMemo(() => shuffle(sequence.steps.map((text, i) => ({ text, i }))), [sequence]);
  const [placed, setPlaced] = useState([]);
  const [locked, setLocked] = useState(false);

  function tapPool(item) {
    if (locked || placed.find((p) => p.i === item.i)) return;
    setPlaced([...placed, item]);
  }
  function tapPlaced(item) {
    if (locked) return;
    setPlaced(placed.filter((p) => p.i !== item.i));
  }

  function submit() {
    if (placed.length !== sequence.steps.length || locked) return;
    setLocked(true);
    const correct = placed.every((p, idx) => p.i === idx);
    setTimeout(() => onAnswered(correct), 300);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-soft/70 font-semibold mb-2">Susun urutan</p>
      <h2 className="font-display font-bold text-lg text-ink leading-snug mb-4">{sequence.prompt}</h2>

      <div className="space-y-2 mb-5 min-h-[3rem]">
        {placed.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-ink-soft/25 px-4 py-3 text-ink-soft/50 text-sm">
            Ketuk kartu di bawah untuk mulai menyusun
          </div>
        )}
        {placed.map((item, idx) => (
          <button
            key={item.i}
            onClick={() => tapPlaced(item)}
            disabled={locked}
            className={`w-full flex items-center gap-3 rounded-xl border-2 px-3 py-3 text-left text-sm font-medium bg-paper-raised transition-all
              ${locked
                ? item.i === idx
                  ? 'border-ok text-ok'
                  : 'border-bad text-bad'
                : 'border-tekad-red/50 text-ink active:scale-[0.98]'
              }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white text-xs font-bold">
              {idx + 1}
            </span>
            {item.text}
          </button>
        ))}
      </div>

      {placed.length < sequence.steps.length && (
        <div className="flex flex-wrap gap-2">
          {pool
            .filter((item) => !placed.find((p) => p.i === item.i))
            .map((item) => (
              <button
                key={item.i}
                onClick={() => tapPool(item)}
                className="rounded-xl border-2 border-ink-soft/20 bg-paper-raised px-3 py-2 text-sm font-medium text-ink active:scale-95"
              >
                {item.text}
              </button>
            ))}
        </div>
      )}

      {placed.length === sequence.steps.length && !locked && (
        <button
          onClick={submit}
          className="btn-solid mt-2 w-full rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-3 font-display font-bold text-white"
        >
          Kunci Urutan
        </button>
      )}
    </div>
  );
}
