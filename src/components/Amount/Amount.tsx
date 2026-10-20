import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { formatAmount, MINUS } from '../../utils/formatAmount';
import './Amount.css';

export interface AmountProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** En unidades mayores (12,5 son doce con cincuenta), no en centavos. Lo que no sea un número finito se escribe «sin dato». */
  value: number | null | undefined;
  /** Código ISO 4217. No hay moneda por defecto: la librería no supone ninguna. */
  currency: string;
  /** Etiqueta de idioma. Sin ella se usa la del entorno; una inválida también. */
  locale?: string;
  /**
   * Trata el importe como un movimiento: escribe el signo también en los abonos y
   * la palabra «abono» o «cargo», y colorea. Sin `flow` es una cifra neutra.
   */
  flow?: boolean;
  creditLabel?: string;
  debitLabel?: string;
  unknownLabel?: string;
}

/**
 * Un importe en mono con cifras tabulares. El color de un abono o un cargo
 * refuerza el signo y la palabra, nunca los sustituye: se lee igual sin verlo.
 */
export const Amount = forwardRef<HTMLSpanElement, AmountProps>(function Amount(
  { value, currency, locale, flow = false, creditLabel = 'abono', debitLabel = 'cargo', unknownLabel = 'sin dato', className, ...rest },
  ref,
) {
  const parts = formatAmount(value, currency, locale);
  if (parts.kind === 'unknown') {
    return (
      <span ref={ref} className={cx('pui-amount', 'pui-amount--unknown', 'pui-type-stat-value', className)} {...rest}>
        {unknownLabel}
      </span>
    );
  }
  const sign = parts.sign === 'negative' ? MINUS : flow && parts.sign === 'positive' ? '+' : '';
  const word = flow ? (parts.sign === 'positive' ? creditLabel : parts.sign === 'negative' ? debitLabel : null) : null;
  const tone = flow ? (parts.sign === 'positive' ? 'credit' : parts.sign === 'negative' ? 'debit' : null) : null;
  return (
    <span ref={ref} className={cx('pui-amount', tone && `pui-amount--${tone}`, 'pui-type-stat-value', className)} {...rest}>
      {sign}
      {parts.text}
      {word ? <span className="pui-amount__word pui-type-stat-label"> {word}</span> : null}
    </span>
  );
});
