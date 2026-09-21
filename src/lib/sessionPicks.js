// Picks stay stable for the current browser session (sessionStorage), and are
// re-rolled the next time a fresh session starts (new tab/app launch).

function getSession(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);
  } catch {
    // ignore
  }
  const value = fallback();
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore (e.g. private browsing / storage full)
  }
  return value;
}

function shuffleCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One random question id for this session's trivia card, picked from `pool`. */
export function getSessionTriviaQuestionId(pool) {
  const ids = pool.map((q) => q.id);
  return getSession('satutekad-trivia-qid', () => ids[Math.floor(Math.random() * ids.length)]);
}

/** N random, distinct picks (by key) for this session's highlight carousel. */
export function getSessionHighlightKeys(allKeys, count) {
  return getSession('satutekad-highlights', () => shuffleCopy(allKeys).slice(0, count));
}
