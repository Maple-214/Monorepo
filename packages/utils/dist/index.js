export const format_currency = (value, currency = 'USD', locale = 'en-US') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
