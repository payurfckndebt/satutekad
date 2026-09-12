import { KKM } from '../lib/utils';

export default function ResultCard({ result, onRetry, onExit }) {
  const passed = result.score >= KKM;
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
      <h1 className="font-display font-extrabold text-3xl text-white mb-1">{result.score}</h1>
      <p className={`font-display font-bold mb-6 ${passed ? 'text-ok' : 'text-bad'}`}>
        {passed ? 'LULUS' : 'BELUM LULUS'} · KKM {KKM}
      </p>
      <p className="text-white/60 mb-8">
        Benar {result.correctCount} dari {result.total} soal
      </p>
      <button
        onClick={onRetry}
        className="btn-solid w-full max-w-xs rounded-2xl bg-tekad-gold border-b-4 border-tekad-goldDark py-3 font-display font-bold text-ink"
      >
        Coba Lagi
      </button>
      <button onClick={onExit} className="mt-4 text-white/50 text-sm underline">
        Kembali ke Beranda
      </button>
    </div>
  );
}
