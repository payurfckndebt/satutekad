import questions from '../data/questions.json';

export default function HomeScreen({ onSelect }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col relative overflow-hidden">
      <div className="tekad-blob w-72 h-72 -top-16 -right-16" />
      <div className="tekad-blob w-56 h-56 top-40 -left-20" />

      <div className="relative px-6 safe-top pb-6">
        <div className="flex items-center gap-3 mb-1.5">
          <img src="/tekad-mark.svg" alt="" className="h-11 w-11 rounded-xl" />
          <h1 className="font-display font-extrabold text-3xl text-ink">SatuTekad</h1>
        </div>
        <p className="text-ink-soft/60 text-sm">{questions.length} soal siap latihan, empat cara belajar.</p>
      </div>

      <div className="relative flex-1 px-5 space-y-3 pb-safe">
        <BigCard
          eyebrow="Simulasi Ujian"
          title="FullTek"
          desc="Try out dengan waktu, campuran seluruh materi."
          onClick={() => onSelect('tryout')}
          filled
        />
        <BigCard
          eyebrow="Mode Game"
          title="JWARA"
          desc="Nyawa, kombo, dan lima jenis mini-game ringan."
          badge="BARU"
          onClick={() => onSelect('jwara')}
        />
        <BigCard
          eyebrow="Terstruktur"
          title="Latihan Harian"
          desc="Materi dibagi per hari pelatihan, 4 hari."
          onClick={() => onSelect('harian')}
        />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <SmallCard title="YDBBA" desc="Latihan fokus" onClick={() => onSelect('ydbba')} />
          <SmallCard title="Bank Soal" desc="Semua + pembahasan" onClick={() => onSelect('banksoal')} />
        </div>
      </div>

      <p className="relative text-center text-ink-soft/30 text-xs pb-6 pt-8">SatuTekad · PCAM 9 &amp; MLE 2026</p>
    </div>
  );
}

function BigCard({ eyebrow, title, desc, onClick, badge, filled }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-3xl px-5 py-5 border-2 active:scale-[0.98] transition-transform ${
        filled ? 'bg-tekad-red border-tekad-red' : 'bg-white border-tekad-redSoft'
      }`}
    >
      <p className={`text-[11px] font-bold uppercase tracking-wide mb-1 ${filled ? 'text-white/70' : 'text-tekad-red'}`}>
        {eyebrow}
      </p>
      <div className="flex items-center gap-2 mb-1">
        <h2 className={`font-display font-extrabold text-xl ${filled ? 'text-white' : 'text-ink'}`}>{title}</h2>
        {badge && (
          <span className="rounded-full bg-ink text-white text-[10px] font-bold px-2 py-0.5">{badge}</span>
        )}
      </div>
      <p className={`text-sm leading-snug ${filled ? 'text-white/80' : 'text-ink-soft/70'}`}>{desc}</p>
    </button>
  );
}

function SmallCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border-2 border-tekad-redSoft bg-white px-4 py-4 text-left active:scale-[0.98] transition-transform"
    >
      <h3 className="font-display font-bold text-ink text-sm mb-0.5">{title}</h3>
      <p className="text-ink-soft/60 text-xs leading-snug">{desc}</p>
    </button>
  );
}
