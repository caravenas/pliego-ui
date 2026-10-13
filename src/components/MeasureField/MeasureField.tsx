import { forwardRef, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { decimalsOf, roundTo } from '../../utils/roundTo';
import './MeasureField.css';

export interface MeasureFieldProps {
  /** En minúsculas: las versalitas las pone el CSS. */
  label: string;
  /** Id del input; de él salen `${id}-unit` y `${id}-marginalia`. */
  id: string;
  /** El valor tal como se muestra, en la unidad de al lado. `''` si no es finito. */
  value: number | '';
  unit: string;
  /** Una pulsación de flecha, y una muesca del arrastre. */
  step: number;
  /** Cuánto recorre el puntero por cada paso. */
  pixelsPerStep?: number;
  min?: number;
  /** Se llama con el valor nuevo, en la unidad mostrada. */
  onChange: (value: number) => void;
  /** De dónde sale el valor, o qué otro control lo decide. `null` no deja nodo. */
  marginalia?: string | null;
  /** Subrayada discontinua, como se dibuja un sangrado: donde cae el corte. */
  dashed?: boolean;
  className?: string;
}

/**
 * Una medida como una cifra en una línea y no como un valor en una caja: la
 * cifra es el control, su unidad es el tirador que se arrastra para cambiarla
 * y las flechas la mueven un paso, diez con Mayús. Es el único control de
 * entrada que no va en cápsula: es una cota, no un campo.
 *
 * Las tres formas de entrada son deliberadas y no redundantes. Escribir es
 * fijar una medida que ya se sabe; las flechas, ajustar una que se está
 * decidiendo; arrastrar, buscarla, porque es la única que redibuja de forma
 * continua mientras se mueve.
 *
 * El tirador es un `span` con manejadores de puntero y no se alcanza con
 * teclado. No es una carencia: las flechas sobre la cifra hacen lo mismo, con
 * el mismo valor y el mismo paso.
 */
export const MeasureField = forwardRef<HTMLInputElement, MeasureFieldProps>(function MeasureField(
  { label, id, value, unit, step, pixelsPerStep = 3, min = 0, onChange, marginalia, dashed = false, className },
  ref,
) {
  /** Dónde empezó el arrastre y con qué valor, mientras dure. */
  const drag = useRef<{ x: number; value: number } | null>(null);
  const unitId = `${id}-unit`;
  const marginaliaId = `${id}-marginalia`;

  /**
   * Un paso dado por el arrastre o por una flecha: cae en la rejilla del paso
   * y nunca baja del mínimo. Lo que se escribe se deja en paz: redondearlo
   * mientras se escribe pelearía con quien está a medias.
   */
  function stepTo(next: number): void {
    onChange(roundTo(Math.max(min, next), decimalsOf(step)));
  }

  function startDrag(event: PointerEvent<HTMLSpanElement>): void {
    if (value === '') return;
    // Capturar hace que el arrastre sobreviva a que el puntero salga del
    // tirador, que lo hace al instante: el tirador es corto y el gesto no.
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, value };
  }

  function continueDrag(event: PointerEvent<HTMLSpanElement>): void {
    const from = drag.current;
    if (!from) return;
    const notches = Math.round((event.clientX - from.x) / pixelsPerStep);
    stepTo(from.value + notches * step);
  }

  function endDrag(event: PointerEvent<HTMLSpanElement>): void {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    // Una flecha sola ya mueve un paso: para eso es el input numérico, y
    // reimplementarlo solo sería una forma de discrepar con él.
    if (!event.shiftKey) return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

    event.preventDefault();
    if (value === '') return;
    stepTo(value + (event.key === 'ArrowUp' ? 10 : -10) * step);
  }

  const note: ReactNode = marginalia ? (
    <span id={marginaliaId} className="pui-measure__marginalia pui-type-marginalia">
      {marginalia}
    </span>
  ) : null;

  return (
    <div className={cx('pui-measure', className)}>
      <label htmlFor={id} className="pui-measure__label pui-type-form-label">
        {label}
      </label>
      <span className={cx('pui-measure__value', dashed && 'pui-measure__value--dashed')}>
        <input
          ref={ref}
          type="number"
          className="pui-measure__input pui-type-measure-input"
          id={id}
          value={value}
          step={step}
          min={min}
          aria-describedby={marginalia ? `${unitId} ${marginaliaId}` : unitId}
          onChange={(event) => onChange(parseFloat(event.target.value) || 0)}
          onKeyDown={onKeyDown}
        />
        <span
          id={unitId}
          className="pui-measure__unit pui-type-mono-note"
          title="Arrastra para ajustar"
          onPointerDown={startDrag}
          onPointerMove={continueDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {unit}
          <span aria-hidden="true"> ⇔</span>
        </span>
      </span>
      {note}
    </div>
  );
});

export interface MeasureGridProps {
  children: ReactNode;
  className?: string;
}

/** Las tres medidas de un formato son una sola decisión: se leen como una fila, no como un formulario. */
export function MeasureGrid({ children, className }: MeasureGridProps) {
  return <div className={cx('pui-measure-grid', className)}>{children}</div>;
}
