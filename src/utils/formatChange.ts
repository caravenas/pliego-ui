import { formatAmount, usableLocale } from './formatAmount';

export type ChangeParts =
  | { kind: 'no-current' }
  | { kind: 'no-previous' }
  /** Los dos se conocen, pero su diferencia no cabe en un número. */
  | { kind: 'incomparable' }
  | { kind: 'flat' }
  | {
      kind: 'change';
      direction: 'up' | 'down';
      /** La diferencia sin signo: la dirección ya la dice la palabra. */
      difference: string;
      /** Sin signo, o `null` si el anterior es 0 o el cociente no sale finito. */
      percent: string | null;
      /** El porcentaje redondea a 0,0 con una diferencia real: se escribe «menos de» `percent`. */
      lessThan: boolean;
    };

const percents = new Map<string, Intl.NumberFormat>();

function percentFormat(locale: string | undefined): Intl.NumberFormat {
  const key = locale ?? '';
  let format = percents.get(key);
  if (!format) {
    format = new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'never' });
    percents.set(key, format);
  }
  return format;
}

const isKnown = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/**
 * Cuánto cambió un importe respecto de otro. La dirección sale de la diferencia
 * ya redondeada a los decimales de la moneda, como el signo de `Amount`, y no
 * del porcentaje: así, de −200 a −100 «sube», y `0.1 + 0.2` frente a `0.3` no
 * cambia. El porcentaje es sobre el valor absoluto del anterior, y no se escribe
 * cuando ese anterior es 0, porque dividir por cero no dice nada.
 */
export function formatChange(current: unknown, previous: unknown, currency: string, locale?: string): ChangeParts {
  if (!isKnown(current)) return { kind: 'no-current' };
  if (!isKnown(previous)) return { kind: 'no-previous' };
  const difference = current - previous;
  const parts = formatAmount(difference, currency, locale);
  if (parts.kind === 'unknown') return { kind: 'incomparable' };
  if (parts.sign === 'zero') return { kind: 'flat' };

  const base = formatAmount(previous, currency, locale);
  const ratio = Math.abs(difference) / Math.abs(previous);
  const hasPercent = base.kind === 'known' && base.sign !== 'zero' && Number.isFinite(ratio);
  const format = percentFormat(usableLocale(locale));
  // Un cambio real no se escribe «0,0 %»: se escribe que es menor que el mínimo que se muestra.
  const lessThan = hasPercent && ratio < 0.0005;
  return {
    kind: 'change',
    direction: parts.sign === 'positive' ? 'up' : 'down',
    difference: parts.text,
    percent: hasPercent ? format.format(lessThan ? 0.001 : ratio) : null,
    lessThan,
  };
}
