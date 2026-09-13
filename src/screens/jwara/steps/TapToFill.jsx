import { useMemo, useState } from 'react';
import { shuffle } from '../../../lib/utils';

// Stem is shown with the answer blanked out; tap the correct chip to fill it in.
export default function TapToFill({ question, onAnswered }) {
  const [picked, setPicked] = useState(null);
  const chips = useMemo(() => shuffle(question.options.map((opt, i) => ({ opt, i }))), [question]);

  function tap(i) {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === question.correctIndex;
    setTimeout(() => onAnswered(correct), correct ? 350 : 500);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-soft/70 font-semibold mb-2">
        Lengkapi pernyataan berikut
      </p>
      <h2 className="font-display font-bold text-xl text-ink leading-snug mb-3">
        {question.stem}
      </h2>
      <div className="mb-6 rounded-2xl border-2 border-dashed border-tekad-red/60 bg-tekad-red/5 px-4 py-4 min-h-[3.5rem] flex items-center">
        {picked === null ? (
          <span className="text-ink-soft/50">___________________</span>
        ) : (
          <span className={`font-semibold ${picked === question.correctIndex ? 'text-ok' : 'text-bad'}`}>
            {question.options[picked]}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map(({ opt, i }) => (
          <button
            key={i}
            disabled={picked !== null}
            onClick={() => tap(i)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all
              ${picked === i
                ? i === question.correctIndex
                  ? 'border-ok bg-ok/10 text-ok'
                  : 'border-bad bg-bad/10 text-bad animate-shake'
                : 'border-ink-soft/25 bg-white text-ink active:scale-95'
              } ${picked !== null && picked !== i ? 'opacity-40' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
