import { useRef, useState } from 'react';
import { makeLevel } from './levelBuilder';
import LivesBar from '../../components/LivesBar';
import ProgressBar from '../../components/ProgressBar';
import StreakToast from '../../components/StreakToast';
import ExplanationSheet from '../../components/ExplanationSheet';
import Confetti from '../../components/Confetti';
import RapidElimination from './steps/RapidElimination';
import TapToFill from './steps/TapToFill';
import TrueFalseSwipe from './steps/TrueFalseSwipe';
import MatchPairs from './steps/MatchPairs';
import DragSort from './steps/DragSort';

const MAX_LIVES = 5;
const TIER_LABEL = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' };
const NEXT_TIER = { easy: 'medium', medium: 'hard', hard: null };

function explanationFor(step, correct) {
  if (step.kind === 'matchpairs') {
    return 'Semua pasangan cocok — mantap!';
  }
  if (step.kind === 'dragsort') {
    return correct
      ? 'Urutan yang kamu susun sudah tepat.'
      : 'Urutannya belum pas. Kamu akan coba lagi di sesi Ulangi.';
  }
  if (step.kind === 'swipe') {
    return step.statement.isTrue === correct
      ? correct
        ? `Betul, pernyataan ini benar.`
        : ''
      : `Jawaban yang tepat: "${step.statement.correctOption}".`;
  }
  const opt = step.question.options[step.question.correctIndex];
  return correct ? `Betul — "${opt}".` : `Bukan itu. Jawaban yang tepat: "${opt}".`;
}

export default function JwaraSession({ category, allQuestions, tier = 'easy', onExit, onTierPassed, onGoToTier }) {
  const cursorsByTier = useRef({});
  const [levelNumber, setLevelNumber] = useState(0);
  const [steps, setSteps] = useState(() => makeLevel(category.slug, allQuestions, cursorsByTier.current, 0, tier));

  const [phase, setPhase] = useState('forward'); // forward | retry | complete | gameover
  const [stepIndex, setStepIndex] = useState(0);
  const [retryQueue, setRetryQueue] = useState([]); // front of queue = current retry item

  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  const [pendingResult, setPendingResult] = useState(null); // { correct, text }

  const totalForward = steps.length;
  const progressDone = phase === 'retry' || phase === 'complete' ? totalForward : stepIndex;
  const progressMax = totalForward + (phase !== 'forward' ? retryQueue.length : 0);

  const currentStep = phase === 'retry' ? retryQueue[0] : steps[stepIndex];
  const nextTier = NEXT_TIER[tier];

  function handleAnswered(correct) {
    setAttemptCount((n) => n + 1);
    const text = explanationFor(currentStep, correct);
    setPendingResult({ correct, text });

    if (phase === 'forward') {
      if (correct) {
        setStreak((s) => s + 1);
        setXp((x) => x + 10);
        setCorrectCount((c) => c + 1);
      } else {
        setStreak(0);
        setRetryQueue((q) => [...q, currentStep]);
        setLives((l) => Math.max(0, l - 1));
      }
    } else if (phase === 'retry') {
      if (correct) setXp((x) => x + 5);
    }
  }

  function handleContinue() {
    const wasCorrect = pendingResult?.correct;
    setPendingResult(null);

    if (phase === 'forward') {
      if (!wasCorrect && lives <= 0) {
        setPhase('gameover');
        return;
      }
      const next = stepIndex + 1;
      if (next >= steps.length) {
        if (retryQueue.length > 0) {
          setPhase('retry');
        } else {
          setPhase('complete');
          if (onTierPassed) onTierPassed(tier);
        }
      } else {
        setStepIndex(next);
      }
      return;
    }

    if (phase === 'retry') {
      if (wasCorrect) {
        const rest = retryQueue.slice(1);
        setRetryQueue(rest);
        if (rest.length === 0) {
          setPhase('complete');
          if (onTierPassed) onTierPassed(tier);
        }
      } else {
        // send the missed item to the back of the retry queue
        setRetryQueue([...retryQueue.slice(1), retryQueue[0]]);
      }
    }
  }

  function resetRunState() {
    setLives(MAX_LIVES);
    setStreak(0);
    setStepIndex(0);
    setRetryQueue([]);
    setPendingResult(null);
    setXp(0);
    setCorrectCount(0);
    setAttemptCount(0);
    setPhase('forward');
  }

  function retryLevel() {
    resetRunState();
    setSteps(makeLevel(category.slug, allQuestions, cursorsByTier.current, levelNumber, tier));
  }

  function nextLevel() {
    const n = levelNumber + 1;
    setLevelNumber(n);
    resetRunState();
    setSteps(makeLevel(category.slug, allQuestions, cursorsByTier.current, n, tier));
  }

  if (phase === 'gameover') {
    return (
      <div className="min-h-screen bg-tekad-red flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">💔</div>
        <h1 className="font-display font-extrabold text-2xl text-white mb-2">Nyawa Habis</h1>
        <p className="text-white/60 mb-8 max-w-xs">
          Tenang, level ini akan diulang dari awal. Fokus lagi, kamu pasti bisa.
        </p>
        <button
          onClick={retryLevel}
          className="btn-solid w-full max-w-xs rounded-2xl bg-white border-b-4 border-white/40 py-3 font-display font-bold text-tekad-red"
        >
          Ulangi Level
        </button>
        <button onClick={onExit} className="mt-4 text-white/50 text-sm underline">
          Keluar ke peta unit
        </button>
      </div>
    );
  }

  if (phase === 'complete') {
    const accuracy = attemptCount ? Math.round((correctCount / totalForward) * 100) : 100;
    return (
      <div className="min-h-screen bg-tekad-red flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <Confetti />
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="font-display font-extrabold text-2xl text-white mb-1">Tingkat {TIER_LABEL[tier]} Selesai!</h1>
        <p className="text-white/60 mb-6">{category.name}</p>
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-8">
          <Stat label="Akurasi" value={`${accuracy}%`} />
          <Stat label="XP" value={`+${xp}`} />
          <Stat label="Nyawa" value={`${lives}/${MAX_LIVES}`} />
        </div>
        {nextTier ? (
          <button
            onClick={() => onGoToTier && onGoToTier(nextTier)}
            className="btn-solid w-full max-w-xs rounded-2xl bg-white border-b-4 border-white/40 py-3 font-display font-bold text-tekad-red"
          >
            Lanjut ke Tingkat {TIER_LABEL[nextTier]} →
          </button>
        ) : (
          <button
            onClick={nextLevel}
            className="btn-solid w-full max-w-xs rounded-2xl bg-white border-b-4 border-white/40 py-3 font-display font-bold text-tekad-red"
          >
            Latihan Lagi
          </button>
        )}
        {nextTier && (
          <button onClick={nextLevel} className="mt-3 text-white/70 text-sm underline">
            Ulangi tingkat ini dulu
          </button>
        )}
        <button onClick={onExit} className="mt-3 text-white/50 text-sm underline">
          Keluar ke peta unit
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="px-4 pt-4 pb-3 flex items-center gap-3 bg-paper sticky top-0 z-30">
        <button onClick={onExit} className="text-ink-soft/60 text-2xl leading-none">×</button>
        <ProgressBar value={progressDone} max={progressMax} />
        <LivesBar lives={lives} max={MAX_LIVES} />
      </header>

      {streak >= 3 && !pendingResult && <StreakToast streak={streak} />}

      <main className="flex-1 px-5 pt-4 pb-28">
        <p className="mb-3 inline-flex items-center gap-2">
          <span className="rounded-full bg-tekad-redSoft text-tekad-red text-xs font-bold px-3 py-1">
            Tingkat {TIER_LABEL[tier]}
          </span>
          {phase === 'retry' && (
            <span className="rounded-full bg-tekad-red/15 text-tekad-redDark text-xs font-bold px-3 py-1">
              Sesi Ulangi · {retryQueue.length} tersisa
            </span>
          )}
        </p>
        <StepRenderer step={currentStep} onAnswered={handleAnswered} locked={!!pendingResult} />
      </main>

      {pendingResult && (
        <ExplanationSheet
          correct={pendingResult.correct}
          text={pendingResult.text}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}

function StepRenderer({ step, onAnswered, locked }) {
  const wrapped = (correct) => {
    if (locked) return;
    onAnswered(correct);
  };
  switch (step.kind) {
    case 'rapid':
      return <RapidElimination key={step.id} question={step.question} onAnswered={wrapped} />;
    case 'tapfill':
      return <TapToFill key={step.id} question={step.question} onAnswered={wrapped} />;
    case 'swipe':
      return <TrueFalseSwipe key={step.id} statement={step.statement} onAnswered={wrapped} />;
    case 'matchpairs':
      return <MatchPairs key={step.id} pairs={step.pairs} onAnswered={wrapped} />;
    case 'dragsort':
      return <DragSort key={step.id} sequence={step.sequence} onAnswered={wrapped} />;
    default:
      return null;
  }
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/15 border border-white/25 py-3">
      <div className="font-display font-extrabold text-lg text-white">{value}</div>
      <div className="text-[11px] text-white/70 uppercase tracking-wide">{label}</div>
    </div>
  );
}
