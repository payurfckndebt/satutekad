import { useState } from 'react';
import bahanBacaan from '../data/bahanBacaan.json';
import modul1Categories from '../data/modul1Categories.json';
import modul2Categories from '../data/modul2Categories.json';
import modul3Categories from '../data/modul3Categories.json';

const MODULES = [
  { id: 1, name: 'Modul 1', desc: 'Pendekatan Pengawasan', categories: modul1Categories },
  { id: 2, name: 'Modul 2', desc: 'Kelembagaan, Struktur, Produk, Aktivitas SJK', categories: modul2Categories },
  { id: 3, name: 'Modul 3', desc: 'Manajemen Risiko & Cyber Risk', categories: modul3Categories },
];

export default function BahanBacaanScreen({ onExit }) {
  const [activeModul, setActiveModul] = useState(null);
  const [activeSlug, setActiveSlug] = useState(null);

  const modul = MODULES.find((m) => m.id === activeModul);
  const topicsForModul = modul ? bahanBacaan.filter((t) => modul.categories.some((c) => c.slug === t.slug)) : [];
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

          {active.wajibHafal && (
            <div className="rounded-2xl bg-goldSoft border-2 border-gold p-4">
              <h2 className="font-display font-bold text-gold text-sm mb-2.5">📌 Wajib Dihafal</h2>
              <ul className="space-y-2">
                {active.wajibHafal.map((w, j) => (
                  <li key={j} className="flex gap-2.5 text-sm text-ink leading-relaxed">
                    <span className="text-gold shrink-0 font-bold">{j + 1}.</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active.mnemonic && (
            <div className="rounded-2xl bg-inkSolid text-white p-4">
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

  // Submenu: topics within the chosen modul
  if (modul) {
    return (
      <div className="min-h-screen bg-paper flex flex-col px-6 safe-top pb-safe">
        <button onClick={() => setActiveModul(null)} className="self-start text-ink text-2xl leading-none mb-4">←</button>
        <h1 className="font-display font-extrabold text-2xl text-ink mb-1">{modul.name}</h1>
        <p className="text-ink-soft/70 mb-6 leading-relaxed">{modul.desc}</p>
        <div className="space-y-3">
          {topicsForModul.map((t) => {
            const cat = modul.categories.find((c) => c.slug === t.slug);
            return (
              <button
                key={t.slug}
                onClick={() => setActiveSlug(t.slug)}
                className="w-full flex items-center gap-3 rounded-2xl border-2 border-tekad-redSoft bg-paper-raised px-5 py-4 text-left active:scale-[0.98] transition-transform"
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
          {topicsForModul.length === 0 && (
            <p className="text-sm text-ink-soft/50 text-center py-8">Bahan bacaan untuk modul ini belum tersedia.</p>
          )}
        </div>
      </div>
    );
  }

  // Top level: pick a modul
  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 safe-top pb-safe">
      <button onClick={onExit} className="self-start text-ink text-2xl leading-none mb-4">←</button>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-2">Bahan Bacaan</h1>
      <p className="text-ink-soft/70 mb-8 leading-relaxed">
        Rangkuman poin penting per materi, plus prediksi fokus ujian berdasarkan karakteristik soal & kisi-kisi yang ada — dipisah per modul.
      </p>
      <div className="space-y-3">
        {MODULES.map((m) => {
          const count = bahanBacaan.filter((t) => m.categories.some((c) => c.slug === t.slug)).length;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModul(m.id)}
              className="w-full flex items-center gap-4 rounded-2xl border-2 border-tekad-redSoft bg-paper-raised px-5 py-5 text-left active:scale-[0.98] transition-transform"
            >
              <span className="h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center font-display font-extrabold text-lg bg-tekad-red text-white">
                {m.id}
              </span>
              <span className="flex-1">
                <span className="block font-display font-bold text-ink">{m.name}</span>
                <span className="block text-ink-soft/50 text-xs mt-0.5">
                  {m.desc} · {count} topik
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
