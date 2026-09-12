import questions from '../data/questions.json';

export default function HomeScreen({ onSelect }) {
  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <div className="px-6 pt-14 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <img src="/tekad-mark.svg" alt="" className="h-10 w-10" />
          <h1 className="font-display font-extrabold text-3xl text-white">SatuTekad</h1>
        </div>
        <p className="text-white/50 text-sm">
          Try out sertifikasi PCAM 9 & MLE 2026 · {questions.length} soal siap latihan
        </p>
      </div>

      <div className="flex-1 px-5 space-y-4">
        <ModeCard
          accent="bg-white"
          title="Try Out Keseluruhan"
          desc="Simulasi ujian dengan waktu — campuran soal terlampir dan buatan Claude."
          onClick={() => onSelect('tryout')}
        />
        <ModeCard
          accent="bg-white"
          title="YDBBA"
          desc="Latihan fokus khusus soal yang sudah ada di file materi kalian."
          onClick={() => onSelect('ydbba')}
        />
        <ModeCard
          accent="bg-tekad-gold"
          dark
          title="JWARA"
          desc="Mode game ringan bergaya Duolingo — 5 nyawa, kombo, dan lima jenis mini-game."
          badge="BARU"
          onClick={() => onSelect('jwara')}
        />
      </div>

      <p className="text-center text-white/25 text-xs pb-6 pt-8">SatuTekad · dari AALKADA, untuk PCAM 9 &amp; MLE 2026</p>
    </div>
  );
}

function ModeCard({ title, desc, onClick, accent, dark, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-3xl px-5 py-5 border-2 border-transparent active:scale-[0.98] transition-transform ${accent}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <h2 className="font-display font-extrabold text-lg text-ink">{title}</h2>
        {badge && (
          <span className="rounded-full bg-ink text-white text-[10px] font-bold px-2 py-0.5">{badge}</span>
        )}
      </div>
      <p className="text-ink-soft/70 text-sm leading-snug">{desc}</p>
    </button>
  );
}
