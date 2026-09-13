import { useMemo, useState } from 'react';
import { shuffle } from '../../../lib/utils';

// pairs: [{ id, left, right }]. Tap one left + one right to match them.
export default function MatchPairs({ pairs, onAnswered }) {
  const leftItems = useMemo(() => shuffle(pairs.map((p) => ({ id: p.id, text: p.left }))), [pairs]);
  const rightItems = useMemo(() => shuffle(pairs.map((p) => ({ id: p.id, text: p.right }))), [pairs]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState([]); // ids solved
  const [wrongFlash, setWrongFlash] = useState(null); // { leftId, rightId }
  const [mistakes, setMistakes] = useState(0);

  function tapLeft(id) {
    if (matched.includes(id)) return;
    setSelectedLeft(id);
  }

  function tapRight(id) {
    if (!selectedLeft || matched.includes(id)) return;
    if (selectedLeft === id) {
      const next = [...matched, id];
      setMatched(next);
      setSelectedLeft(null);
      if (next.length === pairs.length) {
        setTimeout(() => onAnswered(true), 350);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongFlash({ leftId: selectedLeft, rightId: id });
      setTimeout(() => setWrongFlash(null), 350);
      setSelectedLeft(null);
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-soft/70 font-semibold mb-4">
        Hubungkan istilah dengan pasangannya
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {leftItems.map((item) => (
            <button
              key={item.id}
              disabled={matched.includes(item.id)}
              onClick={() => tapLeft(item.id)}
              className={`w-full text-left rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all
                ${matched.includes(item.id)
                  ? 'border-transparent bg-ok/10 text-ok/60'
                  : selectedLeft === item.id
                  ? 'border-tekad-red bg-tekad-red/10 text-ink'
                  : wrongFlash?.leftId === item.id
                  ? 'border-bad bg-bad/10 text-bad animate-shake'
                  : 'border-ink-soft/20 bg-white text-ink active:scale-95'
                }`}
            >
              {item.text}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rightItems.map((item) => (
            <button
              key={item.id}
              disabled={matched.includes(item.id)}
              onClick={() => tapRight(item.id)}
              className={`w-full text-left rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all
                ${matched.includes(item.id)
                  ? 'border-transparent bg-ok/10 text-ok/60'
                  : wrongFlash?.rightId === item.id
                  ? 'border-bad bg-bad/10 text-bad animate-shake'
                  : 'border-ink-soft/20 bg-white text-ink active:scale-95'
                }`}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
