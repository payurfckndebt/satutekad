import { useRef, useState } from 'react';

// statement: { text, isTrue } — pre-built by the level generator (either the
// real True/False question, or an MCQ turned into a true/false statement).
export default function TrueFalseSwipe({ statement, onAnswered }) {
  const [drag, setDrag] = useState(0);
  const [resolved, setResolved] = useState(null); // 'true' | 'false' | null
  const startX = useRef(null);
  const dragging = useRef(false);

  function resolve(answerTrue) {
    if (resolved) return;
    const correct = answerTrue === statement.isTrue;
    setResolved(answerTrue ? 'true' : 'false');
    setTimeout(() => onAnswered(correct), 320);
  }

  function onPointerDown(e) {
    if (resolved) return;
    dragging.current = true;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX;
  }
  function onPointerMove(e) {
    if (!dragging.current || resolved) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    setDrag(x - startX.current);
  }
  function onPointerUp() {
    if (!dragging.current || resolved) return;
    dragging.current = false;
    if (drag > 90) resolve(true);
    else if (drag < -90) resolve(false);
    else setDrag(0);
  }

  const rotate = drag / 18;

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-soft/70 font-semibold mb-2">
        Geser kanan (Benar) atau kiri (Salah)
      </p>
      <div className="relative h-64 select-none">
        <div
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          style={{
            transform: `translateX(${drag}px) rotate(${rotate}deg)`,
            transition: dragging.current ? 'none' : 'transform 0.25s ease-out',
          }}
          className="absolute inset-0 rounded-3xl bg-white border-2 border-ink-soft/15 shadow-lg p-6 flex items-center justify-center text-center cursor-grab active:cursor-grabbing"
        >
          <p className="font-display font-bold text-lg text-ink leading-snug">{statement.text}</p>
          {drag > 40 && (
            <span className="absolute top-4 left-4 rounded-lg border-4 border-ok text-ok font-display font-extrabold px-2 py-1 -rotate-12">
              BENAR
            </span>
          )}
          {drag < -40 && (
            <span className="absolute top-4 right-4 rounded-lg border-4 border-bad text-bad font-display font-extrabold px-2 py-1 rotate-12">
              SALAH
            </span>
          )}
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => resolve(false)}
          className="btn-solid flex-1 rounded-2xl bg-white border-2 border-bad text-bad border-b-4 py-3 font-display font-bold"
        >
          ✕ Salah
        </button>
        <button
          onClick={() => resolve(true)}
          className="btn-solid flex-1 rounded-2xl bg-white border-2 border-ok text-ok border-b-4 py-3 font-display font-bold"
        >
          ✓ Benar
        </button>
      </div>
    </div>
  );
}
