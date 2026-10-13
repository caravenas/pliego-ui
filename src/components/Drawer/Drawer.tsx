import { useRef, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cx } from '../../utils/cx';
import './Drawer.css';

export interface DrawerProps {
  /** Controlado. */
  open?: boolean;
  /** No controlado. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Nombra el panel. Se escribe en minúsculas: las versalitas las pone el CSS. */
  title: string;
  /** El nombre accesible del botón que cierra. */
  closeLabel?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Un panel lateral que entra por el borde derecho sobre lo que se está mirando.
 *
 * **No es modal**: no atrapa el foco, no inerta el resto de la página y un clic
 * fuera no lo cierra. PliegoStack pasó su catálogo de diálogo modal a panel
 * porque la lámina de cristal sobre toda la herramienta tapaba la vista desde
 * la que se pulsó «editar». Lo que un modal daba gratis y un panel hay que
 * decirle, se hace aquí: Escape lo cierra, el foco entra en el panel al abrir
 * y vuelve a donde estaba al cerrar.
 *
 * Sobre Radix Dialog con `modal={false}`, que lleva el rol, el nombre y el
 * Escape; el movimiento sale de los tokens `transition-drawer-*`.
 */
export function Drawer({
  open,
  defaultOpen,
  onOpenChange,
  title,
  closeLabel = 'Cerrar',
  className,
  children,
}: DrawerProps) {
  const panel = useRef<HTMLDivElement>(null);
  /** Dónde estaba el teclado cuando el panel lo tomó. */
  const cameFrom = useRef<HTMLElement | null>(null);

  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          ref={panel}
          className={cx('pui-drawer', className)}
          // Sin descripción: el título nombra el panel y no hay más que decir.
          aria-describedby={undefined}
          // Un panel junto a la vista no se cierra por pulsar en ella: la vista
          // sigue siendo suya y el panel es su otra mitad.
          onInteractOutside={(event) => event.preventDefault()}
          onOpenAutoFocus={(event) => {
            // Entra el panel y no el botón de cerrar: lo primero que oye quien
            // lee es dónde está ahora, no la salida.
            event.preventDefault();
            cameFrom.current = document.activeElement as HTMLElement | null;
            panel.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            // Radix solo devuelve el foco a su Trigger, y aquí no hay: lo devuelve
            // el panel, y solo si el origen sigue en la página.
            event.preventDefault();
            const previous = cameFrom.current;
            cameFrom.current = null;
            if (previous?.isConnected) previous.focus();
          }}
          tabIndex={-1}
        >
          <div className="pui-drawer__header">
            <Dialog.Title className="pui-drawer__title pui-type-spec-step-title">{title}</Dialog.Title>
            <Dialog.Close className="pui-drawer__close" aria-label={closeLabel}>
              <span aria-hidden="true">×</span>
            </Dialog.Close>
          </div>
          <div className="pui-drawer__body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
