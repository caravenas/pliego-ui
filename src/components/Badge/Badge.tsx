import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Badge.css';

export type BadgeVariant = 'outline' | 'mono';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** `outline`: cápsula con filete (el distintivo «Datos de ejemplo» de la cabecera). `mono`: texto en monoespaciada, sin caja. */
  variant?: BadgeVariant;
}

/** Un distintivo de texto. Se lee como texto: nunca depende solo del color. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'outline', className, ...rest },
  ref,
) {
  return <span ref={ref} className={cx('pui-badge', `pui-badge--${variant}`, className)} {...rest} />;
});

export type Origin = 'factory' | 'edited' | 'own';

/** Las tres palabras con que la app dice de dónde viene una entrada de catálogo. */
export const ORIGIN_LABELS: Record<Origin, string> = {
  factory: 'de fábrica',
  edited: 'editado',
  own: 'tuyo',
};

export interface OriginBadgeProps extends Omit<BadgeProps, 'children'> {
  origin: Origin;
}

/** El origen de una entrada de catálogo, escrito en palabras: «de fábrica», «editado» o «tuyo». */
export const OriginBadge = forwardRef<HTMLSpanElement, OriginBadgeProps>(function OriginBadge(
  { origin, variant = 'mono', ...rest },
  ref,
) {
  return (
    <Badge ref={ref} variant={variant} data-origin={origin} {...rest}>
      {ORIGIN_LABELS[origin]}
    </Badge>
  );
});
