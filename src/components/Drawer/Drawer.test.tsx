import { useState } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer } from './Drawer';

function Host({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        editar
      </button>
      <button type="button">otro control</button>
      <Drawer
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange?.(next);
        }}
        title="editar catálogo"
      >
        <input aria-label="nombre" />
      </Drawer>
    </>
  );
}

describe('Drawer', () => {
  it('cerrado no pinta nada; abierto es un diálogo nombrado por su título y no modal', async () => {
    const user = userEvent.setup();
    render(<Host />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'editar' }));
    const dialog = screen.getByRole('dialog', { name: 'editar catálogo' });
    expect(dialog).not.toHaveAttribute('aria-modal', 'true');
    expect(dialog).toContainElement(screen.getByLabelText('nombre'));
  });

  it('Escape y el botón de cerrar piden cerrar, y el botón tiene su nombre accesible', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Host onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'editar' }));
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'editar' }));
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closeLabel sustituye al nombre del botón', () => {
    render(
      <Drawer defaultOpen title="catálogo" closeLabel="Cerrar catálogo">
        x
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: 'Cerrar catálogo' })).toBeInTheDocument();
  });

  it('no es modal: un clic fuera no lo cierra y el resto de la página sigue accesible', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Host onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'editar' }));
    onOpenChange.mockClear();
    await user.click(screen.getByRole('button', { name: 'otro control' }));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'otro control' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'otro control' })).not.toHaveAttribute('aria-hidden');
  });

  it('el foco entra en el panel al abrir y vuelve a donde estaba al cerrar', async () => {
    const user = userEvent.setup();
    render(<Host />);
    const opener = screen.getByRole('button', { name: 'editar' });
    await user.click(opener);
    expect(screen.getByRole('dialog')).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(opener).toHaveFocus();
  });

  it('no controlado: defaultOpen lo abre', () => {
    render(
      <Drawer defaultOpen title="catálogo">
        x
      </Drawer>,
    );
    expect(screen.getByRole('dialog', { name: 'catálogo' })).toBeInTheDocument();
  });
});

describe('CSS de Drawer', () => {
  const code = readFileSync(resolve(__dirname, 'Drawer.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // Comentadas en el CSS: 40/44px de área mínima, pesos de 1px y 2px, y el ancho
  // del panel (30rem), sin equivalente en la escala.
  const allowedSizes = new Set(['40px', '44px', '1px', '2px', '30rem', '100%']);

  it('no tiene colores, tamaños ni radios literales', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    const sizes = code.match(/-?\d*\.?\d+(?:px|rem|em|%)/g) ?? [];
    expect(sizes.filter((size) => !allowedSizes.has(size))).toEqual([]);
    expect(code).not.toMatch(/\d+ms/);
  });

  it('el movimiento sale de los tokens y respeta prefers-reduced-motion', () => {
    expect(code).toMatch(/animation:\s*pui-drawer-in var\(--transition-drawer-in\)/);
    expect(code).toMatch(/animation:\s*pui-drawer-out var\(--transition-drawer-out\)/);
    expect(code).toMatch(/prefers-reduced-motion:\s*reduce[\s\S]*animation:\s*none/);
  });
});
