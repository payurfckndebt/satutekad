import { useMemo, useRef, useState } from 'react';
import bahanBacaan from '../data/bahanBacaan.json';
import { getSessionHighlightKeys } from '../lib/sessionPicks';

// Flatten every topic's prediction bullets into individually pickable cards.
const ALL_HIGHLIGHTS = bahanBacaan.flatMap((topic) =>
  (topic.prediction || []).map((text, i) => ({
    key: `${topic.slug}__${i}`,
    text,
    topicTitle: topic.title,
  }))
);

export default function HighlightCarousel() {
  const picks = useMemo(() => {
    const keys = getSessionHighlightKeys(
      ALL_HIGHLIGHTS.map((h) => h.key),
      5
    );
    return keys.map((k) => ALL_HIGHLIGHTS.find((h) => h.key === k)).filter(Boolean);
  }, []);
  const [active, setActive] = useState(0);
  const scrollerRef = useRef(null);

  if (picks.length === 0) return null;

  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(idx);
  }

  return (
    <div>
      <p className="text-xs font-bold text-ink-soft/50 uppercase tracking-wide mb-2 px-1">
        ✨ Berpotensi Keluar di Ujian
      </p>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-1 -mx-5 px-5"
        style={{ scrollbarWidth: 'none' }}
      >
        {picks.map((h) => (
          <div
            key={h.key}
            className="shrink-0 w-[85%] snap-center rounded-3xl border-2 border-tekad-redSoft bg-paper-raised px-5 py-5"
          >
            <p className="text-[10px] font-bold text-tekad-red uppercase tracking-wide mb-2">{h.topicTitle}</p>
            <p className="text-sm text-ink leading-relaxed">{h.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {picks.map((h, i) => (
          <span
            key={h.key}
            className={`h-1.5 rounded-full transition-all ${i === active ? 'w-4 bg-tekad-red' : 'w-1.5 bg-tekad-redSoft'}`}
          />
        ))}
      </div>
    </div>
  );
}
