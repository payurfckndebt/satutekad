import { useState } from 'react';
import JwaraSession from './JwaraSession';

const TIERS = [
  { key: 'easy', label: 'Mudah' },
  { key: 'medium', label: 'Sedang' },
  { key: 'hard', label: 'Sulit' },
];

export default function JwaraUnitPath({ category, allQuestions, onExit }) {
  const [unlocked, setUnlocked] = useState({ easy: true, medium: false, hard: false });
  const [activeTier, setActiveTier] = useState(null);

  if (activeTier) {
    return (
      <JwaraSession
        key={activeTier}
        category={category}
        allQuestions={allQuestions}
        tier={activeTier}
        onExit={() => setActiveTier(null)}
        onTierPassed={(t) => {
          const nextKey = t === 'easy' ? 'medium' : t === 'medium' ? 'hard' : null;
          if (nextKey) setUnlocked((u) => ({ ...u, [nextKey]: true }));
        }}
        onGoToTier={(t) => setActiveTier(t)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 safe-top pb-safe">
      <button onClick={onExit} className="self-start text-ink text-2xl leading-none mb-4">←</button>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">{category.name}</h1>
      <p className="text-ink-soft/60 text-sm mb-8">
        Selesaikan Tingkat Mudah untuk membuka Sedang, lalu Sedang untuk membuka Sulit.
      </p>

      <div className="space-y-4">
        {TIERS.map((t, i) => {
          const isUnlocked = unlocked[t.key];
          return (
            <button
              key={t.key}
              disabled={!isUnlocked}
              onClick={() => setActiveTier(t.key)}
              className={`w-full flex items-center gap-4 rounded-2xl border-2 px-5 py-5 text-left transition-transform ${
                isUnlocked
                  ? 'border-tekad-redSoft bg-paper-raised active:scale-[0.98]'
                  : 'border-ink-soft/10 bg-ink-soft/5 opacity-60'
              }`}
            >
              <span
                className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center font-display font-extrabold text-lg ${
                  isUnlocked ? 'bg-tekad-red text-white' : 'bg-ink-soft/20 text-ink-soft/50'
                }`}
              >
                {isUnlocked ? i + 1 : '🔒'}
              </span>
              <span className="flex-1">
                <span className="block font-display font-bold text-ink">{t.label}</span>
                <span className="block text-ink-soft/50 text-xs mt-0.5">
                  {isUnlocked ? 'Terbuka' : `Selesaikan tingkat ${TIERS[i - 1]?.label} dulu`}
                </span>
              </span>
              {isUnlocked && <span className="text-ink-soft/30 text-xl">›</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
