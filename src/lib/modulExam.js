import { shuffle } from './utils';

export const TRYOUT_TARGET = 100;
export const TRYOUT_MINUTES = 120;
export const KKM = 75;

/**
 * Several Modul 1 topics cover the same subject as one (or two) of the
 * original 15 categories — e.g. "m1-market-conduct" and "market-conduct"
 * are the same real-world topic, just introduced on different days. Real
 * Kuis Kelas / Kisi Kisi content lives on the *original* category slugs,
 * so Modul 1 needs to pull it in via this map rather than only looking at
 * its own (100% AI) question set. Topics with no real-world counterpart
 * (e.g. "Critical Point Produk & Aktivitas PM") map to an empty array —
 * they only ever have Modul 1's own AI-generated questions.
 */
export const MODUL1_LINKED_CATEGORIES = {
  'm1-critical-point-pm': [],
  'm1-akad-syariah': ['muamalat-akad-syariah'],
  'm1-literasi-inklusi': ['literasi-inklusi-keuangan', 'inklusi-keuangan'],
  'm1-perlindungan-konsumen': ['perlindungan-konsumen'],
  'm1-market-conduct': ['market-conduct'],
  'm1-siklus-tools-pm': ['siklus-pengawasan-pasar-modal'],
  'm1-rbs-cycle': ['siklus-rbs-bank-umum-konvensional', 'siklus-pengawasan-bank-umum'],
  'm1-ppdp': ['pengawasan-asuransi-ppdp'],
  'm1-pvml': ['siklus-pengawasan-perusahaan-pembiayaan'],
  'm1-tools-perbankan': ['aplikasi-pengawasan-perbankan'],
};

/**
 * Builds the eligible question pool for one Modul 1 topic under a given
 * sub-mode.
 * - 'ai' (Soal Campuran AI): union of the topic's own AI-generated questions
 *   plus EVERY question (any sourceType) from its linked original categories.
 * - 'kuiskisi' (Soal Kuis dan Kisi2): only questions with sourceType 'kuis'
 *   or 'kisikisi', pulled from the linked original categories (Modul 1's own
 *   set is 100% AI, so it never contributes here).
 */
export function modul1TopicPool(modul1Slug, mode, modul1Questions, baseQuestions) {
  const linked = MODUL1_LINKED_CATEGORIES[modul1Slug] || [];
  const fromBase = baseQuestions.filter((q) => linked.includes(q.categorySlug));
  if (mode === 'kuiskisi') {
    return fromBase.filter((q) => q.sourceType === 'kuis' || q.sourceType === 'kisikisi');
  }
  const ownAi = modul1Questions.filter((q) => q.categorySlug === modul1Slug);
  return [...ownAi, ...fromBase];
}

/**
 * Builds an exam question set for a modul sub-mode.
 *
 * - categories: category objects for the active modul (must have `slug`)
 * - poolForCategory: (categorySlug) => question[] — eligible pool for that category
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
export function buildModulExam(categories, poolForCategory, target = TRYOUT_TARGET) {
  const perCategory = categories
    .map((cat) => ({ cat, pool: shuffle(poolForCategory(cat.slug)) }))
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
    const chosen = entry.pool.slice(0, taken[i]).map((q) => ({ ...q, _examGroupSlug: entry.cat.slug }));
    selected.push(...chosen);
  });

  return shuffle(selected).slice(0, effectiveTarget);
}

/** Per-category breakdown, useful for showing the user how the 100 questions are split. */
export function modulExamBreakdown(categories, poolForCategory, target = TRYOUT_TARGET) {
  const set = buildModulExam(categories, poolForCategory, target);
  const counts = {};
  set.forEach((q) => {
    const slug = q._examGroupSlug || q.categorySlug;
    counts[slug] = (counts[slug] || 0) + 1;
  });
  return categories
    .map((cat) => ({ slug: cat.slug, name: cat.name, count: counts[cat.slug] || 0 }))
    .filter((c) => c.count > 0);
}
