const KEY = 'satutekad_history_v1';
const MAX_ENTRIES = 100;

export function getHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry) {
  try {
    const list = getHistory();
    list.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      ...entry,
    });
    const trimmed = list.slice(0, MAX_ENTRIES);
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // storage unavailable (private browsing, quota, etc.) — fail silently
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function formatDuration(sec) {
  if (!sec && sec !== 0) return '-';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s} detik`;
  return `${m} menit ${s} detik`;
}

export function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}
