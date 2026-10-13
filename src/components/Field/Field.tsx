import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Field.css';

export interface FieldProps {
  /** En minúsculas: las versalitas las pone el CSS. */
  label: string;
  /** Id del control; de él salen `${id}-label`, `${id}-error` y `${id}-note`. */
  id: string;
  /** Nota en el margen derecho de la fila de etiqueta. `null` no deja nada en el DOM. */
  marginalia?: string | null;
  /** Texto del error. Se anuncia con `role="alert"`. */
  error?: string | null;
  /** Debajo del control, p. ej. la nota de origen. */
  note?: ReactNode;
  /** El control es un grupo: etiqueta `<span>` y `aria-labelledby` en lugar de `<label>`. */
  group?: boolean;
  className?: string;
  /** El control. */
  children: ReactNode;
}

/**
 * Etiqueta, nota al margen, error y nota de origen de un campo.
 *
 * Enlaza el control clonando su único hijo elemento. Si `children` es otra
 * cosa, no inyecta nada y el consumidor usa los ids derivados de `id`.
 */
export function Field({ label, id, marginalia, error, note, group, className, children }: FieldProps) {
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const noteId = `${id}-note`;
  const hasNote = note !== undefined && note !== null && note !== false;
  const describedBy = [error ? errorId : null, hasNote ? noteId : null].filter(Boolean).join(' ');

  const labelNode = group ? (
    <span id={labelId} className="pui-field__label pui-type-form-label">
      {label}
    </span>
  ) : (
    <label id={labelId} htmlFor={id} className="pui-field__label pui-type-form-label">
      {label}
    </label>
  );

  let control: ReactNode;
  if (group) {
    control = (
      <div role="group" id={id} aria-labelledby={labelId} aria-describedby={describedBy || undefined}>
        {children}
      </div>
    );
  } else if (isValidElement(children)) {
    control = cloneElement(children as ReactElement<Record<string, unknown>>, {
      id,
      'aria-describedby': describedBy || undefined,
      'aria-invalid': error ? true : undefined,
    });
  } else {
    control = children;
  }

  return (
    <div className={cx('pui-field', className)}>
      <div className="pui-field__row">
        {labelNode}
        {marginalia ? <span className="pui-field__marginalia pui-type-marginalia">{marginalia}</span> : null}
      </div>
      {control}
      {error ? (
        <p id={errorId} role="alert" className="pui-field__error">
          {error}
        </p>
      ) : null}
      {hasNote ? (
        <div id={noteId} className="pui-field__note pui-type-mono-note">
          {note}
        </div>
      ) : null}
    </div>
  );
}
