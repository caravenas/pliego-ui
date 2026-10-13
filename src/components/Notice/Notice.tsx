import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Notice.css';

export type NoticeVariant = 'note' | 'preview' | 'error' | 'config';

export interface NoticeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * `note` y `preview` informan; `error` dice qué regla falla; `config` es el
   * error de una configuración que impide arrancar y ocupa su región entera.
   */
  variant: NoticeVariant;
  /** Una línea en negrita antes del texto. No es un encabezado: no cambia el esquema de la página. */
  title?: string;
  children: ReactNode;
}

/**
 * El rol sale de la variante: lo que informa se anuncia con calma (`status`),
 * y lo que impide o corrige se anuncia al momento (`alert`). Un error dice qué
 * regla falla y no un mensaje genérico; eso lo escribe el consumidor.
 */
const ROLES: Record<NoticeVariant, 'status' | 'alert'> = {
  note: 'status',
  preview: 'status',
  error: 'alert',
  config: 'alert',
};

export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice(
  { variant, title, children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} role={ROLES[variant]} className={cx('pui-notice', `pui-notice--${variant}`, className)} {...rest}>
      {title ? <p className="pui-notice__title">{title}</p> : null}
      {children}
    </div>
  );
});
