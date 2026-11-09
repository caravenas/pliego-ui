import { forwardRef, useId, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { formatAmount, formatSigned } from '../../utils/formatAmount';
import { Amount } from '../Amount/Amount';
import './BarChart.css';

export interface BarSeries {
  /** Lo que nombra la serie en la leyenda y en la tabla. Un nombre repetido se desambigua con « (2)». */
  name: string;
  /** `values[i]` pertenece a `categories[i]`. Lo que falte, o no sea un número finito, es «sin dato». */
  values: (number | null | undefined)[];
}

export interface BarChartLabels {
  empty: string;
  values: string;
  category: string;
  legend: string;
  /** «se muestran {shown} de {total} series; las demás están en la tabla» */
  moreSeries: string;
  min: string;
  max: string;
  unnamed: string;
}

const DEFAULT_LABELS: BarChartLabels = {
  empty: 'sin datos para graficar',
  values: 'valores',
  category: 'categoría',
  legend: 'series',
  moreSeries: 'se muestran {shown} de {total} series; las demás están en la tabla',
  min: 'mínimo',
  max: 'máximo',
  unnamed: 'sin nombre',
};

export interface BarChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** Qué mide el gráfico: «ingresos y gastos por mes». Es su nombre accesible. */
  title: string;
  /** Las etiquetas del eje, una por grupo de barras. */
  categories: readonly string[];
  series: readonly BarSeries[];
  currency: string;
  locale?: string;
  labels?: Partial<BarChartLabels>;
}

// Unidades del viewBox, no píxeles: el SVG se escala al ancho que tenga.
const WIDTH = 320;
const HEIGHT = 120;
const PAD = 8;
// Lado del mosaico de cada patrón, en unidades del viewBox.
const TILE = 6;
// Cuatro rellenos de tinta distinguibles sin color: macizo, rayas, puntos y trama cruzada.
const PATTERNS = ['solid', 'stripes', 'dots', 'cross'] as const;
const MAX_SERIES = PATTERNS.length;
// La agrupación ocupa esta parte de su banda; el resto es aire entre grupos.
const GROUP_SHARE = 0.8;

const isKnown = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/** Nombres únicos: conserva todas las series y desambigua las repetidas en vez de descartar datos. */
function uniqueNames(names: readonly string[], unnamed: string): string[] {
  const taken = new Set<string>();
  return names.map((raw) => {
    const base = raw.trim() === '' ? unnamed : raw;
    let name = base;
    for (let n = 2; taken.has(name); n += 1) name = `${base} (${n})`;
    taken.add(name);
    return name;
  });
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole));

function Pattern({ id, kind }: { id: string; kind: (typeof PATTERNS)[number] }) {
  const common = { id, width: TILE, height: TILE, patternUnits: 'userSpaceOnUse' as const };
  switch (kind) {
    case 'solid':
      return (
        <pattern {...common}>
          <rect className="pui-bars__ink" width={TILE} height={TILE} />
        </pattern>
      );
    case 'stripes':
      return (
        <pattern {...common} patternTransform="rotate(45)">
          <rect className="pui-bars__paper" width={TILE} height={TILE} />
          <path className="pui-bars__mark" d={`M0 0V${TILE}`} />
        </pattern>
      );
    case 'dots':
      return (
        <pattern {...common}>
          <rect className="pui-bars__paper" width={TILE} height={TILE} />
          <circle className="pui-bars__ink" cx={TILE / 2} cy={TILE / 2} r={1.2} />
        </pattern>
      );
    case 'cross':
      return (
        <pattern {...common}>
          <rect className="pui-bars__paper" width={TILE} height={TILE} />
          <path className="pui-bars__mark" d={`M0 ${TILE / 2}H${TILE}M${TILE / 2} 0V${TILE}`} />
        </pattern>
      );
  }
}

/**
 * Barras agrupadas de una o varias series. Cada serie se distingue por su
 * nombre escrito, su posición fija dentro del grupo y un relleno de tinta propio,
 * nunca solo por color. La tabla de debajo trae los mismos valores, todos.
 */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(
  { title, categories, series, currency, locale, labels, className, ...rest },
  ref,
) {
  const text = { ...DEFAULT_LABELS, ...labels };
  // useId trae dos puntos, que no valen dentro de url(#…).
  const uid = `pui-bars-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`;
  const names = uniqueNames(
    series.map((s) => s.name),
    text.unnamed,
  );
  const shown = series.slice(0, MAX_SERIES);
  const known = shown.flatMap((s) => categories.map((_, c) => s.values[c]).filter(isKnown));
  const hasData = known.length > 0;
  // Las series que no se dibujan siguen en la tabla: si solo ellas traen valores, «sin datos» sería a medias cierto.
  const hiddenHaveData = series.slice(MAX_SERIES).some((s) => categories.some((_, c) => isKnown(s.values[c])));

  // La escala siempre incluye el 0: una barra que no parte de cero miente.
  const min = Math.min(0, ...known);
  const max = Math.max(0, ...known);
  // Mitades: con extremos como ±Number.MAX_VALUE la resta directa se desborda a Infinity.
  const halfSpan = max / 2 - min / 2 || 1;
  const y = (value: number) => PAD + (((max / 2 - value / 2) / halfSpan) * (HEIGHT - 2 * PAD));
  const zeroY = y(0);

  const band = WIDTH / Math.max(categories.length, 1);
  const barWidth = (band * GROUP_SHARE) / Math.max(shown.length, 1);
  const fmt = (value: number) => formatSigned(value, currency, locale) ?? '';
  const summary = hasData ? `${text.min} ${fmt(Math.min(...known))} · ${text.max} ${fmt(Math.max(...known))}` : text.empty;
  const patternId = (index: number) => `${uid}-${PATTERNS[index]}`;

  return (
    <figure ref={ref} className={cx('pui-bars', className)} {...rest}>
      <figcaption className="pui-bars__title pui-type-stat-label">{title}</figcaption>
      {hasData ? (
        <>
          <p className="pui-bars__summary pui-type-mono-note">{summary}</p>
          {shown.length > 1 ? (
            <ul role="list" aria-label={text.legend} className="pui-bars__legend">
              {shown.map((_, index) => (
                <li key={index} className="pui-bars__legend-item pui-type-mono-note">
                  <svg className="pui-bars__swatch" viewBox="0 0 20 16" aria-hidden="true" focusable="false">
                    <rect className="pui-bars__sample" x={1} y={1} width={18} height={14} fill={`url(#${patternId(index)})`} />
                  </svg>
                  {names[index]}
                </li>
              ))}
            </ul>
          ) : null}
          {series.length > shown.length ? (
            <p className="pui-bars__more pui-type-mono-note">
              {fill(text.moreSeries, { shown: shown.length, total: series.length })}
            </p>
          ) : null}
          <svg
            className="pui-bars__svg"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`${title}. ${names.slice(0, shown.length).join(', ')}. ${summary}`}
            focusable="false"
          >
            <defs>
              {shown.map((_, index) => (
                <Pattern key={index} id={patternId(index)} kind={PATTERNS[index]} />
              ))}
            </defs>
            <line className="pui-bars__baseline" x1={0} x2={WIDTH} y1={zeroY} y2={zeroY} />
            {categories.map((_, c) =>
              shown.map((s, index) => {
                const value = s.values[c];
                if (!isKnown(value)) return null;
                const x = c * band + (band * (1 - GROUP_SHARE)) / 2 + index * barWidth;
                const parts = formatAmount(value, currency, locale);
                // Un rect de alto cero no se pinta (lo dice SVG): el cero deja una marca en la base.
                if (parts.kind === 'known' && parts.sign === 'zero') {
                  return <line key={`${c}:${index}`} className="pui-bars__zero" x1={x} x2={x + barWidth} y1={zeroY} y2={zeroY} />;
                }
                return (
                  <rect
                    key={`${c}:${index}`}
                    className="pui-bars__bar"
                    fill={`url(#${patternId(index)})`}
                    x={x}
                    y={Math.min(y(value), zeroY)}
                    width={barWidth}
                    height={Math.abs(y(value) - zeroY)}
                  />
                );
              }),
            )}
          </svg>
          {/* Fuera del SVG para que el texto no se escale con el viewBox; la tabla ya trae estas etiquetas. */}
          <div className="pui-bars__axis pui-type-mono-note" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
            {categories.map((category, c) => (
              <span key={c} className="pui-bars__tick">{category}</span>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="pui-bars__empty">{text.empty}</p>
          {hiddenHaveData ? (
            <p className="pui-bars__more pui-type-mono-note">
              {fill(text.moreSeries, { shown: shown.length, total: series.length })}
            </p>
          ) : null}
        </>
      )}
      <details className="pui-bars__values" open>
        <summary className="pui-bars__toggle pui-type-stat-label">{text.values}</summary>
        <div className="pui-bars__scroll" role="region" aria-label={`${title}. ${text.values}`} tabIndex={0}>
          <table className="pui-bars__table">
            <thead>
              <tr>
                <th scope="col" className="pui-bars__head pui-type-stat-label">{text.category}</th>
                {names.map((name, index) => (
                  <th key={index} scope="col" className="pui-bars__head pui-bars__head--value pui-type-stat-label">{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, c) => (
                <tr key={c}>
                  <th scope="row" className="pui-bars__cell pui-bars__label pui-type-mono-note">{category}</th>
                  {series.map((s, index) => (
                    <td key={index} className="pui-bars__cell pui-bars__value">
                      <Amount value={s.values[c]} currency={currency} locale={locale} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
});
