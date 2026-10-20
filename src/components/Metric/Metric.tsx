import { forwardRef, useId, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { formatChange } from '../../utils/formatChange';
import { Amount } from '../Amount/Amount';
import './Metric.css';

export interface MetricLabels {
  up: string;
  down: string;
  flat: string;
  noPrevious: string;
  noPercent: string;
  lessThan: string;
}

const DEFAULT_LABELS: MetricLabels = {
  up: 'sube',
  down: 'baja',
  flat: 'sin cambio',
  noPrevious: 'sin dato anterior',
  noPercent: 'sin porcentaje: el valor anterior es 0',
  lessThan: 'menos de',
};

export interface MetricProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Qué cifra es: «saldo disponible». En minúsculas; las versalitas las pone CSS. Nombra el grupo. */
  label: string;
  /** En unidades mayores, como en `Amount`. */
  value: number | null | undefined;
  /** El valor con el que se compara. Sin él, o sin un número finito, se escribe «sin dato anterior». */
  previous?: number | null;
  currency: string;
  locale?: string;
  /** El periodo de comparación, escrito al final: «frente a septiembre». */
  comparison?: string;
  labels?: Partial<MetricLabels>;
}

/**
 * Una cifra clave con cuánto cambió. La variación va en tinta y con su palabra:
 * que algo suba es bueno en un saldo y malo en un gasto, y eso lo sabe quien
 * usa el componente, no el componente.
 */
export const Metric = forwardRef<HTMLDivElement, MetricProps>(function Metric(
  { label, value, previous, currency, locale, comparison, labels, className, ...rest },
  ref,
) {
  const labelId = useId();
  const text = { ...DEFAULT_LABELS, ...labels };
  const parts = formatChange(value, previous, currency, locale);
  const tail = comparison ? ` ${comparison}` : '';

  let changeText: string | null = null;
  if (parts.kind === 'no-previous') changeText = text.noPrevious;
  else if (parts.kind === 'flat') changeText = `${text.flat}${tail}`;
  else if (parts.kind === 'change') {
    const word = parts.direction === 'up' ? text.up : text.down;
    const percent =
      parts.percent === null ? `; ${text.noPercent}` : ` (${parts.lessThan ? `${text.lessThan} ` : ''}${parts.percent})`;
    changeText = `${word} ${parts.difference}${percent}${tail}`;
  }

  return (
    <div ref={ref} role="group" aria-labelledby={labelId} className={cx('pui-metric', className)} {...rest}>
      <p id={labelId} className="pui-metric__label pui-type-stat-label">
        {label}
      </p>
      <p className="pui-metric__value pui-type-metric-value">
        <Amount value={value} currency={currency} locale={locale} />
      </p>
      {changeText ? <p className="pui-metric__change pui-type-mono-note">{changeText}</p> : null}
    </div>
  );
});
