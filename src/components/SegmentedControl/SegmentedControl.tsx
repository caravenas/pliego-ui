import { forwardRef, useRef, type KeyboardEvent, type ReactElement, type Ref } from 'react';
import { cx } from '../../utils/cx';
import { nextValue, tabStopValue } from './useRovingSelection';
import './SegmentedControl.css';

export interface SegmentedOption<V extends string> {
  value: V;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<V extends string> {
  /** `tabs` cambia lo que se mira; `options` cambia un valor. */
  kind: 'tabs' | 'options';
  /** El `aria-label` del grupo. */
  label: string;
  value: V;
  options: SegmentedOption<V>[];
  onChange: (value: V) => void;
  /** Da a cada segmento el id `${id}-${value}`, para que el consumidor enlace sus paneles. */
  id?: string;
  className?: string;
}

/**
 * Un rectángulo recortado de segmentos que comparten costura. Las dos
 * semánticas se dibujan igual y se manejan igual: un solo punto de
 * tabulación, flechas, Inicio y Fin, y la selección acompaña al foco.
 *
 * `tabs` es un `tablist` y no pinta paneles: los pinta el consumidor.
 * `options` es un `radiogroup`, porque elige un valor entre varios.
 */
function SegmentedControlImpl<V extends string>(
  { kind, label, value, options, onChange, id, className }: SegmentedControlProps<V>,
  ref: Ref<HTMLDivElement>,
) {
  const segments = useRef(new Map<V, HTMLButtonElement>());
  const isTabs = kind === 'tabs';
  const tabStop = tabStopValue(options, value);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, from: V) => {
    const next = nextValue(options, from, event.key);
    if (next === undefined) return;
    event.preventDefault();
    segments.current.get(next)?.focus();
    if (next !== value) onChange(next);
  };

  return (
    <div
      ref={ref}
      role={isTabs ? 'tablist' : 'radiogroup'}
      aria-label={label}
      className={cx('pui-segmented', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              if (node) segments.current.set(option.value, node);
              else segments.current.delete(option.value);
            }}
            id={id ? `${id}-${option.value}` : undefined}
            type="button"
            role={isTabs ? 'tab' : 'radio'}
            {...(isTabs ? { 'aria-selected': selected } : { 'aria-checked': selected })}
            tabIndex={option.value === tabStop ? 0 : -1}
            disabled={option.disabled}
            className={cx('pui-segmented__segment pui-type-central-tab', selected && 'pui-segmented__segment--selected')}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// forwardRef pierde el parámetro de tipo del componente: se restituye aquí.
export const SegmentedControl = forwardRef(SegmentedControlImpl) as <V extends string>(
  props: SegmentedControlProps<V> & { ref?: Ref<HTMLDivElement> },
) => ReactElement;
