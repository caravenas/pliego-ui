import { useState } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastProvider } from './Toast';

describe('Toast', () => {
  it('la región de avisos tiene nombre y el aviso se muestra con título y texto', () => {
    render(
      <ToastProvider>
        <Toast title="guardado">Los cambios están en este navegador.</Toast>
      </ToastProvider>,
    );
    expect(screen.getByRole('region', { name: /Avisos/ })).toBeInTheDocument();
    expect(screen.getAllByText('guardado').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Los cambios están en este navegador.').length).toBeGreaterThan(0);
  });

  it('el botón de descartar pide cerrar y quita el aviso, y closeLabel cambia su nombre', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ToastProvider>
        <Toast onOpenChange={onOpenChange} closeLabel="Quitar">
          texto
        </Toast>
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Quitar' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Quitar' })).not.toBeInTheDocument());
  });

  it('la acción llama a onAction', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <ToastProvider>
        <Toast action={{ label: 'deshacer', onAction }}>cambio aplicado</Toast>
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'deshacer' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('controlado: sigue a `open`', () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <ToastProvider>
          <button type="button" onClick={() => setOpen(true)}>
            avisar
          </button>
          <Toast open={open} onOpenChange={setOpen}>
            aviso controlado
          </Toast>
        </ToastProvider>
      );
    }
    render(<Host />);
    expect(screen.queryByText('aviso controlado')).not.toBeInTheDocument();
    act(() => screen.getByRole('button', { name: 'avisar' }).click());
    expect(screen.getAllByText('aviso controlado').length).toBeGreaterThan(0);
  });

  it('una nota se va sola pasado su `duration`', async () => {
    render(
      <ToastProvider>
        <Toast duration={30}>se va solo</Toast>
      </ToastProvider>,
    );
    expect(screen.getAllByText('se va solo').length).toBeGreaterThan(0);
    await waitFor(() => expect(screen.queryByText('se va solo')).not.toBeInTheDocument(), { timeout: 2000 });
  });

  it('un error no se va solo: sigue abierto mucho después de lo que dura una nota', () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider>
          <Toast variant="error">no se puede guardar</Toast>
        </ToastProvider>,
      );
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      expect(screen.getAllByText('no se puede guardar').length).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('las variantes llevan su clase', () => {
    const { container } = render(
      <ToastProvider>
        <Toast variant="error">mal</Toast>
      </ToastProvider>,
    );
    expect(container.ownerDocument.querySelector('.pui-toast--error')).not.toBeNull();
  });
});

describe('CSS de Toast', () => {
  const code = readFileSync(resolve(__dirname, 'Toast.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // Comentadas en el CSS: 40/44px de área mínima, pesos de 1px y 2px, y el ancho
  // de la columna de avisos (24rem), sin equivalente en la escala, y el 30% del
  // color-mix del borde del error.
  const allowedSizes = new Set(['40px', '44px', '1px', '2px', '24rem', '100%', '100vw', '30%']);

  it('no tiene colores, tamaños, radios ni duraciones literales', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    const sizes = code.match(/-?\d*\.?\d+(?:px|rem|em|%|vw)/g) ?? [];
    expect(sizes.filter((size) => !allowedSizes.has(size))).toEqual([]);
    expect(code).not.toMatch(/\d+ms/);
  });

  it('el movimiento sale de los tokens y respeta prefers-reduced-motion', () => {
    expect(code).toMatch(/animation:\s*pui-toast-in var\(--transition-normal\)/);
    expect(code).toMatch(/prefers-reduced-motion:\s*reduce[\s\S]*animation:\s*none/);
  });
});
