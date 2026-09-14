import { shuffle } from './utils';

export const TRYOUT_TARGET = 100;
export const TRYOUT_MINUTES = 120;
export const KKM = 75;

/**
 * Builds an exam question set for a modul sub-mode.
 *
 * - categories: category objects for the active modul (must have `slug`)
 * - questionPool: all candidate questions (already filtered to the modul)
 * - filterFn: (question) => boolean — which questions are eligible for this sub-mode
 * - target: desired total question count (defaults to TRYOUT_TARGET)
 *
 * Behaviour:
 * - Splits `target` evenly across every category that has at least one eligible
 *   question. Categories with zero eligible questions are skipped entirely
 *   (they simply aren't covered in this sub-mode).
 * - If a category has fewer eligible questions than its even share, the
 *   leftover quota is redistributed to categories that still have spare
 *   eligible questions, so a materi can end up contributing more than the
 *   even share.
 * - If the whole eligible pool (across all categories) is smaller than
 *   `target`, every eligible question is used (no padding/fabrication).
 */
export function buildModulExam(categories, questionPool, filterFn, target = TRYOUT_TARGET) {
  const perCategory = categories
    .map((cat) => ({
      cat,
      pool: shuffle(questionPool.filter((q) => q.categorySlug === cat.slug && filterFn(q))),
    }))
    .filter((entry) => entry.pool.length > 0);

  if (perCategory.length === 0) return [];

  const totalAvailable = perCategory.reduce((n, e) => n + e.pool.length, 0);
  const effectiveTarget = Math.min(target, totalAvailable);

  const baseShare = Math.floor(effectiveTarget / perCategory.length);
  const taken = perCategory.map((entry) => Math.min(baseShare, entry.pool.length));
  let remaining = effectiveTarget - taken.reduce((a, b) => a + b, 0);

  // redistribute leftover quota to categories with spare capacity, round-robin
  let guard = perCategory.length * effectiveTarget + 10; // safety bound
  while (remaining > 0 && guard-- > 0) {
    let progressed = false;
    for (let i = 0; i < perCategory.length && remaining > 0; i++) {
      if (taken[i] < perCategory[i].pool.length) {
        taken[i] += 1;
        remaining -= 1;
        progressed = true;
      }
    }
    if (!progressed) break;
  }

  const selected = [];
  perCategory.forEach((entry, i) => {
    selected.push(...entry.pool.slice(0, taken[i]));
  });

  return shuffle(selected).slice(0, effectiveTarget);
}

/** Per-category breakdown, useful for showing the user how the 100 questions are split. */
export function modulExamBreakdown(categories, questionPool, filterFn, target = TRYOUT_TARGET) {
  const set = buildModulExam(categories, questionPool, filterFn, target);
  const counts = {};
  set.forEach((q) => {
    counts[q.categorySlug] = (counts[q.categorySlug] || 0) + 1;
  });
  return categories
    .map((cat) => ({ slug: cat.slug, name: cat.name, count: counts[cat.slug] || 0 }))
    .filter((c) => c.count > 0);
}
