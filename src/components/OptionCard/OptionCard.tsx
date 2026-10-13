import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './OptionCard.css';

export interface OptionCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'name' | 'onClick' | 'aria-pressed' | 'aria-label' | 'children'> {
  /** Cómo se llama la opción; es lo primero que anuncia un lector de pantalla. */
  name: string;
  /** Una línea sobre ella. */
  detail?: string | null;
  /**
   * El dibujo de lo que hace elegirla. Va con `aria-hidden`, porque dice lo
   * mismo que el nombre, y se dibuja en `currentColor` para invertirse con la
   * tarjeta elegida. Se omite si la opción no tiene nada que dibujar.
   */
  figure?: ReactNode;
  selected: boolean;
  /**
   * Por qué no se puede elegir. Su presencia deshabilita la tarjeta y escribe
   * la razón en ella; `null` la deja elegible.
   */
  disabledReason?: string | null;
  onSelect: () => void;
  /** La figura al lado del texto en vez de encima, para una lista ancha. */
  row?: boolean;
  /** Sustituye al nombre anunciado cuando el texto visible no basta. */
  ariaLabel?: string;
  /**
   * `card` es la tarjeta con borde; `notch` es una marca de una escala: lleva
   * el mismo estado pero sin el aspecto de tarjeta, porque las marcas se leen
   * unas contra otras.
   */
  variant?: 'card' | 'notch';
}

/**
 * Una opción dibujada. Es un botón con `aria-pressed`, no un `radio`: no
 * promete flechas ni un solo punto de tabulación, y cada opción se alcanza con
 * Tab. Una opción que no se puede elegir está de verdad deshabilitada y dice
 * por qué junto a sí misma, en vez de gastar el clic para avisarlo después.
 */
export const OptionCard = forwardRef<HTMLButtonElement, OptionCardProps>(function OptionCard(
  {
    name,
    detail,
    figure,
    selected,
    disabledReason,
    onSelect,
    row = false,
    ariaLabel,
    variant = 'card',
    className,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'pui-option-card',
        row && 'pui-option-card--row',
        variant === 'notch' && 'pui-option-card--notch',
        selected && 'pui-option-card--selected',
        className,
      )}
      {...rest}
      aria-pressed={selected}
      aria-label={ariaLabel}
      disabled={Boolean(disabledReason) || rest.disabled}
      onClick={onSelect}
    >
      {figure !== undefined && (
        <span className="pui-option-card__figure" aria-hidden="true">
          {figure}
        </span>
      )}
      <span className="pui-option-card__text">
        <span className="pui-option-card__name">{name}</span>
        {detail ? <span className="pui-option-card__detail">{detail}</span> : null}
        {disabledReason ? <span className="pui-option-card__reason">{disabledReason}</span> : null}
      </span>
    </button>
  );
});
