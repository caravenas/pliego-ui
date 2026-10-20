import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { Amount } from '../Amount/Amount';
import './MovementsTable.css';

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
}

const DEFAULT_LABELS: MovementsTableLabels = {
  date: 'fecha',
  description: 'concepto',
  amount: 'importe',
  empty: 'sin movimientos',
  unknownDate: 'sin fecha',
};

export interface MovementsTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Nombra la tabla para quien no la ve: «movimientos de octubre». */
  caption: string;
  movements: readonly Movement[];
  currency: string;
  locale?: string;
  formatDate?: (date: string) => string;
  labels?: Partial<MovementsTableLabels>;
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

/**
 * Los movimientos de una cuenta, solo para leer. El contenedor se puede enfocar
 * porque, en una pantalla estrecha, la tabla se desplaza de lado y el teclado
 * tiene que poder hacerlo.
 */
export const MovementsTable = forwardRef<HTMLDivElement, MovementsTableProps>(function MovementsTable(
  { caption, movements, currency, locale, formatDate, labels, className, ...rest },
  ref,
) {
  const text = { ...DEFAULT_LABELS, ...labels };
  return (
    <div ref={ref} role="region" aria-label={caption} tabIndex={0} className={cx('pui-movements', className)} {...rest}>
      <table className="pui-movements__table">
        <caption className="pui-movements__caption pui-type-stat-label">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="pui-movements__head pui-type-stat-label">{text.date}</th>
            <th scope="col" className="pui-movements__head pui-type-stat-label">{text.description}</th>
            <th scope="col" className="pui-movements__head pui-movements__head--amount pui-type-stat-label">{text.amount}</th>
          </tr>
        </thead>
        <tbody>
          {movements.length === 0 ? (
            <tr>
              <td colSpan={3} className="pui-movements__empty">{text.empty}</td>
            </tr>
          ) : (
            movements.map((movement, index) => (
              /* El id puede repetirse en un extracto mal formado: la posición desempata y no se pierde ninguna fila. */
              <tr key={`${movement.id}:${index}`} className="pui-movements__row">
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
    </div>
  );
});
