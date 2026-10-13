import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './ResultList.css';

export type ResultListProps = HTMLAttributes<HTMLDListElement>;

/**
 * Una cifra y su nombre, una por línea, separadas por filetes. Es una lista de
 * descripción porque eso es lo que es: un nombre y un valor, repetidos.
 * Decirlo así deja a un lector de pantalla moverse entre ellos como pares.
 */
export const ResultList = forwardRef<HTMLDListElement, ResultListProps>(function ResultList(
  { className, ...rest },
  ref,
) {
  return <dl ref={ref} className={cx('pui-result-list', className)} {...rest} />;
});

export interface ResultRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Lo que es la cifra, inequívoco: «hojas de papel (interior)». */
  label: string;
  /**
   * La unidad es de la fila y no parte de su nombre: se escribe pequeña junto a
   * la cifra, donde pertenece al número, y no entre paréntesis tras la etiqueta,
   * donde se leía como parte de cómo se llama la fila. Las filas cuya cifra no
   * lleva unidad (un recuento, una palabra) simplemente la omiten.
   */
  unit?: string;
  /** La cifra. */
  children: ReactNode;
}

export const ResultRow = forwardRef<HTMLDivElement, ResultRowProps>(function ResultRow(
  { label, unit, children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('pui-result-row', className)} {...rest}>
      <dt className="pui-result-row__label pui-type-stat-label">{label}</dt>
      <dd className="pui-result-row__value pui-type-stat-value">
        {children}
        {unit ? <span className="pui-result-row__unit pui-type-stat-unit"> {unit}</span> : null}
      </dd>
    </div>
  );
});
