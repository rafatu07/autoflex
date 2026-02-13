/**
 * Formata valor monetário no padrão brasileiro: R$ 1.234,56
 */
export function formatCurrencyBr(value: number): string {
  const fixed = Number(value).toFixed(2)
  const [intPart, decPart] = fixed.split('.')
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `R$ ${withDots},${decPart}`
}
