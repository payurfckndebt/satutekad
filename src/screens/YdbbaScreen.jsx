import { useState } from 'react';
import questions from '../data/questions.json';
import categories from '../data/categories.json';
import McqRunner from '../components/McqRunner';
import ResultCard from '../components/ResultCard';

const existingCategories = categories.filter((c) => c.source === 'existing');
const existingQuestions = questions.filter((q) => q.source === 'existing');

export default function YdbbaScreen({ onExit }) {
  const [picked, setPicked] = useState(null); // null | 'all' | slug
  const [result, setResult] = useState(null);
  const [runKey, setRunKey] = useState(0);

  if (result) {
    return (
      <ResultCard
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
    const pool = picked === 'all' ? existingQuestions : existingQuestions.filter((q) => q.categorySlug === picked);
    const title = picked === 'all' ? 'YDBBA' : existingCategories.find((c) => c.slug === picked)?.name;
    return (
      <McqRunner
        key={runKey}
        title={title}
        questions={pool}
        onFinish={setResult}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 pt-6 pb-safe">
      <button onClick={onExit} className="self-start text-ink text-2xl leading-none mb-6">←</button>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-2">YDBBA</h1>
      <p className="text-ink-soft/70 mb-8 leading-relaxed">
        Latihan fokus per materi, {existingQuestions.length} soal di {existingCategories.length} kategori.
      </p>
      <div className="space-y-3">
        <button
          onClick={() => setPicked('all')}
          className="w-full flex items-center justify-between rounded-2xl bg-tekad-red px-5 py-4 text-left active:scale-[0.98] transition-transform"
        >
          <span className="font-display font-bold text-white">Semua Kategori</span>
          <span className="text-white/70 text-sm">{existingQuestions.length} soal</span>
        </button>
        {existingCategories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setPicked(c.slug)}
            className="w-full flex items-center justify-between rounded-2xl border-2 border-tekad-redSoft bg-white px-5 py-4 text-left active:scale-[0.98] transition-transform"
          >
            <span className="font-display font-bold text-ink text-sm">{c.name}</span>
            <span className="text-ink-soft/50 text-sm">{c.count} soal</span>
          </button>
        ))}
      </div>
    </div>
  );
}
