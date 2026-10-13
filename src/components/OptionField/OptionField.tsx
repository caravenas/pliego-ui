import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Field } from '../Field/Field';
import './OptionField.css';

export interface OptionFieldProps {
  /** El nombre del campo, que etiqueta el grupo: «orientación». En minúsculas. */
  label: string;
  /** Prefijo estable de los ids que necesita el campo. */
  id: string;
  /** Nota al margen derecho de la fila de etiqueta; `null` no reserva sitio. */
  marginalia?: string | null;
  /** Cuántas opciones comparten fila cuando se disponen en rejilla. */
  columns?: number;
  /**
   * `grid` es una fila de tarjetas; `scale` es una fila de marcas apoyadas en
   * un eje, para un campo cuyas opciones son una magnitud a distintos tamaños.
   */
  layout?: 'grid' | 'scale';
  /** Las opciones son entradas de un catálogo y no elecciones escritas en el código. */
  fromCatalog?: boolean;
  /** Se muestra bajo el control cuando el campo mismo está mal. */
  error?: string | null;
  /** Lo que sea que vaya bajo el control, como una nota de origen. */
  note?: ReactNode;
  children: ReactNode;
}

/** Un `Field` de grupo cuyas opciones son `OptionCard`. */
export function OptionField({
  label,
  id,
  marginalia,
  columns = 3,
  layout = 'grid',
  fromCatalog = false,
  error,
  note,
  children,
}: OptionFieldProps) {
  return (
    <Field label={label} id={id} marginalia={marginalia} error={error} note={note} group>
      <div
        className={cx(
          'pui-option-group',
          layout === 'scale' && 'pui-option-group--scale',
          fromCatalog && 'pui-option-group--catalog',
        )}
        style={{ '--option-columns': columns } as CSSProperties}
      >
        {children}
      </div>
    </Field>
  );
}
