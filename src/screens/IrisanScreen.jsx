import { useState } from 'react';
import irisanPairs from '../data/irisanPairs.json';
import modul2Categories from '../data/modul2Categories.json';

export default function IrisanScreen({ onExit }) {
  const [revealed, setRevealed] = useState(() => new Set());

  function toggleReveal(id) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="px-6 safe-top pb-4 sticky top-0 bg-paper z-10 border-b border-tekad-redSoft">
        <button onClick={onExit} className="text-ink text-2xl leading-none mb-3">←</button>
        <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Irisan Modul 1 &amp; 2</h1>
        <p className="text-ink-soft/70 text-sm leading-relaxed">
          {irisanPairs.length} soal ASLI dari ujian Modul 1 yang topiknya beririsan dengan materi Modul 2 yang sedang kamu pelajari.
          Konsepnya sama, sudutnya beda — kenali polanya biar nggak kaget kalau muncul lagi versi lain di Modul 2.
        </p>
      </header>

      <div className="flex-1 px-5 py-5 space-y-4">
        {irisanPairs.map((p) => {
          const cat = modul2Categories.find((c) => c.slug === p.m2Slug);
          const isRevealed = revealed.has(p.id);
          return (
            <div key={p.id} className="rounded-3xl border-2 border-tekad-redSoft bg-paper-raised px-5 py-5">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="rounded-full bg-ink text-white text-[10px] font-bold px-2.5 py-1">
                  Soal Asli Modul 1
                </span>
                <span className="text-ink-soft/40 text-xs">→ beririsan dengan</span>
                <span className="rounded-full bg-tekad-redSoft text-tekad-red text-[10px] font-bold px-2.5 py-1">
                  Modul 2 · {cat ? cat.name : p.m2Title}
                </span>
              </div>

              <h3 className="font-display font-bold text-ink leading-snug mb-3">{p.m1.stem}</h3>

              <div className="space-y-2 mb-3">
                {p.m1.options.map((opt, i) => {
                  const isCorrect = i === p.m1.correctIndex;
                  const showCorrect = isRevealed && isCorrect;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        showCorrect
                          ? 'border-ok bg-okSoft text-ink'
                          : 'border-tekad-redSoft/60 text-ink-soft/80'
                      }`}
                    >
                      {opt}
                      {showCorrect && <span className="ml-2 text-ok font-bold">✓ Jawaban benar</span>}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => toggleReveal(p.id)}
                className="text-xs font-bold text-tekad-red underline mb-3"
              >
                {isRevealed ? 'Sembunyikan jawaban' : 'Lihat jawaban'}
              </button>

              <p className="text-xs text-ink-soft/70 leading-relaxed bg-tekad-redSoft/40 rounded-xl px-3 py-2.5 mb-2">
                💡 {p.note}
              </p>
              <p className="text-[10px] text-ink-soft/40">{p.m1.sourceRef}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
