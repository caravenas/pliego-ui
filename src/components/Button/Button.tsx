import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonShape = 'rect' | 'round';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * - `primary`: relleno de tinta. La acción que cierra un formulario («Guardar cambios»).
   * - `secondary`: papel con filete. La alternativa («Cancelar»).
   * - `outline`: borde de tinta sobre transparente, el lenguaje de los controles de la app.
   * - `danger`: solo texto en `color-danger-foreground`. Eliminar, volver a fábrica.
   */
  variant?: ButtonVariant;
  /** `rect`: 40 px de alto y `radius-md`. `round`: círculo de 40 px en monoespaciada, para + y −. */
  shape?: ButtonShape;
}

/**
 * El botón de PliegoStack. Unifica lo que en la app eran `catalog-primary`,
 * `catalog-secondary`, `catalog-danger` y `counter-button`.
 * Por defecto es `type="button"`: dentro de un formulario no lo envía salvo que se pida.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', shape = 'rect', type = 'button', className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('pui-button', `pui-button--${variant}`, shape === 'round' && 'pui-button--round', className)}
      {...rest}
    />
  );
});
