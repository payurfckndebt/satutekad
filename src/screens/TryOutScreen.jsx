import { useState } from 'react';
import questions from '../data/questions.json';
import ExamRunner from '../components/ExamRunner';
import ResultFlow from '../components/ResultFlow';

const LENGTHS = [20, 40, 60];

export default function TryOutScreen({ onExit }) {
  const [length, setLength] = useState(null);
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

  if (length) {
    return (
      <ExamRunner
        key={runKey}
        title="FullTek"
        questions={pickRandom(questions, length)}
        timeLimitMin={Math.round(length * 1.2)}
        onFinish={setResult}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 pt-6 pb-safe">
      <button onClick={onExit} className="self-start text-ink text-2xl leading-none mb-6">←</button>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-2">FullTek</h1>
      <p className="text-ink-soft/70 mb-8 leading-relaxed">
        Simulasi ujian bertimer, soal diambil acak dari seluruh {questions.length} soal, {' '}
        {new Set(questions.map((q) => q.categorySlug)).size} materi. Pilih jumlah soal untuk sesi ini.
      </p>
      <div className="space-y-3">
        {LENGTHS.map((n) => (
          <button
            key={n}
            onClick={() => setLength(n)}
            className="w-full flex items-center justify-between rounded-2xl border-2 border-tekad-redSoft bg-paper-raised px-5 py-4 text-left active:scale-[0.98] transition-transform"
          >
            <span className="font-display font-bold text-ink">{n} Soal</span>
            <span className="text-ink-soft/50 text-sm">~{Math.round(n * 1.2)} menit</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function pickRandom(arr, n) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
