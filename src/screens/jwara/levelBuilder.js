import { shuffle, uid } from '../../lib/utils';
import sequences from '../../data/sequences.json';
import matchsets from '../../data/matchsets.json';

const TIER_FALLBACK = {
  easy: ['easy'],
  medium: ['medium', 'easy'],
  hard: ['hard', 'medium'],
};

function poolForTier(pool, tier) {
  const allowed = TIER_FALLBACK[tier] || ['easy', 'medium', 'hard'];
  const candidates = pool.filter((q) => allowed.includes(q.difficulty));
  return candidates.length >= 4 ? candidates : pool;
}

// Cycles through a category's (tier-filtered) question pool, reshuffling on
// wraparound, and packages the next batch into one level's worth of steps.
// cursorsByTier keys each tier's cursor separately so easy/medium/hard don't
// interfere with each other's rotation.
export function makeLevel(categorySlug, allQuestions, cursorsByTier, levelNumber, tier = 'easy') {
  const fullPool = allQuestions.filter((q) => q.categorySlug === categorySlug);
  const pool = poolForTier(fullPool, tier);

  if (!cursorsByTier[tier]) cursorsByTier[tier] = { order: [], pos: 0 };
  const cursorRef = cursorsByTier[tier];

  function nextN(n) {
    const out = [];
    while (out.length < n) {
      if (cursorRef.order.length === 0 || cursorRef.pos >= cursorRef.order.length) {
        cursorRef.order = shuffle(pool);
        cursorRef.pos = 0;
      }
      out.push(cursorRef.order[cursorRef.pos]);
      cursorRef.pos += 1;
    }
    return out;
  }

  const singles = nextN(4); // rapid, tapfill, swipe, rapid2
  const catSequences = sequences.filter((s) => s.categorySlug === categorySlug);
  const sequence = catSequences.length
    ? catSequences[levelNumber % catSequences.length]
    : sequences[levelNumber % sequences.length];
  const matchSet = matchsets.find((m) => m.categorySlug === categorySlug) || matchsets[0];

  const steps = [
    { id: uid(), kind: 'rapid', question: singles[0] },
    { id: uid(), kind: 'tapfill', question: singles[1] },
    { id: uid(), kind: 'swipe', statement: toStatement(singles[2]) },
    { id: uid(), kind: 'rapid', question: singles[3] },
    {
      id: uid(),
      kind: 'matchpairs',
      pairs: matchSet.pairs.map((p, i) => ({ id: `${categorySlug}-${i}`, left: p.left, right: p.right })),
    },
    { id: uid(), kind: 'dragsort', sequence },
  ];

  return steps;
}

// Turns a plain MCQ into a true/false statement for the swipe template.
// ~55% of the time pairs the stem with its correct option (statement is
// true); otherwise pairs it with a random wrong option (statement is false).
function toStatement(question) {
  const makeTrue = Math.random() < 0.55;
  let optionIndex = question.correctIndex;
  if (!makeTrue) {
    const wrongIdx = question.options.map((_, i) => i).filter((i) => i !== question.correctIndex);
    optionIndex = wrongIdx[Math.floor(Math.random() * wrongIdx.length)];
  }
  const opt = question.options[optionIndex];
  const stem = question.stem.replace(/\.\.\.\.*$/, '').replace(/\?$/, '').trim();
  const joiner = /adalah\s*\.*$/i.test(stem) ? '' : ' → ';
  return {
    text: `${stem}${joiner}${opt}`,
    isTrue: optionIndex === question.correctIndex,
    correctOption: question.options[question.correctIndex],
  };
}
