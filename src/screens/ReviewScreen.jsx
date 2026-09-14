import { useMemo, useState } from 'react';
import SourceBadge from '../components/SourceBadge';

export default function ReviewScreen({ questions, answers, onBack }) {
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  const withStatus = useMemo(() => {
    return questions.map((q, i) => {
      const picked = answers[i];
      const status = picked === null || picked === undefined ? 'empty' : picked === q.correctIndex ? 'correct' : 'wrong';
      return { q, i, picked, status };
    });
  }, [questions, answers]);

  const counts = useMemo(() => {
    const c = { correct: 0, wrong: 0, empty: 0 };
    withStatus.forEach((item) => c[item.status]++);
    return c;
  }, [withStatus]);

  const filtered = filter === 'all' ? withStatus : withStatus.filter((item) => item.status === filter);

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="safe-top px-5 pb-3 sticky top-0 bg-paper z-10 border-b border-tekad-redSoft">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="text-ink text-2xl leading-none">←</button>
          <h1 className="font-display font-extrabold text-xl text-ink">Pembahasan</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 no-scrollbar">
          <Pill active={filter === 'all'} onClick={() => setFilter('all')}>Semua ({withStatus.length})</Pill>
          <Pill active={filter === 'wrong'} onClick={() => setFilter('wrong')} tone="bad">Salah ({counts.wrong})</Pill>
          <Pill active={filter === 'empty'} onClick={() => setFilter('empty')}>Kosong ({counts.empty})</Pill>
          <Pill active={filter === 'correct'} onClick={() => setFilter('correct')} tone="ok">Benar ({counts.correct})</Pill>
        </div>
      </header>

      <main className="flex-1 px-5 py-4 space-y-3 pb-safe">
        {filtered.length === 0 && (
          <p className="text-center text-ink-soft/50 text-sm py-10">Tidak ada soal di kategori ini.</p>
        )}
        {filtered.map(({ q, i, picked, status }) => (
          <QuestionReviewCard
            key={i}
            number={i + 1}
            q={q}
            picked={picked}
            status={status}
            open={openId === i}
            onToggle={() => setOpenId(openId === i ? null : i)}
          />
        ))}
      </main>
    </div>
  );
}

function Pill({ active, onClick, children, tone }) {
  const activeClass =
    tone === 'bad' ? 'bg-bad border-bad text-white' : tone === 'ok' ? 'bg-ok border-ok text-white' : 'bg-tekad-red border-tekad-red text-white';
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active ? activeClass : 'border-tekad-redSoft text-ink-soft bg-white'
      }`}
    >
      {children}
    </button>
  );
}

function QuestionReviewCard({ number, q, picked, status, open, onToggle }) {
  const badge = status === 'correct' ? { icon: '✓', cls: 'bg-ok text-white' } : status === 'wrong' ? { icon: '✕', cls: 'bg-bad text-white' } : { icon: '–', cls: 'bg-ink-soft/30 text-white' };
  return (
    <div className="rounded-2xl border-2 border-tekad-redSoft bg-white overflow-hidden">
      <button onClick={onToggle} className="w-full text-left px-4 py-3.5 flex items-start gap-3">
        <span className={`mt-0.5 shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${badge.cls}`}>
          {badge.icon}
        </span>
        <div className="flex-1">
          <SourceBadge sourceType={q.sourceType} className="mb-1.5" />
          <p className="font-medium text-ink text-sm leading-snug">
            <span className="text-ink-soft/40 font-normal">Soal {number}. </span>
            {q.stem}
          </p>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 animate-fade-up">
          <div className="space-y-1.5 mb-3">
            {q.options.map((opt, idx) => {
              const isCorrectOpt = idx === q.correctIndex;
              const isPickedWrong = idx === picked && idx !== q.correctIndex;
              let cls = 'bg-tekad-redSoft/30 text-ink-soft';
              if (isCorrectOpt) cls = 'bg-okSoft text-ok font-semibold';
              else if (isPickedWrong) cls = 'bg-badSoft text-bad font-semibold';
              return (
                <div key={idx} className={`rounded-xl px-3 py-2 text-sm ${cls}`}>
                  {isCorrectOpt && '✓ '}
                  {isPickedWrong && '✕ '}
                  {opt}
                  {isPickedWrong && <span className="block text-[11px] font-normal mt-0.5">Jawabanmu</span>}
                </div>
              );
            })}
            {status === 'empty' && (
              <p className="text-xs text-ink-soft/50 italic px-1">Soal ini tidak dijawab.</p>
            )}
          </div>
          <div className="rounded-xl bg-ink/5 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide font-bold text-ink-soft/60 mb-1">Pembahasan</p>
            <p className="text-sm text-ink-soft leading-relaxed">{q.pembahasan}</p>
          </div>
        </div>
      )}
    </div>
  );
}
