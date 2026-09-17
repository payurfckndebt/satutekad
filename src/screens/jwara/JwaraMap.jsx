import { useState } from 'react';
import categories from '../../data/categories.json';
import questions from '../../data/questions.json';
import JwaraUnitPath from './JwaraUnitPath';

const dayLabel = { 1: 'Hari 1', 2: 'Hari 2', 3: 'Hari 3', 4: 'Hari 4' };

export default function JwaraMap({ onExit }) {
  const [active, setActive] = useState(null);

  if (active) {
    return <JwaraUnitPath category={active} allQuestions={questions} onExit={() => setActive(null)} />;
  }

  const byDay = [1, 2, 3, 4].map((d) => ({
    day: d,
    units: categories.filter((c) => c.day === d),
  }));

  return (
    <div className="min-h-screen bg-paper pb-10">
      <header className="px-5 safe-top pb-4 flex items-center gap-3 sticky top-0 bg-paper z-10 border-b border-tekad-redSoft">
        <button onClick={onExit} className="text-ink text-2xl leading-none">←</button>
        <div>
          <h1 className="font-display font-extrabold text-ink text-xl">JWARA</h1>
          <p className="text-ink-soft/50 text-xs">Pilih unit — tiap unit berisi beberapa level micro-game</p>
        </div>
      </header>

      <div className="px-5 space-y-8 mt-4">
        {byDay.map(({ day, units }) => (
          <div key={day}>
            <p className="text-xs font-bold tracking-wide text-tekad-red mb-3">{dayLabel[day]}</p>
            <div className="space-y-3">
              {units.map((u) => (
                <button
                  key={u.slug}
                  onClick={() => setActive(u)}
                  className="w-full flex items-center gap-4 rounded-2xl border-2 border-tekad-redSoft bg-paper-raised px-4 py-4 text-left active:scale-[0.98] transition-transform"
                >
                  <span className="h-11 w-11 shrink-0 rounded-full bg-tekad-red flex items-center justify-center font-display font-extrabold text-white">
                    {u.count}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display font-bold text-ink text-sm leading-tight">{u.name}</span>
                  </span>
                  <span className="text-ink-soft/30 text-xl">›</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
