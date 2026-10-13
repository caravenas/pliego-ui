import { forwardRef, useState, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './SpecStep.css';

export interface SpecStepProps {
  /** Se escribe con dos dígitos. */
  number: number;
  title: string;
  /** El valor del paso cerrado. Se oculta con el paso abierto. */
  summary: ReactNode;
  /** El «···» que lleva al catálogo del paso. Sin él no se pinta el botón. */
  onOptions?: () => void;
  /** Nombra el catálogo en el nombre accesible del botón: «Opciones de …». Por defecto, el título. */
  optionsLabel?: string;
  /** Controlado. */
  open?: boolean;
  /** No controlado. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

/**
 * Un paso de la ficha técnica: número, título, el valor que dice mientras
 * está cerrado y el cuerpo con sus controles. La ficha se lee entera aunque
 * ninguno esté abierto, porque cada paso cerrado sigue diciendo lo que vale.
 *
 * Es un `<details>`: el teclado y el estado expandido que anuncia vienen de
 * serie. El estado lo lleva el componente (no el navegador), para que
 * `open` controle de verdad y un clic que el consumidor no acepta no deje el
 * DOM y el estado discrepando.
 *
 * El botón «···» no va dentro del `<summary>`, que ya es interactivo: axe lo
 * marca como `nested-interactive` (grave), porque un lector de pantalla no
 * garantiza anunciar un control dentro de otro. Tampoco puede ir dentro del
 * `<details>`, que oculta todo lo que no es el `<summary>` con el paso cerrado.
 * Por eso el `<details>` va envuelto, y el botón es hermano suyo, posado sobre
 * el margen derecho de la fila del título: su clic no pliega el paso sin
 * necesitar `stopPropagation`.
 */
export const SpecStep = forwardRef<HTMLDetailsElement, SpecStepProps>(function SpecStep(
  { number, title, summary, onOptions, optionsLabel, open, defaultOpen = false, onOpenChange, className, children },
  ref,
) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const current = isControlled ? open : innerOpen;

  function toggle(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    const next = !current;
    if (!isControlled) setInnerOpen(next);
    onOpenChange?.(next);
  }

  return (
    <div className={cx('pui-spec-step', className)}>
      <details ref={ref} className="pui-spec-step__details" open={current}>
        <summary className="pui-spec-step__summary" onClick={toggle}>
          <span className="pui-spec-step__number pui-type-mono-note">{String(number).padStart(2, '0')}</span>
          <h2 className="pui-spec-step__title pui-type-spec-step-title">{title}</h2>
          {/* Bajo el título y no a su lado: un título largo dejaba el valor en
              una elipsis, y el valor es lo que se lee. Va dentro del <summary>
              porque lo que hay fuera es justo lo que el cierre oculta. */}
          <span className="pui-spec-step__value pui-type-mono-note">{summary}</span>
        </summary>
        <div className="pui-spec-step__body">{children}</div>
      </details>
      {onOptions ? (
        <button
          type="button"
          className="pui-spec-step__options pui-type-mono-note"
          aria-label={`Opciones de ${optionsLabel ?? title.toLowerCase()}`}
          onClick={onOptions}
        >
          ···
        </button>
      ) : null}
    </div>
  );
});
