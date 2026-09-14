import { useState } from 'react';
import baseCategories from '../data/categories.json';
import modul1Categories from '../data/modul1Categories.json';
import questions from '../data/questions.json';
import modul1Questions from '../data/modul1Questions.json';
import ExamRunner from '../components/ExamRunner';
import ResultFlow from '../components/ResultFlow';

const allCategories = [...baseCategories, ...modul1Categories].map((c) => ({ ...c }));
// unify session numbering per day so base + Modul 1 sessions don't both start at 1
for (let d = 1; d <= 4; d++) {
  allCategories
    .filter((c) => c.day === d)
    .sort((a, b) => (a.origin === b.origin ? a.session - b.session : a.origin === 'base' ? -1 : 1))
    .forEach((c, i) => { c.session = i + 1; });
}
const allQuestions = [...questions, ...modul1Questions];

const dayInfo = {
  1: { label: 'Hari 1', color: 'bg-[#D6293D]' },
  2: { label: 'Hari 2', color: 'bg-[#B71C34]' },
  3: { label: 'Hari 3', color: 'bg-[#8F1729]' },
  4: { label: 'Hari 4', color: 'bg-[#5C0F1B]' },
};

export default function HarianScreen({ onExit }) {
  const [day, setDay] = useState(null);
  const [picked, setPicked] = useState(null); // { slug: 'all' | categorySlug, name }
  const [result, setResult] = useState(null);
  const [runKey, setRunKey] = useState(0);

  if (result) {
    return (
      <ResultFlow
        result={result}
        onExit={onExit}
        onRetry={() => {
          setResult(null);
          setRunKey((k) => k + 1);
        }}
      />
    );
  }

  if (picked) {
    const pool = picked.slug === 'all'
      ? allQuestions.filter((q) => allCategories.find((c) => c.slug === q.categorySlug)?.day === day)
      : allQuestions.filter((q) => q.categorySlug === picked.slug);
    return (
      <ExamRunner key={runKey} title={picked.name} questions={pool} onFinish={setResult} onExit={onExit} />
    );
  }

  if (day) {
    const units = allCategories.filter((c) => c.day === day).sort((a, b) => a.session - b.session);
    const totalCount = units.reduce((n, u) => n + u.count, 0);
    return (
      <div className="min-h-screen bg-paper flex flex-col px-6 safe-top pb-safe">
        <button onClick={() => setDay(null)} className="self-start text-ink text-2xl leading-none mb-4">←</button>
        <h1 className="font-display font-extrabold text-2xl text-ink mb-1">{dayInfo[day].label}</h1>
        <p className="text-ink-soft/70 mb-6">{units.length} sesi</p>

        <button
          onClick={() => setPicked({ slug: 'all', name: `${dayInfo[day].label} · Semua Sesi` })}
          className="w-full flex items-center justify-between rounded-2xl bg-tekad-red px-5 py-4 text-left active:scale-[0.98] transition-transform mb-3"
        >
          <span className="font-display font-bold text-white">Semua Sesi Hari Ini</span>
          <span className="text-white/70 text-sm">{totalCount} soal</span>
        </button>

        <div className="space-y-3">
          {units.map((u) => (
            <button
              key={u.slug}
              onClick={() => setPicked({ slug: u.slug, name: u.name })}
              className="w-full flex items-center gap-3 rounded-2xl border-2 border-tekad-redSoft bg-white px-5 py-4 text-left active:scale-[0.98] transition-transform"
            >
              <span className="shrink-0 h-8 w-8 rounded-full bg-tekad-redSoft text-tekad-red font-display font-bold text-xs flex items-center justify-center">
                {u.session}
              </span>
              <span className="flex-1">
                <span className="block font-display font-bold text-ink text-sm">{u.name}</span>
                <span className="block text-ink-soft/40 text-xs mt-0.5">Sesi {u.session}</span>
              </span>
              <span className="text-ink-soft/50 text-sm shrink-0">{u.count} soal</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 safe-top pb-safe">
      <button onClick={onExit} className="self-start text-ink text-2xl leading-none mb-4">←</button>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-2">Latihan Berdasarkan Hari</h1>
      <p className="text-ink-soft/70 mb-8 leading-relaxed">
        Materi dibagi per hari pelatihan, dan per sesi di dalamnya. Pilih harinya, lalu latihan per sesi
        atau sekaligus semua sesi hari itu.
      </p>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((d) => {
          const units = allCategories.filter((c) => c.day === d);
          const count = units.reduce((n, u) => n + u.count, 0);
          return (
            <button
              key={d}
              onClick={() => setDay(d)}
              className="w-full flex items-center gap-4 rounded-2xl border-2 border-tekad-redSoft bg-white px-5 py-4 text-left active:scale-[0.98] transition-transform"
            >
              <span className={`h-12 w-12 shrink-0 rounded-2xl ${dayInfo[d].color} flex items-center justify-center font-display font-extrabold text-white`}>
                {d}
              </span>
              <span className="flex-1">
                <span className="block font-display font-bold text-ink">{dayInfo[d].label}</span>
                <span className="block text-ink-soft/50 text-xs mt-0.5">{units.length} sesi · {count} soal</span>
              </span>
              <span className="text-ink-soft/30 text-xl">›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
