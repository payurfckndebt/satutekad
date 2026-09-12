import { useState } from 'react';
import categories from '../../data/categories.json';
import questions from '../../data/questions.json';
import JwaraSession from './JwaraSession';

const dayLabel = { 1: 'Day 1', 2: 'Day 2', 3: 'Day 3', 4: 'Day 4' };
const dayColor = {
  1: 'bg-[#5B8DEF]',
  2: 'bg-[#2F9E64]',
  3: 'bg-tekad-gold',
  4: 'bg-[#B25BE0]',
};

export default function JwaraMap({ onExit }) {
  const [active, setActive] = useState(null);

  if (active) {
    return <JwaraSession category={active} allQuestions={questions} onExit={() => setActive(null)} />;
  }

  const byDay = [1, 2, 3, 4].map((d) => ({
    day: d,
    units: categories.filter((c) => c.day === d),
  }));

  return (
    <div className="min-h-screen bg-ink pb-10">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3 sticky top-0 bg-ink z-10">
        <button onClick={onExit} className="text-white/60 text-2xl leading-none">←</button>
        <div>
          <h1 className="font-display font-extrabold text-white text-xl">JWARA</h1>
          <p className="text-white/50 text-xs">Pilih unit — tiap unit berisi beberapa level micro-game</p>
        </div>
      </header>

      <div className="px-5 space-y-8 mt-2">
        {byDay.map(({ day, units }) => (
          <div key={day}>
            <p className="text-xs font-bold tracking-wide text-white/40 mb-3">{dayLabel[day]}</p>
            <div className="space-y-3">
              {units.map((u) => (
                <button
                  key={u.slug}
                  onClick={() => setActive(u)}
                  className="w-full flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-left active:scale-[0.98] transition-transform"
                >
                  <span className={`h-11 w-11 shrink-0 rounded-full ${dayColor[day]} flex items-center justify-center font-display font-extrabold text-ink`}>
                    {u.count}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display font-bold text-white text-sm leading-tight">{u.name}</span>
                    <span className="block text-white/40 text-xs mt-0.5">
                      {u.source === 'existing' ? 'Soal terlampir' : 'Soal buatan Claude'}
                    </span>
                  </span>
                  <span className="text-white/30 text-xl">›</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
