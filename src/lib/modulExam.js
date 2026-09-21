import { shuffle } from './utils';

/** Drops any question whose id has already been seen, keeping the first occurrence. */
function dedupeById(list) {
  const seen = new Set();
  return list.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
}

export const TRYOUT_TARGET = 100;
export const TRYOUT_MINUTES = 120;
export const KKM = 75;

// Per-modul overrides of the try-out shape. Modules not listed here fall back
// to TRYOUT_TARGET / TRYOUT_MINUTES above.
export const MODUL_EXAM_CONFIG = {
  1: { target: 100, minutes: 120 },
  2: { target: 70, minutes: 90 },
  3: { target: 50, minutes: 100 },
};

// Modul 3 has a fixed topic weighting instead of an even split across
// categories — 70% Manajemen Risiko, 30% Cyber Risk — reflecting how the
// source bank soal itself is weighted (50/50 raw, but the exam draws more
// heavily from Manajemen Risiko per the requested ratio).
export const MODUL3_TOPIC_WEIGHTS = {
  'm3-manajemen-risiko': 0.7,
  'm3-cyber-risk': 0.3,
};

export function examConfigForModul(modulId) {
  return MODUL_EXAM_CONFIG[modulId] || { target: TRYOUT_TARGET, minutes: TRYOUT_MINUTES };
}

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
 * Builds the eligible question pool for one Modul 2 topic under a given
 * sub-mode. Unlike Modul 1, Modul 2's question set (modul2Questions.json)
 * is self-contained per category — no linking to legacy pre-modul
 * categories is needed.
 * - 'ai' (Soal Campuran AI): every question for the topic, any sourceType.
 * - 'kuiskisi' (Soal Kuis dan Kisi2): only sourceType 'kuis' or 'kisikisi'.
 */
export function modul2TopicPool(modul2Slug, mode, modul2Questions) {
  const own = modul2Questions.filter((q) => q.categorySlug === modul2Slug);
  if (mode === 'kuiskisi') {
    return own.filter((q) => q.sourceType === 'kuis' || q.sourceType === 'kisikisi');
  }
  return own;
}

/**
 * Builds the eligible question pool for one Modul 3 topic. Modul 3's bank
 * soal has a single uniform source tier ("prediksi" — every question is
 * badged "Prediksi dari materi"), so unlike Modul 1/2 there is no
 * kuis/kisikisi vs ai distinction to filter on; `mode` is accepted only for
 * interface parity with the other pool functions and both submodes return
 * the same full pool.
 */
export function modul3TopicPool(modul3Slug, _mode, modul3Questions) {
  return modul3Questions.filter((q) => q.categorySlug === modul3Slug);
}

/**
 * Builds a Modul 3 exam set using the fixed MODUL3_TOPIC_WEIGHTS ratio
 * (70% Manajemen Risiko / 30% Cyber Risk) instead of the even per-category
 * split buildModulExam uses. Categories not listed in MODUL3_TOPIC_WEIGHTS
 * fall back to an even share of the remaining weight.
 * - Rounds each category's share of `target`, then corrects rounding drift
 *   on the highest-weight categories so the total is exactly `target`.
 * - If a category's pool is smaller than its weighted share, the shortfall
 *   is redistributed to categories with spare capacity (heaviest first) —
 *   never padded or fabricated.
 */
export function buildModul3Exam(categories, poolForCategory, target = 50) {
  const withPools = categories
    .map((cat) => ({
      cat,
      weight: MODUL3_TOPIC_WEIGHTS[cat.slug] ?? 1 / categories.length,
      pool: shuffle(poolForCategory(cat.slug)),
    }))
    .filter((e) => e.pool.length > 0);

  if (withPools.length === 0) return [];

  const totalWeight = withPools.reduce((n, e) => n + e.weight, 0);
  const order = withPools.map((_, i) => i).sort((a, b) => withPools[b].weight - withPools[a].weight);

  let want = withPools.map((e) => Math.round((e.weight / totalWeight) * target));
  let drift = target - want.reduce((a, b) => a + b, 0);
  let oi = 0;
  while (drift !== 0 && order.length > 0) {
    const idx = order[oi % order.length];
    want[idx] = Math.max(0, want[idx] + (drift > 0 ? 1 : -1));
    drift += drift > 0 ? -1 : 1;
    oi++;
  }

  let shortfall = 0;
  const taken = want.map((w, i) => {
    const avail = withPools[i].pool.length;
    if (w > avail) {
      shortfall += w - avail;
      return avail;
    }
    return w;
  });

  let guard = target + 10;
  while (shortfall > 0 && guard-- > 0) {
    let progressed = false;
    for (const idx of order) {
      if (shortfall <= 0) break;
      if (taken[idx] < withPools[idx].pool.length) {
        taken[idx] += 1;
        shortfall -= 1;
        progressed = true;
      }
    }
    if (!progressed) break;
  }

  const selected = [];
  withPools.forEach((e, i) => {
    selected.push(...e.pool.slice(0, taken[i]).map((q) => ({ ...q, _examGroupSlug: e.cat.slug })));
  });
  const unique = dedupeById(selected);
  return shuffle(unique).slice(0, Math.min(target, unique.length));
}

/** Per-category breakdown for Modul 3's weighted exam builder. */
export function modul3ExamBreakdown(categories, poolForCategory, target = 50) {
  const set = buildModul3Exam(categories, poolForCategory, target);
  const counts = {};
  set.forEach((q) => {
    const slug = q._examGroupSlug || q.categorySlug;
    counts[slug] = (counts[slug] || 0) + 1;
  });
  return categories
    .map((cat) => ({ slug: cat.slug, name: cat.name, count: counts[cat.slug] || 0 }))
    .filter((c) => c.count > 0);
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

  const unique = dedupeById(selected);
  return shuffle(unique).slice(0, Math.min(effectiveTarget, unique.length));
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
