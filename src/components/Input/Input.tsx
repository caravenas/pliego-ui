import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Input.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * El campo en cápsula, la firma visual de PliegoStack: borde de tinta, fondo
 * transparente y `border-radius: 9999px`. No trae etiqueta: el consumidor la
 * aporta y la une con `id`/`htmlFor` o con `aria-label`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = 'text', className, ...rest },
  ref,
) {
  return <input ref={ref} type={type} className={cx('pui-input', className)} {...rest} />;
});
