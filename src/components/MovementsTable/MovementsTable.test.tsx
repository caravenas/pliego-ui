import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { MovementsTable, type Movement } from './MovementsTable';

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
