export default function ExplanationSheet({ correct, text, onContinue }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-slide-up">
      <div
        className={`px-5 pt-4 pb-6 rounded-t-3xl border-t-4 ${
          correct ? 'bg-ok/10 border-ok' : 'bg-bad/10 border-bad'
        } backdrop-blur-sm`}
        style={{ background: correct ? '#E8F6EE' : '#FBE7E9' }}
      >
        <div className={`flex items-center gap-2 font-display font-bold text-lg ${correct ? 'text-ok' : 'text-bad'}`}>
          <span className="text-2xl leading-none">{correct ? '✓' : '✕'}</span>
          {correct ? 'Benar!' : 'Belum tepat'}
        </div>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">{text}</p>
        <button
          onClick={onContinue}
          className={`btn-solid mt-4 w-full rounded-2xl py-3 font-display font-bold text-white ${
            correct ? 'bg-ok border-b-4 border-[#1F7A4C]' : 'bg-bad border-b-4 border-[#B23A3A]'
          }`}
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
