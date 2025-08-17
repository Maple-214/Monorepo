export const format_currency = (value: number, currency = 'USD', locale = 'en-US') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
