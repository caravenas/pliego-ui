import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './DashboardGrid.css';

export type DashboardGridProps = HTMLAttributes<HTMLDivElement>;

export interface DashboardCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Ocupa la fila entera: para lo que necesita ancho, como una tabla. */
  wide?: boolean;
}

/**
 * La rejilla de una pantalla de paneles: 3 columnas a 1024 px, 2 a 768 y 1 a
 * 375, por el ancho mínimo de columna y no por puntos de corte. No pone
 * `main`, encabezado ni nombre: eso es de la página. El orden del DOM es el
 * orden visual, así que Tab recorre la pantalla como se ve.
 */
export const DashboardGrid = forwardRef<HTMLDivElement, DashboardGridProps>(function DashboardGrid(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('pui-dashboard-grid', className)} {...rest} />;
});

export const DashboardCell = forwardRef<HTMLDivElement, DashboardCellProps>(function DashboardCell(
  { wide, className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('pui-dashboard-cell', wide && 'pui-dashboard-cell--wide', className)} {...rest} />;
});
