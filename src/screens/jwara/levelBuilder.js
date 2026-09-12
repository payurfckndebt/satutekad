import { shuffle, uid } from '../../lib/utils';
import sequences from '../../data/sequences.json';

// Cycles through a category's question pool (reshuffling on wraparound) and
// packages the next batch into one level's worth of steps.
export function makeLevel(categorySlug, allQuestions, cursorRef, levelNumber) {
  const pool = allQuestions.filter((q) => q.categorySlug === categorySlug);

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
  const matchSrc = nextN(Math.min(4, pool.length));
  const catSequences = sequences.filter((s) => s.categorySlug === categorySlug);
  const sequence = catSequences.length
    ? catSequences[levelNumber % catSequences.length]
    : sequences[levelNumber % sequences.length];

  const steps = [
    { id: uid(), kind: 'rapid', question: singles[0] },
    { id: uid(), kind: 'tapfill', question: singles[1] },
    { id: uid(), kind: 'swipe', statement: toStatement(singles[2]) },
    { id: uid(), kind: 'rapid', question: singles[3] },
    {
      id: uid(),
      kind: 'matchpairs',
      pairs: matchSrc.map((q) => ({
        id: q.id,
        left: truncate(q.stem, 70),
        right: q.options[q.correctIndex],
      })),
    },
    { id: uid(), kind: 'dragsort', sequence },
  ];

  return steps;
}

function truncate(text, n) {
  return text.length > n ? text.slice(0, n - 1).trimEnd() + '…' : text;
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
