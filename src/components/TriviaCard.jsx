import { useState } from 'react';
import modul3Questions from '../data/modul3Questions.json';
import SourceBadge from './SourceBadge';
import { getSessionTriviaQuestionId, setSessionTriviaQuestionId } from '../lib/sessionPicks';
import { pick } from '../lib/utils';

export default function TriviaCard() {
  const [question, setQuestion] = useState(() => {
    const qid = getSessionTriviaQuestionId(modul3Questions);
    return modul3Questions.find((q) => q.id === qid) || modul3Questions[0];
  });
  const [selected, setSelected] = useState(null);

  function reroll() {
    const next = pick(modul3Questions.filter((q) => q.id !== question.id));
    setQuestion(next);
    setSelected(null);
    setSessionTriviaQuestionId(next.id);
  }

  if (!question) return null;
  const answered = selected !== null;

  return (
    <div className="relative">
      {/* stacked "deck" edges peeking out behind the top card */}
      <div className="absolute inset-x-2 -top-1.5 h-full rounded-2xl bg-tekad-redSoft/70 -z-10" />
      <div className="absolute inset-x-4 -top-3 h-full rounded-2xl bg-tekad-redSoft/40 -z-20" />

      <div className="rounded-2xl border-2 border-tekad-redSoft bg-paper-raised px-4 py-4 shadow-card">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="rounded-full bg-inkSolid text-white text-[10px] font-bold px-2 py-0.5">🎲 Trivia Modul 3</span>
          <SourceBadge sourceType={question.sourceType} />
        </div>
        <h3 className="font-display font-bold text-ink text-sm leading-snug mb-2.5">{question.stem}</h3>
        <div className="space-y-1.5 mb-2">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctIndex;
            const isPicked = i === selected;
            let cls = 'border-tekad-redSoft/60 text-ink';
            if (answered && isCorrect) cls = 'border-ok bg-okSoft text-ink';
            else if (answered && isPicked && !isCorrect) cls = 'border-bad bg-badSoft text-ink';
            return (
              <button
                key={i}
                onClick={() => !answered && setSelected(i)}
                disabled={answered}
                className={`w-full text-left rounded-lg border-2 px-2.5 py-1.5 text-xs font-medium ${cls}`}
              >
                {opt}
                {answered && isCorrect && <span className="ml-1.5 text-ok font-bold">✓</span>}
              </button>
            );
          })}
        </div>
        {answered && question.pembahasan && (
          <p className="text-[11px] text-ink-soft/70 leading-relaxed bg-tekad-redSoft/40 rounded-lg px-2.5 py-2 mt-1.5 mb-1">
            {question.pembahasan}
          </p>
        )}
        <button
          onClick={reroll}
          className="mt-1 flex items-center gap-1 text-xs font-bold text-tekad-red"
        >
          🔀 Acak soal lain
        </button>
      </div>
    </div>
  );
}
