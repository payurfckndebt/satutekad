import questions from '../data/questions.json';

export default function HomeScreen({ onSelect, theme, onToggleTheme }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col relative overflow-hidden">
      <div className="tekad-blob w-72 h-72 -top-16 -right-16" />
      <div className="tekad-blob w-56 h-56 top-40 -left-20" />

      <div className="relative px-6 safe-top pb-6 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <img src="/tekad-mark.svg" alt="" className="h-11 w-11 rounded-xl" />
            <h1 className="font-display font-extrabold text-3xl text-ink">SatuTekad</h1>
          </div>
          <p className="text-ink-soft/60 text-sm">{questions.length} soal siap latihan, empat cara belajar.</p>
        </div>
        <div className="shrink-0 mt-1 flex items-center gap-2">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label="Ganti tema terang/gelap"
              className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-tekad-redSoft bg-paper-raised text-sm"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
          <button
            onClick={() => onSelect('history')}
            className="flex items-center gap-1.5 rounded-full border-2 border-tekad-redSoft bg-paper-raised px-3.5 py-2 text-xs font-bold text-tekad-red"
          >
            🕒 Riwayat
          </button>
        </div>
      </div>

      <div className="relative flex-1 px-5 space-y-3 pb-safe">
        <BigCard
          eyebrow="Try Out Terstruktur"
          title="Per Modul"
          desc="Jumlah soal & durasi menyesuaikan tiap modul, KKM 75."
          onClick={() => onSelect('permodul')}
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
          title="Latihan Berdasarkan Hari"
          desc="Materi dibagi per hari pelatihan dan per sesi."
          onClick={() => onSelect('harian')}
        />
        <BigCard
          eyebrow="Lintas Modul"
          title="Irisan Modul 1 & 2"
          desc="Soal asli ujian yang topiknya beririsan antar modul, ditampilkan berdampingan."
          badge="BARU"
          onClick={() => onSelect('irisan')}
        />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <SmallCard title="YDBBA" desc="Latihan fokus" onClick={() => onSelect('ydbba')} />
          <SmallCard title="Bank Soal" desc="Semua + pembahasan" onClick={() => onSelect('banksoal')} />
          <SmallCard title="Bahan Bacaan" desc="Rangkuman + prediksi" onClick={() => onSelect('bahanbacaan')} />
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
        filled ? 'bg-tekad-red border-tekad-red' : 'bg-paper-raised border-tekad-redSoft'
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
      className="rounded-2xl border-2 border-tekad-redSoft bg-paper-raised px-4 py-4 text-left active:scale-[0.98] transition-transform"
    >
      <h3 className="font-display font-bold text-ink text-sm mb-0.5">{title}</h3>
      <p className="text-ink-soft/60 text-xs leading-snug">{desc}</p>
    </button>
  );
}
