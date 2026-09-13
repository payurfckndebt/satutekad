import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '../lib/utils';
import { addHistoryEntry } from '../lib/history';

const LOW_TIME_THRESHOLD_SEC = 60;

export default function ExamRunner({ title, questions, timeLimitMin, onFinish, onExit }) {
  const shuffled = useMemo(() => shuffle(questions), [questions]);
  const total = shuffled.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array(total).fill(null));
  const [flagged, setFlagged] = useState(() => Array(total).fill(false));
  const [showNavigator, setShowNavigator] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showLowTimeWarning, setShowLowTimeWarning] = useState(false);
  const lowTimeShownRef = useRef(false);
  const startedAtRef = useRef(Date.now());

  const [secondsLeft, setSecondsLeft] = useState(timeLimitMin ? timeLimitMin * 60 : null);

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      finish();
      return;
    }
    if (secondsLeft <= LOW_TIME_THRESHOLD_SEC && !lowTimeShownRef.current) {
      lowTimeShownRef.current = true;
      setShowLowTimeWarning(true);
      setTimeout(() => setShowLowTimeWarning(false), 3500);
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const q = shuffled[currentIndex];
  const answeredCount = answers.filter((a) => a !== null).length;

  function selectOption(i) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = i;
      return next;
    });
  }

  function toggleFlag() {
    setFlagged((prev) => {
      const next = [...prev];
      next[currentIndex] = !next[currentIndex];
      return next;
    });
  }

  function goTo(i) {
    setCurrentIndex(i);
    setShowNavigator(false);
  }

  function finish() {
    const correctCount = shuffled.reduce((n, question, i) => n + (answers[i] === question.correctIndex ? 1 : 0), 0);
    const score = Math.round((correctCount / total) * 100);
    const timeTakenSec = Math.round((Date.now() - startedAtRef.current) / 1000);
    addHistoryEntry({ title, score, correctCount, total, timeTakenSec });
    onFinish({ score, correctCount, total, timeTakenSec });
  }

  const mm = secondsLeft !== null ? String(Math.floor(Math.max(0, secondsLeft) / 60)).padStart(2, '0') : null;
  const ss = secondsLeft !== null ? String(Math.max(0, secondsLeft) % 60).padStart(2, '0') : null;
  const timeLow = secondsLeft !== null && secondsLeft <= LOW_TIME_THRESHOLD_SEC;

  return (
    <div className="min-h-screen bg-paper flex flex-col relative">
      <header className="px-4 safe-top pb-3 sticky top-0 bg-paper z-20 border-b border-tekad-redSoft">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setShowExitConfirm(true)} className="text-ink-soft/60 text-2xl leading-none">×</button>
          <button
            onClick={() => setShowNavigator(true)}
            className="flex-1 text-left"
          >
            <span className="text-xs text-ink-soft/60 font-medium">{title}</span>
            <span className="block h-1.5 mt-1 rounded-full bg-tekad-redSoft overflow-hidden">
              <span
                className="block h-full bg-tekad-red rounded-full transition-all"
                style={{ width: `${(answeredCount / total) * 100}%` }}
              />
            </span>
          </button>
          {secondsLeft !== null && (
            <span className={`font-display font-bold text-sm tabular-nums ${timeLow ? 'text-bad animate-pulse' : 'text-ink'}`}>
              {mm}:{ss}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => setShowNavigator(true)} className="text-xs text-ink-soft/60 font-semibold underline">
            Soal {currentIndex + 1}/{total} · {answeredCount} terjawab
          </button>
          <button
            onClick={toggleFlag}
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              flagged[currentIndex] ? 'bg-tekad-red text-white' : 'bg-tekad-redSoft text-tekad-red'
            }`}
          >
            🚩 {flagged[currentIndex] ? 'Ditandai' : 'Tandai'}
          </button>
        </div>
      </header>

      {showLowTimeWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-pop">
          <div className="rounded-2xl bg-bad text-white text-sm font-bold px-4 py-2.5 shadow-lg">
            ⏰ Waktu tersisa kurang dari 1 menit!
          </div>
        </div>
      )}

      <main className="flex-1 px-5 pt-5 pb-28">
        <h2 className="font-display font-bold text-xl text-ink leading-snug mb-6 whitespace-pre-line">
          {q.stem}
        </h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const isSelected = answers[currentIndex] === i;
            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                className={`w-full text-left rounded-2xl border-2 px-4 py-3 font-medium transition-all ${
                  isSelected ? 'border-tekad-red bg-tekad-redSoft text-ink' : 'border-tekad-redSoft/60 bg-white text-ink'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-tekad-redSoft px-5 py-3 pb-safe flex gap-3">
        <button
          onClick={() => goTo(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex-1 rounded-2xl border-2 border-tekad-redSoft py-3 font-display font-bold text-ink disabled:opacity-30"
        >
          Sebelumnya
        </button>
        {currentIndex + 1 >= total ? (
          <button
            onClick={finish}
            className="btn-solid flex-[1.4] rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-3 font-display font-bold text-white"
          >
            Selesai
          </button>
        ) : (
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="btn-solid flex-[1.4] rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-3 font-display font-bold text-white"
          >
            Berikutnya
          </button>
        )}
      </div>

      {showNavigator && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <div className="flex-1 bg-ink/40" onClick={() => setShowNavigator(false)} />
          <div className="bg-white rounded-t-3xl px-5 pt-5 pb-safe animate-slide-up max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-ink">Navigasi Soal</h3>
              <button onClick={() => setShowNavigator(false)} className="text-ink-soft/50 text-xl">×</button>
            </div>
            <p className="text-xs text-ink-soft/60 mb-3">{answeredCount} dari {total} terjawab · {flagged.filter(Boolean).length} ditandai</p>
            <div className="grid grid-cols-6 gap-2 overflow-y-auto pb-4">
              {shuffled.map((_, i) => {
                const isAnswered = answers[i] !== null;
                const isFlagged = flagged[i];
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`relative h-11 rounded-xl border-2 font-display font-bold text-sm ${
                      isCurrent
                        ? 'border-ink bg-ink text-white'
                        : isAnswered
                        ? 'border-tekad-red bg-tekad-red text-white'
                        : 'border-tekad-redSoft bg-white text-ink-soft'
                    }`}
                  >
                    {i + 1}
                    {isFlagged && <span className="absolute -top-1.5 -right-1.5 text-xs">🚩</span>}
                  </button>
                );
              })}
            </div>
            <button
              onClick={finish}
              className="btn-solid mt-2 w-full rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-3 font-display font-bold text-white"
            >
              Selesai & Lihat Skor
            </button>
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setShowExitConfirm(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-xs w-full text-center animate-pop">
            <h3 className="font-display font-bold text-lg text-ink mb-2">Yakin mau keluar?</h3>
            <p className="text-ink-soft/60 text-sm mb-6">Progress try out ini akan hilang dan tidak tersimpan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-2xl border-2 border-tekad-redSoft py-2.5 font-display font-bold text-ink"
              >
                Batal
              </button>
              <button
                onClick={onExit}
                className="btn-solid flex-1 rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-2.5 font-display font-bold text-white"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
