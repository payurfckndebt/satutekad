import { useState } from 'react';

// Tap the options you're sure are WRONG until only the correct one remains.
export default function RapidElimination({ question, onAnswered }) {
  const [eliminated, setEliminated] = useState([]);
  const [locked, setLocked] = useState(false);

  const remaining = question.options
    .map((_, i) => i)
    .filter((i) => !eliminated.includes(i));

  function tap(i) {
    if (locked) return;
    if (i === question.correctIndex) {
      // eliminating the actually-correct answer is the mistake here
      setLocked(true);
      setEliminated([...eliminated, i]);
      setTimeout(() => onAnswered(false), 300);
      return;
    }
    const next = [...eliminated, i];
    setEliminated(next);
    if (question.options.length - next.length === 1) {
      setLocked(true);
      setTimeout(() => onAnswered(true), 250);
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-soft/70 font-semibold mb-2">
        Ketuk jawaban yang PASTI SALAH
      </p>
      <h2 className="font-display font-bold text-xl text-ink leading-snug mb-6 whitespace-pre-line">
        {question.stem}
      </h2>
      <div className="space-y-3">
        {question.options.map((opt, i) => {
          const isOut = eliminated.includes(i);
          const isMistake = isOut && i === question.correctIndex;
          return (
            <button
              key={i}
              disabled={isOut || locked}
              onClick={() => tap(i)}
              className={`w-full text-left rounded-2xl border-2 px-4 py-3 font-medium transition-all
                ${isMistake
                  ? 'border-bad bg-bad/10 text-bad animate-shake'
                  : isOut
                  ? 'border-transparent bg-ink-soft/10 text-ink-soft/40 line-through scale-[0.98]'
                  : 'border-ink-soft/20 bg-white text-ink hover:border-tekad-red active:scale-[0.98]'
                }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {remaining.length === 1 && !locked && (
        <p className="mt-4 text-center text-sm text-ok font-semibold">Ketuk sisa jawabannya untuk kunci ✓</p>
      )}
    </div>
  );
}
