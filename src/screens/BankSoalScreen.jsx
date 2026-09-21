import { useMemo, useState } from 'react';
import baseQuestions from '../data/questions.json';
import baseCategories from '../data/categories.json';
import modul3Questions from '../data/modul3Questions.json';
import modul3Categories from '../data/modul3Categories.json';
import SourceBadge from '../components/SourceBadge';
import { shuffleQuestionOptions } from '../lib/utils';

// Bank Soal covers the original Modul 1 set plus the two Modul 3 materials
// (Manajemen Risiko & Cyber Risk).
const questions = [...baseQuestions, ...modul3Questions];
const categories = [...baseCategories, ...modul3Categories];

export default function BankSoalScreen({ onExit }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (activeCategory !== 'all' && q.categorySlug !== activeCategory) return false;
      if (query.trim() && !q.stem.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="safe-top px-5 pb-3 sticky top-0 bg-paper z-10 border-b border-tekad-redSoft">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onExit} className="text-ink text-2xl leading-none">←</button>
          <h1 className="font-display font-extrabold text-xl text-ink">Bank Soal</h1>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari soal..."
          className="w-full rounded-2xl border-2 border-tekad-redSoft bg-tekad-redSoft/40 px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-tekad-red"
        />
        <div className="flex gap-2 overflow-x-auto mt-3 pb-1 -mx-5 px-5 no-scrollbar">
          <Pill active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
            Semua ({questions.length})
          </Pill>
          {categories.map((c) => (
            <Pill key={c.slug} active={activeCategory === c.slug} onClick={() => setActiveCategory(c.slug)}>
              {c.name} ({c.count})
            </Pill>
          ))}
        </div>
      </header>

      <main className="flex-1 px-5 py-4 space-y-3 pb-safe">
        {filtered.length === 0 && (
          <p className="text-center text-ink-soft/50 text-sm py-10">Tidak ada soal yang cocok.</p>
        )}
        {filtered.map((q) => (
          <QuestionCard key={q.id} q={q} open={openId === q.id} onToggle={() => setOpenId(openId === q.id ? null : q.id)} />
        ))}
      </main>
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active ? 'bg-tekad-red border-tekad-red text-white' : 'border-tekad-redSoft text-ink-soft bg-paper-raised'
      }`}
    >
      {children}
    </button>
  );
}

function QuestionCard({ q, open, onToggle }) {
  const shuffledQ = useMemo(() => shuffleQuestionOptions(q), [q.id]);
  return (
    <div className="rounded-2xl border-2 border-tekad-redSoft bg-paper-raised overflow-hidden">
      <button onClick={onToggle} className="w-full text-left px-4 py-3.5 flex items-start gap-3">
        <span className="mt-0.5 text-ink-soft/40 text-lg leading-none">{open ? '−' : '+'}</span>
        <span className="flex-1">
          <SourceBadge sourceType={q.sourceType} className="mb-1.5" />
          <span className="block font-medium text-ink text-sm leading-snug">{q.stem}</span>
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 animate-fade-up">
          <div className="space-y-1.5 mb-3">
            {shuffledQ.options.map((opt, i) => (
              <div
                key={i}
                className={`rounded-xl px-3 py-2 text-sm ${
                  i === shuffledQ.correctIndex ? 'bg-okSoft text-ok font-semibold' : 'bg-tekad-redSoft/30 text-ink-soft'
                }`}
              >
                {i === shuffledQ.correctIndex && '✓ '}
                {opt}
              </div>
            ))}
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
