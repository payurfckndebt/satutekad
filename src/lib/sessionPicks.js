// Picks stay stable for the current browser session (sessionStorage), and are
// re-rolled the next time a fresh session starts (new tab/app launch) — or
// immediately, if the cached pick no longer belongs to the current pool
// (e.g. the pool was rescoped since the value was cached).

function readRaw(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function writeRaw(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore (e.g. private browsing / storage full)
  }
}

function shuffleCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TRIVIA_KEY = 'satutekad-trivia-qid';
const HIGHLIGHTS_KEY = 'satutekad-highlights';

/** One random question id for this session's trivia card, picked from `pool`. */
export function getSessionTriviaQuestionId(pool) {
  const ids = pool.map((q) => q.id);
  const cached = readRaw(TRIVIA_KEY);
  if (typeof cached === 'string' && ids.includes(cached)) return cached;
  const fresh = ids[Math.floor(Math.random() * ids.length)];
  writeRaw(TRIVIA_KEY, fresh);
  return fresh;
}

/** Overrides the session's trivia pick (e.g. after the user taps "shuffle"). */
export function setSessionTriviaQuestionId(id) {
  writeRaw(TRIVIA_KEY, id);
}

/** N random, distinct picks (by key) for this session's highlight carousel. */
export function getSessionHighlightKeys(allKeys, count) {
  const cached = readRaw(HIGHLIGHTS_KEY);
  if (Array.isArray(cached) && cached.length > 0 && cached.every((k) => allKeys.includes(k))) {
    return cached;
  }
  const fresh = shuffleCopy(allKeys).slice(0, count);
  writeRaw(HIGHLIGHTS_KEY, fresh);
  return fresh;
}
