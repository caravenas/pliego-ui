import { Fragment, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './HowPanel.css';

export interface HowPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  title?: string;
  /** Las fórmulas, una por línea. */
  formulas: ReactNode[];
  /** Texto explicativo bajo las fórmulas: lo que no cabe en una línea. */
  children?: ReactNode;
  /** La salvedad que califica a toda la columna, dicha una vez donde acaba. */
  note?: ReactNode;
}

/**
 * De qué están hechas las cifras de arriba, al pie de la columna que explican
 * y bajo un filete propio: forma parte de la columna, no es un cajón que haya
 * que abrir. Son pocas líneas que dicen de qué se componen las cifras, y eso
 * vale el sitio que ocupan.
 *
 * Sin fórmulas ni texto no pinta nada: una sección que se abre sobre nada es
 * peor que no tener sección.
 */
export const HowPanel = forwardRef<HTMLElement, HowPanelProps>(function HowPanel(
  { title = 'Cómo se calcula', formulas, children, note, className, ...rest },
  ref,
) {
  const hasText = children !== undefined && children !== null && children !== false;
  if (formulas.length === 0 && !hasText) return null;

  return (
    <section ref={ref} className={cx('pui-how-panel', className)} aria-label={title} {...rest}>
      <h3 className="pui-how-panel__title pui-type-stat-label">{title}</h3>
      {formulas.length > 0 ? (
        <p className="pui-how-panel__formula">
          {formulas.map((formula, index) => (
            <Fragment key={index}>
              {index > 0 ? <br /> : null}
              {formula}
            </Fragment>
          ))}
        </p>
      ) : null}
      {hasText ? <div className="pui-how-panel__text">{children}</div> : null}
      {note ? <p className="pui-how-panel__note pui-type-mono-note">{note}</p> : null}
    </section>
  );
});
