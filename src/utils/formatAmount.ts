export type AmountParts =
  | { kind: 'unknown' }
  | { kind: 'known'; sign: 'negative' | 'positive' | 'zero'; text: string };

/** Signo escrito de un menos: U+2212, no el guion, para que no se confunda con un separador. */
export const MINUS = '−';

const formatters = new Map<string, Intl.NumberFormat | null>();

function usableLocale(locale: string | undefined): string | undefined {
  if (locale === undefined) return undefined;
  try {
    new Intl.NumberFormat(locale);
    return locale;
  } catch {
    // Una etiqueta de idioma mal escrita no debe tumbar el panel: se usa la del entorno.
    return undefined;
  }
}

function formatterFor(currency: string, locale: string | undefined): { format: Intl.NumberFormat; withCurrency: boolean } {
  const key = `${locale ?? ''}|${currency}`;
  let cached = formatters.get(key);
  if (cached === undefined) {
    try {
      cached = new Intl.NumberFormat(locale, { style: 'currency', currency, signDisplay: 'never' });
    } catch {
      cached = null;
    }
    formatters.set(key, cached);
  }
  if (cached) return { format: cached, withCurrency: true };
  // Una moneda desconocida no se inventa: se escribe la cifra y el código tal como llegó.
  return { format: new Intl.NumberFormat(locale, { signDisplay: 'never', maximumFractionDigits: 2 }), withCurrency: false };
}

/**
 * Parte un importe en su signo y su texto. El signo se decide con el valor ya
 * redondeado a los decimales de la moneda, para que -0,001 no se escriba «−0,00».
 * Todo lo que no sea un número finito es desconocido: ni se convierte en 0 ni se
 * adivina a partir de una cadena.
 */
export function formatAmount(value: unknown, currency: string, locale?: string): AmountParts {
  if (typeof value !== 'number' || !Number.isFinite(value)) return { kind: 'unknown' };
  const { format, withCurrency } = formatterFor(currency, usableLocale(locale));
  const magnitude = Math.abs(value);
  const digits = format.resolvedOptions().maximumFractionDigits ?? 2;
  const zero = magnitude < 0.5 * 10 ** -digits;
  const number = format.format(magnitude);
  return {
    kind: 'known',
    sign: zero ? 'zero' : value < 0 ? 'negative' : 'positive',
    text: withCurrency ? number : `${number} ${currency}`.trim(),
  };
}

/** El importe como una sola cadena, con su signo si es negativo; `null` si se desconoce. */
export function formatSigned(value: unknown, currency: string, locale?: string): string | null {
  const parts = formatAmount(value, currency, locale);
  if (parts.kind === 'unknown') return null;
  return parts.sign === 'negative' ? `${MINUS}${parts.text}` : parts.text;
}
