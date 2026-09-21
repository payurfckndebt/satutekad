import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle, shuffleQuestionOptions } from '../lib/utils';
import { addHistoryEntry } from '../lib/history';
import SourceBadge from './SourceBadge';

const LOW_TIME_THRESHOLD_SEC = 60;
const DEFAULT_PAGE_SIZE = 10;

export default function ExamRunner({ title, questions, timeLimitMin, pageSize = DEFAULT_PAGE_SIZE, onFinish, onExit }) {
  const PAGE_SIZE = pageSize;
  const shuffled = useMemo(() => shuffle(questions).map(shuffleQuestionOptions), [questions]);
  const total = shuffled.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState(() => Array(total).fill(null));
  const [flagged, setFlagged] = useState(() => Array(total).fill(false));
  const [showNavigator, setShowNavigator] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showLowTimeWarning, setShowLowTimeWarning] = useState(false);
  const lowTimeShownRef = useRef(false);
  const startedAtRef = useRef(Date.now());
  const mainRef = useRef(null);

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

  const pageStart = currentPage * PAGE_SIZE;
  const pageQuestions = shuffled.slice(pageStart, pageStart + PAGE_SIZE);
  const answeredCount = answers.filter((a) => a !== null).length;

  function selectOption(qIndex, optIndex) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  }

  function toggleFlag(qIndex) {
    setFlagged((prev) => {
      const next = [...prev];
      next[qIndex] = !next[qIndex];
      return next;
    });
  }

  function goToPage(p) {
    setCurrentPage(Math.min(Math.max(0, p), totalPages - 1));
    setShowNavigator(false);
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }

  function goToQuestion(qIndex) {
    goToPage(Math.floor(qIndex / PAGE_SIZE));
  }

  function finish() {
    const correctCount = shuffled.reduce((n, question, i) => n + (answers[i] === question.correctIndex ? 1 : 0), 0);
    const score = Math.round((correctCount / total) * 100);
    const timeTakenSec = Math.round((Date.now() - startedAtRef.current) / 1000);
    addHistoryEntry({ title, score, correctCount, total, timeTakenSec });
    onFinish({ score, correctCount, total, timeTakenSec, questions: shuffled, answers });
  }

  function requestSubmit() {
    setShowSubmitConfirm(true);
  }

  const mm = secondsLeft !== null ? String(Math.floor(Math.max(0, secondsLeft) / 60)).padStart(2, '0') : null;
  const ss = secondsLeft !== null ? String(Math.max(0, secondsLeft) % 60).padStart(2, '0') : null;
  const timeLow = secondsLeft !== null && secondsLeft <= LOW_TIME_THRESHOLD_SEC;
  const isLastPage = currentPage + 1 >= totalPages;

  return (
    <div className="min-h-screen bg-paper flex relative">
      <div className="flex-1 flex flex-col min-w-0 lg:mr-72">
        <header className="px-4 safe-top pb-3 sticky top-0 bg-paper z-20 border-b border-tekad-redSoft">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setShowExitConfirm(true)} className="text-ink-soft/60 text-2xl leading-none">×</button>
            <button onClick={() => setShowNavigator(true)} className="flex-1 text-left lg:pointer-events-none">
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
            <button onClick={() => setShowNavigator(true)} className="text-xs text-ink-soft/60 font-semibold underline lg:no-underline lg:pointer-events-none">
              {PAGE_SIZE === 1
                ? `Soal ${pageStart + 1} dari ${total}`
                : `Halaman ${currentPage + 1}/${totalPages} · Soal ${pageStart + 1}-${Math.min(pageStart + PAGE_SIZE, total)} dari ${total}`}{' '}
              · {answeredCount} terjawab
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

        <main ref={mainRef} className="flex-1 px-5 pt-5 pb-28 space-y-8 overflow-y-auto">
          {pageQuestions.map((q, i) => {
            const qIndex = pageStart + i;
            return (
              <div key={qIndex} className="pb-6 border-b border-tekad-redSoft last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-ink text-white text-[10px] font-bold h-6 w-6 flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <SourceBadge sourceType={q.sourceType} />
                  </div>
                  <button
                    onClick={() => toggleFlag(qIndex)}
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      flagged[qIndex] ? 'bg-tekad-red text-white' : 'bg-tekad-redSoft text-tekad-red'
                    }`}
                  >
                    🚩 {flagged[qIndex] ? 'Ditandai' : 'Tandai'}
                  </button>
                </div>
                <h2 className="font-display font-bold text-lg text-ink leading-snug mb-4 whitespace-pre-line">
                  {q.stem}
                </h2>
                <div className="space-y-2.5">
                  {q.options.map((opt, oi) => {
                    const isSelected = answers[qIndex] === oi;
                    return (
                      <button
                        key={oi}
                        onClick={() => selectOption(qIndex, oi)}
                        className={`w-full text-left rounded-2xl border-2 px-4 py-3 font-medium transition-all ${
                          isSelected ? 'border-tekad-red bg-tekad-redSoft text-ink' : 'border-tekad-redSoft/60 bg-paper-raised text-ink'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>

        <div className="fixed inset-x-0 bottom-0 lg:right-72 bg-paper-raised border-t border-tekad-redSoft px-5 py-3 pb-safe flex gap-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex-1 rounded-2xl border-2 border-tekad-redSoft py-3 font-display font-bold text-ink disabled:opacity-30"
          >
            {PAGE_SIZE === 1 ? 'Soal Sebelumnya' : 'Halaman Sebelumnya'}
          </button>
          {isLastPage ? (
            <button
              onClick={requestSubmit}
              className="btn-solid flex-[1.4] rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-3 font-display font-bold text-white"
            >
              Selesai
            </button>
          ) : (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="btn-solid flex-[1.4] rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-3 font-display font-bold text-white"
            >
              {PAGE_SIZE === 1 ? 'Soal Berikutnya' : 'Halaman Berikutnya'}
            </button>
          )}
        </div>
      </div>

      {/* Right-side question navigator: persistent sidebar on large screens, slide-over drawer on mobile */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-72 bg-paper-raised border-l border-tekad-redSoft flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          showNavigator ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 safe-top">
          <h3 className="font-display font-bold text-ink">Navigasi Soal</h3>
          <button onClick={() => setShowNavigator(false)} className="text-ink-soft/50 text-xl lg:hidden">×</button>
        </div>
        <p className="text-xs text-ink-soft/60 px-5 pt-2 pb-3">
          {answeredCount} dari {total} terjawab · {flagged.filter(Boolean).length} ditandai
        </p>
        <div className="flex-1 overflow-y-auto px-5">
          <div className="grid grid-cols-5 gap-2 pb-4">
            {shuffled.map((_, i) => {
              const isAnswered = answers[i] !== null;
              const isFlagged = flagged[i];
              const isOnCurrentPage = Math.floor(i / PAGE_SIZE) === currentPage;
              return (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  className={`relative h-11 rounded-xl border-2 font-display font-bold text-sm ${
                    isOnCurrentPage
                      ? 'border-ink bg-ink text-white'
                      : isAnswered
                      ? 'border-tekad-red bg-tekad-red text-white'
                      : 'border-tekad-redSoft bg-paper text-ink-soft'
                  }`}
                >
                  {i + 1}
                  {isFlagged && <span className="absolute -top-1.5 -right-1.5 text-xs">🚩</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="px-5 pb-safe pt-2">
          <button
            onClick={requestSubmit}
            className="btn-solid w-full rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-3 font-display font-bold text-white"
          >
            Selesai &amp; Lihat Skor
          </button>
        </div>
      </aside>
      {showNavigator && (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setShowNavigator(false)} />
      )}

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setShowSubmitConfirm(false)} />
          <div className="relative bg-paper-raised rounded-3xl p-6 max-w-xs w-full text-center animate-pop">
            <h3 className="font-display font-bold text-lg text-ink mb-2">Yakin mau selesaikan?</h3>
            <p className="text-ink-soft/60 text-sm mb-1">
              {answeredCount < total
                ? `Masih ada ${total - answeredCount} soal yang belum dijawab.`
                : 'Semua soal sudah dijawab.'}
            </p>
            {secondsLeft !== null && (
              <p className="text-ink-soft/60 text-sm mb-6">Waktu tersisa: {mm}:{ss}.</p>
            )}
            {secondsLeft === null && <div className="mb-6" />}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 rounded-2xl border-2 border-tekad-redSoft py-2.5 font-display font-bold text-ink"
              >
                Batal
              </button>
              <button
                onClick={finish}
                className="btn-solid flex-1 rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-2.5 font-display font-bold text-white"
              >
                Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setShowExitConfirm(false)} />
          <div className="relative bg-paper-raised rounded-3xl p-6 max-w-xs w-full text-center animate-pop">
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
