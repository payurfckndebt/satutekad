export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const KKM = 75;

export function scoreLabel(score) {
  return score >= KKM ? "LULUS" : "BELUM LULUS";
}
