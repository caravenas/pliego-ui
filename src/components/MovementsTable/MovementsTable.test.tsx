import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { MovementsTable, type Movement } from './MovementsTable';
import userEvent from '@testing-library/user-event';
import { act, fireEvent } from '@testing-library/react';

const movements: Movement[] = [
  { id: 'a', date: '2026-10-01', description: 'sueldo', amount: 1500 },
  { id: 'b', date: '2026-10-03', description: 'arriendo', amount: -600.25 },
];

const renderTable = (props: Partial<React.ComponentProps<typeof MovementsTable>> = {}) =>
  render(<MovementsTable caption="movimientos de octubre" movements={movements} currency="USD" locale="en-US" {...props} />);

describe('MovementsTable', () => {
  it('es una tabla con caption, cabeceras con scope y una fila por movimiento', () => {
    renderTable();
    const table = screen.getByRole('table', { name: 'movimientos de octubre' });
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['fecha', 'concepto', 'importe']);
    expect(within(table).getAllByRole('columnheader').every((h) => h.getAttribute('scope') === 'col')).toBe(true);
    expect(within(table).getAllByRole('rowheader').map((h) => h.textContent)).toEqual(['sueldo', 'arriendo']);
    expect(table).toHaveTextContent('+$1,500.00 abono');
    expect(table).toHaveTextContent('−$600.25 cargo');
  });

  it('el contenedor es una región con nombre que el teclado alcanza, y los importes van a la derecha', () => {
    const { container } = renderTable();
    const region = screen.getByRole('region', { name: 'movimientos de octubre' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(container.querySelectorAll('.pui-movements__amount')).toHaveLength(2);
    const css = readFileSync(resolve(__dirname, 'MovementsTable.css'), 'utf8');
    expect(css).toMatch(/\.pui-movements__amount\s*\{[^}]*text-align:\s*right/);
  });

  it('sin movimientos dice «sin movimientos» en una fila, no una tabla muda', () => {
    renderTable({ movements: [] });
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByRole('cell')).toHaveTextContent('sin movimientos');
  });

  it('un importe desconocido, negativo o cero se escribe por sus palabras y una fecha vacía dice «sin fecha»', () => {
    renderTable({
      movements: [
        { id: '1', date: '', description: 'a', amount: undefined },
        { id: '2', date: '2026-10-02', description: 'b', amount: NaN },
        { id: '3', date: '2026-10-02', description: 'c', amount: 0 },
      ],
    });
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('sin fecha');
    expect(within(table).getAllByText('sin dato')).toHaveLength(2);
    expect(table).not.toHaveTextContent(/NaN/);
    expect(table).not.toHaveTextContent(/abono|cargo/);
  });

  it('un id repetido no pierde ninguna fila ni avisa de claves duplicadas', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderTable({ movements: [movements[0], { ...movements[1], id: 'a' }] });
    expect(screen.getAllByRole('rowheader')).toHaveLength(2);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('formatDate se aplica, y si lanza se escribe la fecha tal cual', () => {
    const { unmount } = renderTable({ formatDate: (d) => `día ${d.slice(-2)}` });
    expect(screen.getByText('día 01')).toBeInTheDocument();
    unmount();
    renderTable({
      formatDate: () => {
        throw new Error('boom');
      },
    });
    expect(screen.getByText('2026-10-01')).toBeInTheDocument();
  });

  it('los rótulos se pueden traducir', () => {
    renderTable({ movements: [], labels: { empty: 'no movements', date: 'date' } });
    expect(screen.getByText('no movements')).toBeInTheDocument();
    expect(screen.getByText('date')).toBeInTheDocument();
  });

  it('reenvía la ref y deja pasar las props nativas', () => {
    const ref = createRef<HTMLDivElement>();
    renderTable({ ref, 'data-testid': 'mt' } as never);
    expect(ref.current).toBe(screen.getByTestId('mt'));
  });
});

describe('CSS de MovementsTable', () => {
  const code = readFileSync(resolve(__dirname, 'MovementsTable.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores, tamaños ni radios literales fuera de los pesos de 1 px y 2 px', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((s) => s !== '1px' && s !== '2px')).toEqual([]);
  });

  it('el foco es un anillo de 2 px de color-accent-ink', () => {
    expect(code).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--color-accent-ink\)/);
  });
});

describe('MovementsTable con orden y filtro', () => {
  const rows: Movement[] = [
    { id: '1', date: '2026-10-01', description: 'sueldo', amount: 1500 },
    { id: '2', date: '2026-10-03', description: 'Café', amount: -3 },
    { id: '3', date: '2026-10-07', description: 'arriendo', amount: -600.25 },
    { id: '4', date: '2026-10-09', description: 'pendiente', amount: undefined },
  ];
  const render2 = (props: Partial<React.ComponentProps<typeof MovementsTable>> = {}) =>
    render(<MovementsTable caption="movimientos de octubre" movements={rows} currency="USD" locale="en-US" {...props} />);
  const order = () => screen.getAllByRole('rowheader').map((h) => h.textContent);
  const status = () => screen.getByRole('status');

  it('sin sortable ni filterable el DOM es el de L-14: la raíz es la región y no hay botones, campo ni estado', () => {
    const { container } = render2();
    expect(container.firstElementChild).toBe(screen.getByRole('region', { name: 'movimientos de octubre' }));
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getAllByRole('columnheader').every((h) => !h.hasAttribute('aria-sort'))).toBe(true);
  });

  it('con filterable la ref y las props nativas siguen yendo a la región, no al envoltorio', () => {
    const ref = createRef<HTMLDivElement>();
    render2({ filterable: true, ref, 'data-testid': 'mt' } as never);
    expect(ref.current).toBe(screen.getByTestId('mt'));
    expect(ref.current).toBe(screen.getByRole('region', { name: 'movimientos de octubre' }));
  });

  describe('orden', () => {
    it('cada cabecera es un botón con el rótulo como nombre y aria-sort dice la verdad', async () => {
      const user = userEvent.setup();
      render2({ sortable: true });
      const sortOf = () => screen.getAllByRole('columnheader').map((h) => h.getAttribute('aria-sort'));
      expect(screen.getAllByRole('button').map((b) => b.getAttribute('aria-label') ?? b.textContent?.replace(/[↕↑↓]/g, ''))).toEqual(['fecha', 'concepto', 'importe']);
      expect(screen.getByRole('button', { name: 'importe' })).toBeInTheDocument();
      expect(sortOf()).toEqual(['none', 'none', 'none']);
      await user.click(screen.getByRole('button', { name: 'importe' }));
      expect(sortOf()).toEqual(['none', 'none', 'ascending']);
      expect(order()).toEqual(['arriendo', 'Café', 'sueldo', 'pendiente']);
      await user.click(screen.getByRole('button', { name: 'importe' }));
      expect(sortOf()).toEqual(['none', 'none', 'descending']);
      expect(order()).toEqual(['sueldo', 'Café', 'arriendo', 'pendiente']);
      await user.click(screen.getByRole('button', { name: 'importe' }));
      expect(sortOf()).toEqual(['none', 'none', 'none']);
      expect(order()).toEqual(['sueldo', 'Café', 'arriendo', 'pendiente']);
    });

    it('cambiar de columna deja a la anterior en none, y Enter y Espacio ordenan', async () => {
      const user = userEvent.setup();
      render2({ sortable: true });
      screen.getByRole('button', { name: 'importe' }).focus();
      await user.keyboard('{Enter}');
      await user.click(screen.getByRole('button', { name: 'concepto' }));
      expect(screen.getAllByRole('columnheader').map((h) => h.getAttribute('aria-sort'))).toEqual(['none', 'ascending', 'none']);
      screen.getByRole('button', { name: 'fecha' }).focus();
      await user.keyboard(' ');
      expect(screen.getAllByRole('columnheader').map((h) => h.getAttribute('aria-sort'))).toEqual(['ascending', 'none', 'none']);
    });

    it('defaultSort y onSortChange se respetan', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render2({ sortable: true, defaultSort: { column: 'amount', direction: 'descending' }, onSortChange });
      expect(order()).toEqual(['sueldo', 'Café', 'arriendo', 'pendiente']);
      expect(screen.getByRole('columnheader', { name: /importe/ })).toHaveAttribute('aria-sort', 'descending');
      await user.click(screen.getByRole('button', { name: 'importe' }));
      expect(onSortChange).toHaveBeenLastCalledWith(null);
      await user.click(screen.getByRole('button', { name: 'concepto' }));
      expect(onSortChange).toHaveBeenLastCalledWith({ column: 'description', direction: 'ascending' });
    });

    it('la región de estado existe desde el primer render, vacía, y dice el orden al momento', async () => {
      const user = userEvent.setup();
      render2({ sortable: true });
      expect(status()).toHaveTextContent('');
      await user.click(screen.getByRole('button', { name: 'importe' }));
      await user.click(screen.getByRole('button', { name: 'importe' }));
      expect(status()).toHaveTextContent('ordenado por importe, de mayor a menor');
      await user.click(screen.getByRole('button', { name: 'importe' }));
      expect(status()).toHaveTextContent('sin orden');
    });

    it('un importe desconocido queda al final en las dos direcciones y la tabla no pierde filas', async () => {
      const user = userEvent.setup();
      render2({ sortable: true });
      await user.click(screen.getByRole('button', { name: 'importe' }));
      expect(order().at(-1)).toBe('pendiente');
      await user.click(screen.getByRole('button', { name: 'importe' }));
      expect(order().at(-1)).toBe('pendiente');
      expect(order()).toHaveLength(4);
    });
  });

  describe('filtro', () => {
    afterEach(() => vi.useRealTimers());

    it('el campo tiene etiqueta visible y las filas se reducen a cada pulsación', async () => {
      const user = userEvent.setup();
      render2({ filterable: true });
      const input = screen.getByLabelText('filtrar');
      expect(input).toBe(screen.getByRole('searchbox'));
      await user.type(input, 'a');
      expect(order()).toEqual(['Café', 'arriendo']);
      await user.type(input, 'f');
      expect(order()).toEqual(['Café']);
      await user.clear(input);
      expect(order()).toHaveLength(4);
    });

    it('el conteo visible cambia al instante y el anuncio llega 500 ms después de la última tecla', () => {
      // userEvent espera con setTimeout real y se cuelga con temporizadores simulados: cada pulsación es un change.
      vi.useFakeTimers();
      render2({ filterable: true });
      const input = screen.getByLabelText('filtrar');
      expect(screen.getByText('4 de 4 movimientos')).toBeInTheDocument();
      expect(status()).toHaveTextContent('');
      for (const value of ['c', 'ca', 'caf']) {
        fireEvent.change(input, { target: { value } });
        act(() => {
          vi.advanceTimersByTime(300);
        });
      }
      expect(screen.getByText('1 de 4 movimientos')).toBeInTheDocument();
      // Pasaron 900 ms en total, pero ninguna pausa llegó a 500: no se anunció nada por pulsación.
      expect(status()).toHaveTextContent('');
      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(status()).toHaveTextContent('');
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(status()).toHaveTextContent('1 de 4 movimientos');
    });

    it('el conteo visible no está en la región viva: solo el anuncio retrasado lo está', () => {
      render2({ filterable: true });
      expect(screen.getByText('4 de 4 movimientos').closest('[role="status"]')).toBeNull();
    });

    it('cero resultados lo dice con el texto buscado, y con movements vacío sigue diciendo «sin movimientos»', async () => {
      const user = userEvent.setup();
      const { unmount } = render2({ filterable: true });
      await user.type(screen.getByLabelText('filtrar'), '  zzz ');
      expect(screen.getByRole('cell')).toHaveTextContent('ningún movimiento coincide con «zzz»');
      expect(screen.getAllByRole('row')).toHaveLength(2);
      unmount();
      render2({ filterable: true, movements: [] });
      expect(screen.getByRole('cell')).toHaveTextContent('sin movimientos');
    });

    it('filtro y orden se componen, y cambiar uno no borra el otro', async () => {
      const user = userEvent.setup();
      render2({ sortable: true, filterable: true });
      await user.click(screen.getByRole('button', { name: 'importe' }));
      await user.type(screen.getByLabelText('filtrar'), 'e');
      expect(order()).toEqual(['arriendo', 'Café', 'sueldo', 'pendiente']);
      await user.clear(screen.getByLabelText('filtrar'));
      expect(screen.getByRole('columnheader', { name: /importe/ })).toHaveAttribute('aria-sort', 'ascending');
    });

    it('los rótulos se pueden traducir', async () => {
      const user = userEvent.setup();
      render2({ filterable: true, labels: { filter: 'filter', noMatches: 'none for «{query}»', count: '{shown} of {total}' } });
      await user.type(screen.getByLabelText('filter'), 'zz');
      expect(screen.getByText('0 of 4')).toBeInTheDocument();
      expect(screen.getByRole('cell')).toHaveTextContent('none for «zz»');
    });
  });
});

describe('CSS de los controles de MovementsTable', () => {
  const code = readFileSync(resolve(__dirname, 'MovementsTable.controls.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores, tamaños ni radios literales fuera de 1 px, 2 px y los 40/44 px de área mínima', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((s) => !['1px', '2px', '40px', '44px'].includes(s))).toEqual([]);
  });

  it('el botón de orden mide 40 px, 44 con puntero grueso, y su foco es un anillo de 2 px de color-accent-ink', () => {
    expect(code).toMatch(/\.pui-movements__sort\s*\{[^}]*min-height:\s*40px/);
    expect(code).toMatch(/@media \(pointer: coarse\)\s*\{[^}]*\.pui-movements__sort\s*\{[^}]*min-height:\s*44px/);
    expect(code).toMatch(/\.pui-movements__sort:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--color-accent-ink\)/);
  });

  it('color-accent no se usa y no hay animation', () => {
    expect(code).not.toMatch(/--color-accent\)/);
    expect(code).not.toMatch(/animation/);
  });
});
