import { useState } from 'react';
import categories from '../data/categories.json';
import questions from '../data/questions.json';
import ExamRunner from '../components/ExamRunner';
import ResultFlow from '../components/ResultFlow';

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
      ? questions.filter((q) => categories.find((c) => c.slug === q.categorySlug)?.day === day)
      : questions.filter((q) => q.categorySlug === picked.slug);
    return (
      <ExamRunner key={runKey} title={picked.name} questions={pool} onFinish={setResult} onExit={onExit} />
    );
  }

  if (day) {
    const units = categories.filter((c) => c.day === day);
    const totalCount = units.reduce((n, u) => n + u.count, 0);
    return (
      <div className="min-h-screen bg-paper flex flex-col px-6 pt-6 pb-safe">
        <button onClick={() => setDay(null)} className="self-start text-ink text-2xl leading-none mb-4">←</button>
        <h1 className="font-display font-extrabold text-2xl text-ink mb-1">{dayInfo[day].label}</h1>
        <p className="text-ink-soft/70 mb-6">{units.length} materi</p>

        <button
          onClick={() => setPicked({ slug: 'all', name: `${dayInfo[day].label} · Semua Materi` })}
          className="w-full flex items-center justify-between rounded-2xl bg-tekad-red px-5 py-4 text-left active:scale-[0.98] transition-transform mb-3"
        >
          <span className="font-display font-bold text-white">Semua Materi Hari Ini</span>
          <span className="text-white/70 text-sm">{totalCount} soal</span>
        </button>

        <div className="space-y-3">
          {units.map((u) => (
            <button
              key={u.slug}
              onClick={() => setPicked({ slug: u.slug, name: u.name })}
              className="w-full flex items-center justify-between rounded-2xl border-2 border-tekad-redSoft bg-white px-5 py-4 text-left active:scale-[0.98] transition-transform"
            >
              <span className="font-display font-bold text-ink text-sm">{u.name}</span>
              <span className="text-ink-soft/50 text-sm shrink-0 ml-3">{u.count} soal</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 pt-6 pb-safe">
      <button onClick={onExit} className="self-start text-ink text-2xl leading-none mb-4">←</button>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-2">Latihan Harian</h1>
      <p className="text-ink-soft/70 mb-8 leading-relaxed">
        Materi dibagi per hari pelatihan. Pilih harinya, lalu latihan per materi atau sekaligus semua materi hari itu.
      </p>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((d) => {
          const units = categories.filter((c) => c.day === d);
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
                <span className="block text-ink-soft/50 text-xs mt-0.5">{units.length} materi · {count} soal</span>
              </span>
              <span className="text-ink-soft/30 text-xl">›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
