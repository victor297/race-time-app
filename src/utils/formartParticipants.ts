export function formatParticipants(num: number): string {
  if (!isFinite(num) || num < 0) return "0";

  if (num < 100) return `${num}`;
  if (num < 1000) {
    const base = Math.floor(num / 100) * 100;
    return `${base}+`;
  }

  if (num < 1_000_000) {
    const k = Math.floor(num / 1000);
    return `${k}K+`;
  }

  const m = (num / 1_000_000).toFixed(1).replace(/\.0$/, "");
  return `${m}M+`;
}
