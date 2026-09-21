import { useMemo, useState } from 'react';
import baseQuestions from '../data/questions.json';
import modul1Questions from '../data/modul1Questions.json';
import modul2Questions from '../data/modul2Questions.json';
import modul3Questions from '../data/modul3Questions.json';
import SourceBadge from './SourceBadge';
import { getSessionTriviaQuestionId } from '../lib/sessionPicks';

const ALL_QUESTIONS = [...baseQuestions, ...modul1Questions, ...modul2Questions, ...modul3Questions];

export default function TriviaCard() {
  const question = useMemo(() => {
    const qid = getSessionTriviaQuestionId(ALL_QUESTIONS);
    return ALL_QUESTIONS.find((q) => q.id === qid) || ALL_QUESTIONS[0];
  }, []);
  const [selected, setSelected] = useState(null);

  if (!question) return null;
  const answered = selected !== null;

  return (
    <div className="rounded-3xl border-2 border-tekad-redSoft bg-paper-raised px-5 py-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="rounded-full bg-ink text-white text-[10px] font-bold px-2.5 py-1">🎲 Trivia Hari Ini</span>
        <SourceBadge sourceType={question.sourceType} />
      </div>
      <h3 className="font-display font-bold text-ink leading-snug mb-3">{question.stem}</h3>
      <div className="space-y-2 mb-2">
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
              className={`w-full text-left rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium ${cls}`}
            >
              {opt}
              {answered && isCorrect && <span className="ml-2 text-ok font-bold">✓</span>}
            </button>
          );
        })}
      </div>
      {answered && question.pembahasan && (
        <p className="text-xs text-ink-soft/70 leading-relaxed bg-tekad-redSoft/40 rounded-xl px-3 py-2.5 mt-2">
          {question.pembahasan}
        </p>
      )}
      {!answered && <p className="text-xs text-ink-soft/40">Soal baru akan muncul lagi di sesi berikutnya.</p>}
    </div>
  );
}
