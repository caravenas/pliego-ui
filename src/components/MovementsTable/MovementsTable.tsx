import { forwardRef, useEffect, useId, useMemo, useRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { filterMovements } from '../../utils/filterMovements';
import { sortMovements, type Sort, type SortColumn } from '../../utils/sortMovements';
import { Amount } from '../Amount/Amount';
import { Field } from '../Field/Field';
import { Input } from '../Input/Input';
import './MovementsTable.css';
import './MovementsTable.controls.css';

export interface Movement {
  /** Clave estable de la fila. */
  id: string;
  /** Fecha ISO (`2026-10-19`). Se escribe tal cual salvo que se pase `formatDate`. */
  date: string;
  description: string;
  /** Con signo: positivo abona, negativo carga. */
  amount: number | null | undefined;
}

export interface MovementsTableLabels {
  date: string;
  description: string;
  amount: string;
  empty: string;
  unknownDate: string;
  filter: string;
  /** «ordenado por {column}, {direction}» */
  sortedBy: string;
  ascending: string;
  descending: string;
  unsorted: string;
  /** «ningún movimiento coincide con «{query}»» */
  noMatches: string;
  /** «{shown} de {total} movimientos» */
  count: string;
}

export type MovementsSort = Sort;

const DEFAULT_LABELS: MovementsTableLabels = {
  date: 'fecha',
  description: 'concepto',
  amount: 'importe',
  empty: 'sin movimientos',
  unknownDate: 'sin fecha',
  filter: 'filtrar',
  sortedBy: 'ordenado por {column}, {direction}',
  ascending: 'de menor a mayor',
  descending: 'de mayor a menor',
  unsorted: 'sin orden',
  noMatches: 'ningún movimiento coincide con «{query}»',
  count: '{shown} de {total} movimientos',
};

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole));

// Lo que tarda en anunciarse el conteo tras la última tecla: una cifra por pulsación no se puede oír.
const ANNOUNCE_DELAY = 500;

export interface MovementsTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Nombra la tabla para quien no la ve: «movimientos de octubre». */
  caption: string;
  movements: readonly Movement[];
  currency: string;
  locale?: string;
  formatDate?: (date: string) => string;
  labels?: Partial<MovementsTableLabels>;
  /** Las cabeceras se vuelven botones que ordenan. Apagado por omisión: la tabla es la de siempre. */
  sortable?: boolean;
  defaultSort?: MovementsSort;
  /** `null` es el orden original. */
  onSortChange?: (sort: MovementsSort | null) => void;
  /** Un campo para filtrar por concepto o fecha. Apagado por omisión. */
  filterable?: boolean;
}

// Un formateador del consumidor que falla no debe llevarse la tabla: se escribe la fecha tal cual.
function showDate(date: string, formatDate?: (date: string) => string): string {
  if (!formatDate) return date;
  try {
    return formatDate(date);
  } catch {
    return date;
  }
}

const COLUMNS: { column: SortColumn; label: keyof MovementsTableLabels; amount?: boolean }[] = [
  { column: 'date', label: 'date' },
  { column: 'description', label: 'description' },
  { column: 'amount', label: 'amount', amount: true },
];
const ARROW = { none: '↕', ascending: '↑', descending: '↓' } as const;

/**
 * Los movimientos de una cuenta. El contenedor se puede enfocar porque, en una
 * pantalla estrecha, la tabla se desplaza de lado y el teclado tiene que poder
 * hacerlo. Orden y filtro son opt-in: sin ellos es solo lectura, como en L-14.
 */
export const MovementsTable = forwardRef<HTMLDivElement, MovementsTableProps>(function MovementsTable(
  {
    caption,
    movements,
    currency,
    locale,
    formatDate,
    labels,
    sortable = false,
    defaultSort,
    onSortChange,
    filterable = false,
    className,
    ...rest
  },
  ref,
) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const filterId = useId();
  const [sort, setSort] = useState<Sort | null>(defaultSort ?? null);
  const [query, setQuery] = useState('');
  const [announcement, setAnnouncement] = useState('');

  // La posición original es la clave de la fila: ordenar la mueve, pero no la confunde con otra.
  const visible = useMemo(() => {
    const indexed = movements.map((movement, position) => ({ ...movement, position }));
    return sortMovements(filterMovements(indexed, filterable ? query : '', formatDate), sortable ? sort : null, locale);
  }, [movements, query, sort, filterable, sortable, formatDate, locale]);

  // El conteo se ve al instante junto al campo, pero se anuncia cuando se deja de escribir.
  const count = fill(text.count, { shown: visible.length, total: movements.length });
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => setAnnouncement(count), ANNOUNCE_DELAY);
    return () => clearTimeout(timer);
    // Solo una escritura nueva reinicia la espera; cambiar `movements` por fuera no anuncia nada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const cycle = (column: SortColumn) => {
    const next: Sort | null =
      sort?.column !== column
        ? { column, direction: 'ascending' }
        : sort.direction === 'ascending'
          ? { column, direction: 'descending' }
          : null;
    setSort(next);
    onSortChange?.(next);
    const name = text[COLUMNS.find((c) => c.column === column)!.label];
    setAnnouncement(next ? fill(text.sortedBy, { column: name, direction: text[next.direction] }) : text.unsorted);
  };

  const controls = sortable || filterable;
  const query_ = query.trim();
  const region = (
    <div ref={ref} role="region" aria-label={caption} tabIndex={0} className={cx('pui-movements', className)} {...rest}>
      <table className="pui-movements__table">
        <caption className="pui-movements__caption pui-type-stat-label">{caption}</caption>
        <thead>
          <tr>
            {COLUMNS.map(({ column, label, amount }) => {
              const state = sortable && sort?.column === column ? sort.direction : 'none';
              return (
                <th
                  key={column}
                  scope="col"
                  aria-sort={sortable ? state : undefined}
                  className={cx('pui-movements__head', amount && 'pui-movements__head--amount', 'pui-type-stat-label')}
                >
                  {sortable ? (
                    <button type="button" className="pui-movements__sort pui-type-stat-label" onClick={() => cycle(column)}>
                      {text[label]}
                      <span aria-hidden="true" className="pui-movements__arrow">{ARROW[state]}</span>
                    </button>
                  ) : (
                    text[label]
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {movements.length === 0 ? (
            <tr>
              <td colSpan={3} className="pui-movements__empty">{text.empty}</td>
            </tr>
          ) : visible.length === 0 ? (
            <tr>
              <td colSpan={3} className="pui-movements__empty">{fill(text.noMatches, { query: query_ })}</td>
            </tr>
          ) : (
            visible.map((movement) => (
              /* El id puede repetirse en un extracto mal formado: la posición desempata y no se pierde ninguna fila. */
              <tr key={`${movement.id}:${movement.position}`} className="pui-movements__row">
                <td className="pui-movements__cell pui-movements__date pui-type-mono-note">
                  {movement.date ? showDate(movement.date, formatDate) : text.unknownDate}
                </td>
                <th scope="row" className="pui-movements__cell pui-movements__description">{movement.description}</th>
                <td className="pui-movements__cell pui-movements__amount">
                  <Amount flow value={movement.amount} currency={currency} locale={locale} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {controls ? (
        <div role="status" className="pui-movements__status">
          {announcement}
        </div>
      ) : null}
    </div>
  );

  if (!filterable) return region;
  return (
    <div className="pui-movements-panel">
      <Field
        id={filterId}
        label={text.filter}
        marginalia={count}
        className="pui-movements-panel__filter"
      >
        <Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
      </Field>
      {region}
    </div>
  );
});
