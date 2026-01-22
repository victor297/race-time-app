export function formatMoney(amount: number): string {
  if (isNaN(amount)) return "₦0";
  return "₦" + amount.toLocaleString("en-NG", { minimumFractionDigits: 0 });
}
