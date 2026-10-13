import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Select.css';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

/**
 * El desplegable nativo en la cápsula de `Input`. Sigue siendo un `<select>`:
 * teclado, lectores de pantalla y el selector del sistema en móvil vienen de
 * serie. No trae etiqueta: la pone `Field` o el consumidor.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={cx('pui-select', className)} {...rest}>
      {children}
    </select>
  );
});
