import { useEffect, useMemo, useState } from 'react';
import { shuffle, KKM } from '../lib/utils';

export default function McqRunner({ title, questions, timeLimitMin, onFinish, onExit }) {
  const shuffled = useMemo(() => shuffle(questions), [questions]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // { correct: bool }
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMin ? timeLimitMin * 60 : null);

  const q = shuffled[index];

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      finish(answers);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  function choose(i) {
    if (selected !== null) return;
    setSelected(i);
  }

  function next() {
    const correct = selected === q.correctIndex;
    const nextAnswers = [...answers, { correct }];
    setAnswers(nextAnswers);
    setSelected(null);
    if (index + 1 >= shuffled.length) {
      finish(nextAnswers);
    } else {
      setIndex(index + 1);
    }
  }

  function finish(finalAnswers) {
    const correctCount = finalAnswers.filter((a) => a.correct).length;
    const score = Math.round((correctCount / shuffled.length) * 100);
    onFinish({ score, correctCount, total: shuffled.length });
  }

  const mm = secondsLeft !== null ? String(Math.floor(secondsLeft / 60)).padStart(2, '0') : null;
  const ss = secondsLeft !== null ? String(secondsLeft % 60).padStart(2, '0') : null;

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="px-4 pt-4 pb-3 sticky top-0 bg-paper z-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onExit} className="text-ink-soft/60 text-2xl leading-none">×</button>
          <div className="h-2 flex-1 rounded-full bg-ink-soft/15 overflow-hidden">
            <div
              className="h-full bg-tekad-red rounded-full transition-all"
              style={{ width: `${((index) / shuffled.length) * 100}%` }}
            />
          </div>
          {secondsLeft !== null && (
            <span className="font-display font-bold text-sm text-ink tabular-nums">{mm}:{ss}</span>
          )}
        </div>
        <p className="text-xs text-ink-soft/60 font-medium">
          {title} · Soal {index + 1}/{shuffled.length}
        </p>
      </header>

      <main className="flex-1 px-5 pt-2 pb-28">
        <h2 className="font-display font-bold text-xl text-ink leading-snug mb-6 whitespace-pre-line">
          {q.stem}
        </h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.correctIndex;
            let style = 'border-ink-soft/20 bg-paper-raised text-ink';
            if (selected !== null) {
              if (isCorrect) style = 'border-ok bg-ok/10 text-ok';
              else if (isSelected) style = 'border-bad bg-bad/10 text-bad';
              else style = 'border-transparent bg-ink-soft/5 text-ink-soft/40';
            }
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={selected !== null}
                className={`w-full text-left rounded-2xl border-2 px-4 py-3 font-medium transition-all ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </main>

      {selected !== null && (
        <div className="fixed inset-x-0 bottom-0 bg-paper-raised border-t border-ink-soft/10 px-5 py-4">
          <button
            onClick={next}
            className="btn-solid w-full rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-3 font-display font-bold text-white"
          >
            {index + 1 >= shuffled.length ? 'Lihat Hasil' : 'Soal Berikutnya'}
          </button>
        </div>
      )}
    </div>
  );
}

export { KKM };
