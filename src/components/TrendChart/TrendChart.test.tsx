import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { TrendChart, type TrendPoint } from './TrendChart';

const points: TrendPoint[] = [
  { label: 'ene', value: 100 },
  { label: 'feb', value: 250 },
  { label: 'mar', value: 175 },
];

const renderChart = (p: readonly TrendPoint[] = points, props: object = {}) =>
  render(<TrendChart title="saldo de la cuenta" points={p} currency="USD" locale="en-US" {...props} />);

describe('TrendChart', () => {
  it('es una imagen con nombre, con el rango escrito, y una línea con un vértice por punto', () => {
    const { container } = renderChart();
    const img = screen.getByRole('img', { name: /saldo de la cuenta\. mínimo \$100\.00 · máximo \$250\.00/ });
    expect(img.querySelectorAll('polyline')).toHaveLength(1);
    expect(img.querySelector('polyline')!.getAttribute('points')!.split(' ')).toHaveLength(3);
    expect(container.querySelector('.pui-trend__summary')).toHaveTextContent('mínimo $100.00 · máximo $250.00');
  });

  it('la tabla de valores está visible y lista todos los puntos con el mismo texto que el resumen', () => {
    const { container } = renderChart();
    const details = container.querySelector('details')!;
    expect(details).toHaveAttribute('open');
    const table = within(details).getByRole('table');
    expect(within(table).getAllByRole('rowheader').map((h) => h.textContent)).toEqual(['ene', 'feb', 'mar']);
    expect(table).toHaveTextContent('$250.00');
  });

  it('sin datos dice «sin datos para graficar» y no dibuja nada, ni con puntos sin valor', () => {
    for (const p of [[], [{ label: 'a', value: null }, { label: 'b', value: NaN }]]) {
      const { container, unmount } = renderChart(p);
      expect(container).toHaveTextContent('sin datos para graficar');
      expect(container.querySelector('svg')).toBeNull();
      expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
      unmount();
    }
  });

  it('un solo punto dibuja el punto y su valor escrito, sin línea', () => {
    const { container } = renderChart([{ label: 'ene', value: 90 }]);
    expect(container.querySelector('polyline')).toBeNull();
    expect(container.querySelector('.pui-trend__last')).not.toBeNull();
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', expect.stringContaining('ene: $90.00'));
    expect(container.innerHTML).not.toMatch(/NaN/);
  });

  it('un hueco corta la línea y el punto aislado se dibuja; la tabla conserva el hueco como «sin dato»', () => {
    const { container } = renderChart([
      { label: 'a', value: 1 },
      { label: 'b', value: 2 },
      { label: 'c', value: undefined },
      { label: 'd', value: 5 },
      { label: 'e', value: 6 },
      { label: 'f', value: Infinity },
      { label: 'g', value: 3 },
    ]);
    expect(container.querySelectorAll('polyline')).toHaveLength(2);
    expect(container.querySelectorAll('.pui-trend__dot')).toHaveLength(1);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(7);
    expect(within(container.querySelector('tbody') as HTMLElement).getAllByText('sin dato')).toHaveLength(2);
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  });

  it('una serie plana y una de negativos no producen NaN y las coordenadas quedan dentro del viewBox', () => {
    for (const p of [
      [{ label: 'a', value: 7 }, { label: 'b', value: 7 }],
      [{ label: 'a', value: -50 }, { label: 'b', value: -10 }],
    ]) {
      const { container, unmount } = renderChart(p);
      const coords = container.querySelector('polyline')!.getAttribute('points')!.split(/[ ,]/).map(Number);
      expect(coords.every((n) => Number.isFinite(n) && n >= 0 && n <= 320)).toBe(true);
      unmount();
    }
    const { container } = renderChart([{ label: 'a', value: -50 }, { label: 'b', value: -10 }]);
    expect(container.querySelector('.pui-trend__summary')).toHaveTextContent('−$50.00');
  });

  it('una moneda inválida no lanza', () => {
    expect(() => renderChart(points, { currency: 'XX' })).not.toThrow();
  });

  it('reenvía la ref y deja pasar las props nativas', () => {
    const ref = createRef<HTMLElement>();
    renderChart(points, { ref, 'data-testid': 'chart' });
    expect(ref.current).toBe(screen.getByTestId('chart'));
  });
});

describe('CSS de TrendChart', () => {
  const raw = readFileSync(resolve(__dirname, 'TrendChart.css'), 'utf8');
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores, tamaños ni radios literales fuera de 1 px, 2 px y los 40/44 px de área mínima', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((s) => !['1px', '2px', '40px', '44px'].includes(s))).toEqual([]);
  });

  it('color-accent solo rellena: nunca es color de texto ni de trazo', () => {
    const uses = code.match(/[a-z-]+:\s*var\(--color-accent\)/g) ?? [];
    expect(uses).toEqual(['fill: var(--color-accent)']);
  });
});
