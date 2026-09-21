import { useMemo, useRef, useState } from 'react';
import bahanBacaan from '../data/bahanBacaan.json';
import { getSessionHighlightKeys } from '../lib/sessionPicks';

// Modul 3 only — flatten each topic's prediction bullets into pickable cards.
const MODUL3_HIGHLIGHTS = bahanBacaan
  .filter((topic) => topic.slug.startsWith('m3-'))
  .flatMap((topic) =>
    (topic.prediction || []).map((text, i) => ({
      key: `${topic.slug}__${i}`,
      text,
      topicTitle: topic.title,
    }))
  );

export default function HighlightCarousel() {
  const picks = useMemo(() => {
    const keys = getSessionHighlightKeys(
      MODUL3_HIGHLIGHTS.map((h) => h.key),
      5
    );
    return keys.map((k) => MODUL3_HIGHLIGHTS.find((h) => h.key === k)).filter(Boolean);
  }, []);
  const [active, setActive] = useState(0);
  const scrollerRef = useRef(null);

  if (picks.length === 0) return null;

  function scrollToIndex(idx) {
    const clamped = Math.max(0, Math.min(picks.length - 1, idx));
    setActive(clamped);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  }

  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(idx);
  }

  return (
    <div className="relative animate-float">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs font-bold text-ink-soft/50 uppercase tracking-wide">
          ✨ Modul 3 · Berpotensi Keluar di Ujian
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scrollToIndex(active - 1)}
            disabled={active === 0}
            aria-label="Sebelumnya"
            className="h-6 w-6 rounded-full border-2 border-tekad-redSoft bg-paper-raised text-tekad-red text-xs font-bold disabled:opacity-30 flex items-center justify-center"
          >
            ‹
          </button>
          <button
            onClick={() => scrollToIndex(active + 1)}
            disabled={active === picks.length - 1}
            aria-label="Berikutnya"
            className="h-6 w-6 rounded-full border-2 border-tekad-redSoft bg-paper-raised text-tekad-red text-xs font-bold disabled:opacity-30 flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-1 -mx-5 px-5"
        style={{ scrollbarWidth: 'none' }}
      >
        {picks.map((h) => (
          <div
            key={h.key}
            className="shrink-0 w-full snap-center rounded-3xl border-2 border-tekad-redSoft bg-paper-raised px-5 py-5 shadow-soft"
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
