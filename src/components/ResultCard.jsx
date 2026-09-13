import { KKM } from '../lib/utils';
import { formatDuration } from '../lib/history';

export default function ResultCard({ result, onRetry, onExit, onReview }) {
  const passed = result.score >= KKM;
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="tekad-blob w-72 h-72 -top-10 -right-10" />
      <div className="text-6xl mb-4 relative">{passed ? '🎉' : '📚'}</div>
      <h1 className={`font-display font-extrabold text-5xl mb-1 relative ${passed ? 'text-ok' : 'text-tekad-red'}`}>
        {result.score}
      </h1>
      <p className={`font-display font-bold mb-6 relative ${passed ? 'text-ok' : 'text-bad'}`}>
        {passed ? 'LULUS' : 'BELUM LULUS'} · KKM {KKM}
      </p>
      <p className="text-ink-soft/60 mb-1 relative">
        Benar {result.correctCount} dari {result.total} soal
      </p>
      {typeof result.timeTakenSec === 'number' && (
        <p className="text-ink-soft/40 text-sm mb-8 relative">Waktu pengerjaan: {formatDuration(result.timeTakenSec)}</p>
      )}
      {typeof result.timeTakenSec !== 'number' && <div className="mb-8" />}
      {onReview && result.questions && (
        <button
          onClick={onReview}
          className="relative w-full max-w-xs rounded-2xl border-2 border-tekad-red py-3 font-display font-bold text-tekad-red mb-3"
        >
          Lihat Pembahasan
        </button>
      )}
      <button
        onClick={onRetry}
        className="btn-solid relative w-full max-w-xs rounded-2xl bg-tekad-red border-b-4 border-tekad-redDark py-3 font-display font-bold text-white"
      >
        Coba Lagi
      </button>
      <button onClick={onExit} className="relative mt-4 text-ink-soft/50 text-sm underline">
        Kembali ke Beranda
      </button>
    </div>
  );
}
