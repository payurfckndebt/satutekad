import { useState } from 'react';
import { getHistory, clearHistory, formatDuration, formatDate } from '../lib/history';
import { KKM } from '../lib/utils';

export default function HistoryScreen({ onExit }) {
  const [history, setHistory] = useState(() => getHistory());

  function handleClear() {
    clearHistory();
    setHistory([]);
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col px-6 safe-top pb-safe">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onExit} className="text-ink text-2xl leading-none">←</button>
        <h1 className="font-display font-extrabold text-2xl text-ink">Riwayat</h1>
      </div>
      <p className="text-ink-soft/60 text-sm mb-6">
        Tersimpan di perangkat ini saja — {history.length} percobaan.
      </p>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="text-5xl mb-3">🗂️</div>
          <p className="text-ink-soft/50 text-sm">Belum ada riwayat try out. Selesaikan satu sesi untuk mulai tersimpan di sini.</p>
        </div>
      ) : (
        <div className="space-y-3 pb-6">
          {history.map((h) => {
            const passed = h.score >= KKM;
            return (
              <div key={h.id} className="rounded-2xl border-2 border-tekad-redSoft bg-paper-raised px-4 py-3.5">
                <div className="flex items-start justify-between mb-1.5">
                  <span className="font-display font-bold text-ink text-sm">{h.title}</span>
                  <span className={`font-display font-extrabold text-lg ${passed ? 'text-ok' : 'text-tekad-red'}`}>
                    {h.score}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-soft/60">
                  <span>Benar {h.correctCount}/{h.total} · {formatDuration(h.timeTakenSec)}</span>
                  <span>{formatDate(h.date)}</span>
                </div>
              </div>
            );
          })}
          <button onClick={handleClear} className="w-full text-center text-ink-soft/40 text-xs underline pt-3 pb-6">
            Hapus semua riwayat
          </button>
        </div>
      )}
    </div>
  );
}
