import type { ReactNode } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { cx } from '../../utils/cx';
import './Toast.css';

export interface ToastProviderProps {
  /** Nombre de la región de avisos para lectores de pantalla; `{hotkey}` es F8. */
  label?: string;
  children: ReactNode;
}

/**
 * Lleva la región donde se apilan los avisos. Va una vez, cerca de la raíz de
 * la aplicación; los `Toast` van dentro, donde se necesiten.
 */
export function ToastProvider({ label = 'Avisos ({hotkey})', children }: ToastProviderProps) {
  return (
    // `label` del Provider nombra cada aviso («Aviso»); la región se nombra en el Viewport.
    <RadixToast.Provider label="Aviso" swipeDirection="right">
      {children}
      <RadixToast.Viewport className="pui-toast-viewport" label={label} />
    </RadixToast.Provider>
  );
}

export interface ToastProps {
  /** Controlado. */
  open?: boolean;
  /** No controlado. Por defecto, abierto: montar un aviso es mostrarlo. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `note` informa y se va solo; `error` dice qué falla y se queda hasta que se descarta. */
  variant?: 'note' | 'error';
  /** Una línea en negrita antes del texto. */
  title?: string;
  /** Cuánto dura abierto, en milisegundos. `Infinity` no se cierra solo. */
  duration?: number;
  /** El nombre accesible del botón que descarta el aviso. */
  closeLabel?: string;
  /** Una acción sobre el aviso (por ejemplo, «deshacer»). */
  action?: { label: string; onAction: () => void };
  className?: string;
  children: ReactNode;
}

/** Cuánto tarda un aviso informativo en irse solo. */
const NOTE_DURATION_MS = 5000;

/**
 * Un aviso descartable. Un error no se va solo: un mensaje que desaparece a
 * los cinco segundos no lo lee quien tarda más, y es justo el que hay que
 * leer. Lo informativo sí se va, y se anuncia con calma.
 *
 * Sobre Radix Toast, que lleva el anuncio a lectores de pantalla, la pausa al
 * enfocar o apuntar y el gesto de descartar con el dedo.
 */
export function Toast({
  open,
  defaultOpen,
  onOpenChange,
  variant = 'note',
  title,
  duration,
  closeLabel = 'Descartar aviso',
  action,
  className,
  children,
}: ToastProps) {
  const isError = variant === 'error';
  return (
    <RadixToast.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      type={isError ? 'foreground' : 'background'}
      duration={duration ?? (isError ? Infinity : NOTE_DURATION_MS)}
      className={cx('pui-toast', `pui-toast--${variant}`, className)}
    >
      <div className="pui-toast__content">
        {title ? <RadixToast.Title className="pui-toast__title">{title}</RadixToast.Title> : null}
        <RadixToast.Description className="pui-toast__text">{children}</RadixToast.Description>
      </div>
      {action ? (
        <RadixToast.Action asChild altText={action.label}>
          <button type="button" className="pui-toast__button" onClick={action.onAction}>
            {action.label}
          </button>
        </RadixToast.Action>
      ) : null}
      <RadixToast.Close className="pui-toast__button pui-toast__close" aria-label={closeLabel}>
        <span aria-hidden="true">×</span>
      </RadixToast.Close>
    </RadixToast.Root>
  );
}
