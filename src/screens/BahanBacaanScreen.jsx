import { useState } from 'react';
import bahanBacaan from '../data/bahanBacaan.json';
import modul1Categories from '../data/modul1Categories.json';

export default function BahanBacaanScreen({ onExit }) {
  const [activeSlug, setActiveSlug] = useState(null);

  const active = bahanBacaan.find((t) => t.slug === activeSlug);

  if (active) {
    return (
      <div className="min-h-screen bg-paper flex flex-col">
        <header className="safe-top px-5 pb-4 sticky top-0 bg-paper z-10 border-b border-tekad-redSoft">
          <button onClick={() => setActiveSlug(null)} className="text-ink text-2xl leading-none mb-2">←</button>
          <h1 className="font-display font-extrabold text-xl text-ink leading-snug">{active.title}</h1>
        </header>

        <main className="flex-1 px-5 py-5 pb-safe space-y-6">
          <p className="text-ink-soft/70 text-sm leading-relaxed">{active.overview}</p>

          {active.sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display font-bold text-ink text-sm mb-2.5">{s.heading}</h2>
              <ul className="space-y-2">
                {s.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-sm text-ink-soft leading-relaxed">
                    <span className="text-tekad-red shrink-0 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {active.mnemonic && (
            <div className="rounded-2xl bg-ink text-white p-4">
              <h2 className="font-display font-bold text-sm mb-2.5">🧠 Kunci Hafalan</h2>
              <ul className="space-y-2">
                {active.mnemonic.map((m, j) => (
                  <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-white/90">
                    <span className="text-white shrink-0">✦</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl bg-tekad-redSoft/50 border-2 border-tekad-redSoft p-4">
            <h2 className="font-display font-bold text-tekad-red text-sm mb-2.5">🎯 Prediksi Fokus Ujian</h2>
            <ul className="space-y-2">
              {active.prediction.map((p, j) => (
                <li key={j} className="flex gap-2.5 text-sm text-ink leading-relaxed">
                  <span className="text-tekad-red shrink-0 font-bold">{j + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 safe-top pb-safe">
      <button onClick={onExit} className="self-start text-ink text-2xl leading-none mb-4">←</button>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-2">Bahan Bacaan</h1>
      <p className="text-ink-soft/70 mb-8 leading-relaxed">
        Rangkuman poin penting per materi Modul 1, plus prediksi fokus ujian berdasarkan karakteristik soal & kisi-kisi yang ada.
      </p>
      <div className="space-y-3">
        {bahanBacaan.map((t) => {
          const cat = modul1Categories.find((c) => c.slug === t.slug);
          return (
            <button
              key={t.slug}
              onClick={() => setActiveSlug(t.slug)}
              className="w-full flex items-center gap-3 rounded-2xl border-2 border-tekad-redSoft bg-white px-5 py-4 text-left active:scale-[0.98] transition-transform"
            >
              <span className="flex-1">
                <span className="block font-display font-bold text-ink text-sm">{t.title}</span>
                <span className="block text-ink-soft/40 text-xs mt-0.5">
                  {t.sections.reduce((n, s) => n + s.items.length, 0)} poin penting
                  {cat ? ` · ${cat.count} soal terkait` : ''}
                </span>
              </span>
              <span className="text-ink-soft/30 text-xl">›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
