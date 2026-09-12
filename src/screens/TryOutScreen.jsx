import { useState } from 'react';
import questions from '../data/questions.json';
import McqRunner from '../components/McqRunner';
import ResultCard from '../components/ResultCard';

const LENGTHS = [20, 40, 60];

export default function TryOutScreen({ onExit }) {
  const [length, setLength] = useState(null);
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

  if (length) {
    const pool = questions.slice(0, length); // McqRunner shuffles internally
    return (
      <McqRunner
        key={runKey}
        title="Try Out Keseluruhan"
        questions={pickRandom(questions, length)}
        timeLimitMin={Math.round(length * 1.2)}
        onFinish={setResult}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 py-8">
      <button onClick={onExit} className="self-start text-ink-soft/60 text-2xl leading-none mb-6">←</button>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-2">Try Out Keseluruhan</h1>
      <p className="text-ink-soft/70 mb-8 leading-relaxed">
        Campuran soal dari file terlampir dan soal buatan Claude, diambil acak dari seluruh 206 soal,
        15 kategori. Pilih jumlah soal untuk sesi ini.
      </p>
      <div className="space-y-3">
        {LENGTHS.map((n) => (
          <button
            key={n}
            onClick={() => setLength(n)}
            className="w-full flex items-center justify-between rounded-2xl border-2 border-ink-soft/15 bg-white px-5 py-4 text-left active:scale-[0.98] transition-transform"
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
