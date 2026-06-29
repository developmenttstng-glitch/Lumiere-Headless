const SYMBOLS = {
  PHP:'₱', USD:'$', GBP:'£', EUR:'€', AUD:'A$',
  CAD:'C$', SGD:'S$', JPY:'¥', KRW:'₩', INR:'₹',
}
export function currencySymbol(code) { return SYMBOLS[code] || code || '$' }
export function formatPrice(amount, currencyCode) {
  const symbol = currencySymbol(currencyCode)
  const num    = parseFloat(amount || 0)
  return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 })}`
}
