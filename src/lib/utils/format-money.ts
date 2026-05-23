export function formatMoney(amount: number): string {
  if (amount === undefined || amount === null) return '٠ ج.م';
  
  // Custom Arabic formatting for consistent Egypt Pound rendering
  const formatted = new Intl.NumberFormat('ar-EG', {
    useGrouping: true,
  }).format(amount);
  
  return `${formatted} ج.م`;
}
