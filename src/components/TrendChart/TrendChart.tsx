import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { formatSigned } from '../../utils/formatAmount';
import { Amount } from '../Amount/Amount';
import './TrendChart.css';

export interface TrendPoint {
  /** Lo que nombra el punto en la tabla: «oct», «2026-10-19». */
  label: string;
  /** Un valor que falta o no es finito deja un hueco: no se dibuja ni se toma por 0. */
  value: number | null | undefined;
}

export interface TrendChartLabels {
  empty: string;
  values: string;
  point: string;
  value: string;
  min: string;
  max: string;
}

const DEFAULT_LABELS: TrendChartLabels = {
  empty: 'sin datos para graficar',
  values: 'valores',
  point: 'punto',
  value: 'valor',
  min: 'mínimo',
  max: 'máximo',
};

export interface TrendChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** Qué mide la serie: «saldo de la cuenta corriente». Es el nombre accesible de la gráfica. */
  title: string;
  points: readonly TrendPoint[];
  currency: string;
  locale?: string;
  labels?: Partial<TrendChartLabels>;
}

// Unidades del viewBox, no píxeles: el SVG se escala al ancho que tenga.
const WIDTH = 320;
const HEIGHT = 120;
const PAD = 8;

const isKnown = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/**
 * Una serie en el tiempo como línea de tinta. La gráfica es un complemento: los
 * mismos valores están escritos en la tabla de debajo, que es lo que lee quien no
 * ve el dibujo.
 */
export const TrendChart = forwardRef<HTMLElement, TrendChartProps>(function TrendChart(
  { title, points, currency, locale, labels, className, ...rest },
  ref,
) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const known = points.filter((point) => isKnown(point.value));
  const values = known.map((point) => point.value as number);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const x = (index: number) => (points.length === 1 ? WIDTH / 2 : PAD + (index * (WIDTH - 2 * PAD)) / (points.length - 1));
  // Una serie plana se centra: dividir por cero la mandaría a NaN.
  const y = (value: number) => (max === min ? HEIGHT / 2 : HEIGHT - PAD - ((value - min) / (max - min)) * (HEIGHT - 2 * PAD));

  // Tramos de puntos consecutivos con valor; un hueco corta la línea.
  const runs: { x: number; y: number }[][] = [];
  let lastKnownIndex = -1;
  points.forEach((point, index) => {
    if (!isKnown(point.value)) {
      runs.push([]);
      return;
    }
    if (runs.length === 0) runs.push([]);
    runs[runs.length - 1].push({ x: x(index), y: y(point.value) });
    lastKnownIndex = index;
  });
  const drawn = runs.filter((run) => run.length > 0);

  const fmt = (value: number) => formatSigned(value, currency, locale) ?? '';
  const summary =
    known.length === 0
      ? text.empty
      : known.length === 1
        ? `${known[0].label}: ${fmt(values[0])}`
        : `${text.min} ${fmt(min)} · ${text.max} ${fmt(max)}`;

  return (
    <figure ref={ref} className={cx('pui-trend', className)} {...rest}>
      <figcaption className="pui-trend__title pui-type-stat-label">{title}</figcaption>
      {known.length === 0 ? (
        <p className="pui-trend__empty">{text.empty}</p>
      ) : (
        <>
          <p className="pui-trend__summary pui-type-mono-note">{summary}</p>
          <svg
            className="pui-trend__svg"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`${title}. ${summary}`}
            focusable="false"
          >
            <line className="pui-trend__baseline" x1={PAD} x2={WIDTH - PAD} y1={HEIGHT - PAD} y2={HEIGHT - PAD} />
            {drawn.map((run, index) =>
              run.length > 1 ? (
                <polyline key={index} className="pui-trend__line" points={run.map((p) => `${p.x},${p.y}`).join(' ')} />
              ) : (
                <circle key={index} className="pui-trend__dot" cx={run[0].x} cy={run[0].y} r={3} />
              ),
            )}
            {/* El último valor conocido se rellena de acento: es un dibujo, no texto. */}
            <circle
              className="pui-trend__last"
              cx={x(lastKnownIndex)}
              cy={y(points[lastKnownIndex].value as number)}
              r={4}
            />
          </svg>
        </>
      )}
      <details className="pui-trend__values" open>
        <summary className="pui-trend__toggle pui-type-stat-label">{text.values}</summary>
        <table className="pui-trend__table">
          <thead>
            <tr>
              <th scope="col" className="pui-trend__head pui-type-stat-label">{text.point}</th>
              <th scope="col" className="pui-trend__head pui-trend__head--value pui-type-stat-label">{text.value}</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) => (
              <tr key={index}>
                <th scope="row" className="pui-trend__cell pui-trend__label pui-type-mono-note">{point.label}</th>
                <td className="pui-trend__cell pui-trend__value">
                  <Amount value={point.value} currency={currency} locale={locale} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
});
