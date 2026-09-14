import { useMemo, useState } from 'react';
import modul1Categories from '../data/modul1Categories.json';
import modul1Questions from '../data/modul1Questions.json';
import baseQuestions from '../data/questions.json';
import ExamRunner from '../components/ExamRunner';
import ResultFlow from '../components/ResultFlow';
import { buildModulExam, modulExamBreakdown, modul1TopicPool, TRYOUT_TARGET, TRYOUT_MINUTES, KKM } from '../lib/modulExam';

const MODULES = [
  { id: 1, name: 'Modul 1', desc: 'Pendekatan Pengawasan', locked: false },
  { id: 2, name: 'Modul 2', desc: 'Segera hadir', locked: true },
  { id: 3, name: 'Modul 3', desc: 'Segera hadir', locked: true },
  { id: 4, name: 'Modul 4', desc: 'Segera hadir', locked: true },
];

const SUBMODES = [
  {
    id: 'ai',
    title: 'Soal Campuran AI',
    desc: 'Semua materi ikut, dibagi rata — gabungan soal Kuis/Kisi-Kisi asli (kalau ada) dan soal buatan AI yang relevan dengan materinya.',
  },
  {
    id: 'kuiskisi',
    title: 'Soal Kuis dan Kisi2',
    desc: 'Hanya materi yang punya soal Kuis Kelas/Kisi-Kisi asli. Materi tanpa itu tidak diikutkan.',
  },
];

export default function PerModulScreen({ onExit }) {
  const [activeModul, setActiveModul] = useState(null);
  const [activeSubmode, setActiveSubmode] = useState(null);
  const [examSet, setExamSet] = useState(null);
  const [result, setResult] = useState(null);
  const [runKey, setRunKey] = useState(0);

  const categories = modul1Categories; // only Modul 1 has content for now

  function poolFor(mode) {
    return (slug) => modul1TopicPool(slug, mode, modul1Questions, baseQuestions);
  }

  const breakdowns = useMemo(() => {
    if (activeModul !== 1) return {};
    const out = {};
    for (const sm of SUBMODES) {
      out[sm.id] = modulExamBreakdown(categories, poolFor(sm.id), TRYOUT_TARGET);
    }
    return out;
  }, [activeModul]);

  if (result) {
    return (
      <ResultFlow
        result={result}
        onExit={onExit}
        onRetry={() => {
          setResult(null);
          setExamSet(null);
          setActiveSubmode(null);
        }}
      />
    );
  }

  if (examSet) {
    return (
      <ExamRunner
        key={runKey}
        title={`Modul ${activeModul} · ${SUBMODES.find((s) => s.id === activeSubmode)?.title}`}
        questions={examSet}
        timeLimitMin={TRYOUT_MINUTES}
        onFinish={setResult}
        onExit={onExit}
      />
    );
  }

  function startSubmode(sm) {
    const set = buildModulExam(categories, poolFor(sm.id), TRYOUT_TARGET);
    if (set.length === 0) return; // handled inline by disabling the button
    setActiveSubmode(sm.id);
    setExamSet(set);
    setRunKey((k) => k + 1);
  }

  if (activeModul) {
    return (
      <div className="min-h-screen bg-paper flex flex-col px-6 safe-top pb-safe">
        <button onClick={() => setActiveModul(null)} className="self-start text-ink text-2xl leading-none mb-4">←</button>
        <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Modul {activeModul}</h1>
        <p className="text-ink-soft/70 mb-6">
          {TRYOUT_TARGET} soal · {TRYOUT_MINUTES} menit · KKM {KKM}
        </p>

        <div className="space-y-4">
          {SUBMODES.map((sm) => {
            const breakdown = breakdowns[sm.id] || [];
            const total = breakdown.reduce((n, b) => n + b.count, 0);
            const disabled = total === 0;
            return (
              <div key={sm.id} className="rounded-2xl border-2 border-tekad-redSoft bg-white p-5">
                <h2 className="font-display font-bold text-ink mb-1">{sm.title}</h2>
                <p className="text-ink-soft/60 text-sm mb-3">{sm.desc}</p>
                {disabled ? (
                  <p className="text-xs text-bad font-semibold mb-3">
                    Belum ada soal Kuis/Kisi-Kisi untuk Modul {activeModul} — semua materi modul ini baru tersedia sebagai soal AI.
                  </p>
                ) : (
                  <p className="text-xs text-ink-soft/50 mb-3">
                    {total} soal siap · {breakdown.length} materi dipakai
                    {breakdown.length < categories.length ? ` (dari ${categories.length} total materi)` : ''}
                  </p>
                )}
                <button
                  onClick={() => startSubmode(sm)}
                  disabled={disabled}
                  className={`btn-solid w-full rounded-2xl border-b-4 py-3 font-display font-bold ${
                    disabled
                      ? 'bg-ink-soft/10 border-ink-soft/10 text-ink-soft/40'
                      : 'bg-tekad-red border-tekad-redDark text-white'
                  }`}
                >
                  Mulai Try Out
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 safe-top pb-safe">
      <button onClick={onExit} className="self-start text-ink text-2xl leading-none mb-4">←</button>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-2">Per Modul</h1>
      <p className="text-ink-soft/70 mb-8 leading-relaxed">
        Try out mengikuti struktur modul sertifikasi — {TRYOUT_TARGET} soal, {TRYOUT_MINUTES / 60} jam, KKM {KKM}.
      </p>
      <div className="space-y-3">
        {MODULES.map((m) => (
          <button
            key={m.id}
            disabled={m.locked}
            onClick={() => setActiveModul(m.id)}
            className={`w-full flex items-center gap-4 rounded-2xl border-2 px-5 py-5 text-left transition-transform ${
              m.locked ? 'border-ink-soft/10 bg-ink-soft/5 opacity-60' : 'border-tekad-redSoft bg-white active:scale-[0.98]'
            }`}
          >
            <span
              className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center font-display font-extrabold text-lg ${
                m.locked ? 'bg-ink-soft/20 text-ink-soft/50' : 'bg-tekad-red text-white'
              }`}
            >
              {m.locked ? '🔒' : m.id}
            </span>
            <span className="flex-1">
              <span className="block font-display font-bold text-ink">{m.name}</span>
              <span className="block text-ink-soft/50 text-xs mt-0.5">{m.desc}</span>
            </span>
            {!m.locked && <span className="text-ink-soft/30 text-xl">›</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
