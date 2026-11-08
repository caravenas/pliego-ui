import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { BarChart, type BarSeries } from './BarChart';

const categories = ['jul', 'ago', 'sep'];
const two: BarSeries[] = [
  { name: 'ingresos', values: [1500, 1500, 1600] },
  { name: 'gastos', values: [900, 1100, 700] },
];

const renderChart = (props: Partial<React.ComponentProps<typeof BarChart>> = {}) =>
  render(<BarChart title="flujo mensual" categories={categories} series={two} currency="USD" locale="en-US" {...props} />);

const svg = (container: HTMLElement) => container.querySelector('svg[role="img"]') as SVGSVGElement | null;
const bars = (container: HTMLElement) => Array.from(container.querySelectorAll('rect.pui-bars__bar'));
const table = () => screen.getByRole('table');

describe('BarChart · datos', () => {
  it('sin series, sin categorías o con una serie sin valores dice «sin datos para graficar» y no dibuja', () => {
    for (const props of [{ series: [] }, { categories: [] }, { series: [{ name: 'a', values: [] }] }, { series: [{ name: 'a', values: [null, undefined, NaN] }] }]) {
      const { container, unmount } = renderChart(props);
      expect(screen.getByText('sin datos para graficar')).toBeInTheDocument();
      expect(svg(container)).toBeNull();
      unmount();
    }
  });

  it('un solo punto dibuja una barra por serie y su valor escrito', () => {
    const { container } = renderChart({ categories: ['oct'], series: [{ name: 'a', values: [10] }, { name: 'b', values: [20] }] });
    expect(bars(container)).toHaveLength(2);
    expect(table()).toHaveTextContent('$10.00');
    expect(table()).toHaveTextContent('$20.00');
  });

  it('una serie más corta deja «sin dato» y los valores que sobran no se dibujan ni entran en la tabla', () => {
    const { container } = renderChart({
      series: [
        { name: 'corta', values: [5] },
        { name: 'larga', values: [1, 2, 3, 999] },
      ],
    });
    expect(within(table()).getAllByRole('row')).toHaveLength(4);
    expect(within(table()).getAllByText('sin dato')).toHaveLength(2);
    expect(table()).not.toHaveTextContent('999');
    expect(bars(container)).toHaveLength(4);
  });

  it('un negativo y un cero entre positivos parten de la base en 0, y el cero deja una marca', () => {
    const { container } = renderChart({ categories: ['a', 'b', 'c'], series: [{ name: 's', values: [100, 0, -50] }] });
    const rects = bars(container);
    expect(rects).toHaveLength(2);
    const zeroY = Number(container.querySelector('line.pui-bars__baseline')!.getAttribute('y1'));
    const [pos, neg] = rects.map((r) => ({ y: Number(r.getAttribute('y')), h: Number(r.getAttribute('height')) }));
    expect(pos.y + pos.h).toBeCloseTo(zeroY);
    expect(neg.y).toBeCloseTo(zeroY);
    expect(container.querySelectorAll('line.pui-bars__zero')).toHaveLength(1);
    expect(table()).toHaveTextContent('−$50.00');
  });

  it('null, NaN e Infinity no dibujan barra y la tabla dice «sin dato»', () => {
    const { container } = renderChart({ categories: ['a', 'b', 'c', 'd'], series: [{ name: 's', values: [5, null, NaN, Infinity] }] });
    expect(bars(container)).toHaveLength(1);
    expect(within(table()).getAllByText('sin dato')).toHaveLength(3);
    expect(container.innerHTML).not.toMatch(/NaN|Infinity|undefined/);
  });

  it('con todo en 0 la escala no divide por cero', () => {
    const { container } = renderChart({ categories: ['a', 'b'], series: [{ name: 's', values: [0, 0] }] });
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
    expect(container.querySelectorAll('line.pui-bars__zero')).toHaveLength(2);
  });

  it('todas las coordenadas quedan dentro del viewBox y sin NaN con extremos enormes', () => {
    const { container } = renderChart({ series: [{ name: 's', values: [1e300, -1e300, 5] }] });
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
    for (const r of bars(container)) {
      const y = Number(r.getAttribute('y'));
      const h = Number(r.getAttribute('height'));
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y + h).toBeLessThanOrEqual(120);
    }
  });

  it('valores en los límites del número no desbordan la escala', () => {
    const { container } = renderChart({ series: [{ name: 's', values: [Number.MAX_VALUE, -Number.MAX_VALUE, 1] }] });
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
    for (const r of bars(container)) expect(Number(r.getAttribute('height'))).toBeLessThanOrEqual(120);
  });

  it('dos series con el mismo nombre se conservan y se desambiguan', () => {
    renderChart({ series: [{ name: 'a', values: [1, 2, 3] }, { name: 'a', values: [4, 5, 6] }, { name: 'a (2)', values: [7, 8, 9] }] });
    const heads = within(table()).getAllByRole('columnheader').map((h) => h.textContent);
    expect(heads).toEqual(['categoría', 'a', 'a (2)', 'a (2) (2)']);
  });

  it('una serie sin nombre se escribe «sin nombre»', () => {
    renderChart({ series: [{ name: '  ', values: [1, 2, 3] }, { name: 'b', values: [1, 2, 3] }] });
    expect(within(table()).getAllByRole('columnheader').map((h) => h.textContent)).toContain('sin nombre');
  });

  it('más de cuatro series dibuja cuatro, lo avisa y la tabla conserva todas', () => {
    const many = Array.from({ length: 6 }, (_, i) => ({ name: `s${i + 1}`, values: [i + 1, i + 1, i + 1] }));
    const { container } = renderChart({ series: many });
    expect(bars(container)).toHaveLength(12);
    expect(screen.getByText('se muestran 4 de 6 series; las demás están en la tabla')).toBeInTheDocument();
    expect(within(table()).getAllByRole('columnheader')).toHaveLength(7);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
});

describe('BarChart · accesibilidad y leyenda', () => {
  it('es una imagen con nombre que incluye el título, las series y el rango', () => {
    const { container } = renderChart();
    const label = svg(container)!.getAttribute('aria-label')!;
    expect(label).toContain('flujo mensual');
    expect(label).toContain('ingresos');
    expect(label).toContain('gastos');
    expect(label).toContain('mínimo $700.00');
    expect(label).toContain('máximo $1,600.00');
  });

  it('la leyenda solo aparece con dos o más series y lleva cada nombre en texto', () => {
    const { unmount } = renderChart();
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['ingresos', 'gastos']);
    unmount();
    renderChart({ series: [two[0]] });
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('la muestra de cada serie y todas sus barras usan el mismo patrón, y dos series nunca lo comparten', () => {
    const { container } = renderChart();
    const swatches = Array.from(container.querySelectorAll('.pui-bars__swatch rect')).map((r) => r.getAttribute('fill'));
    expect(new Set(swatches).size).toBe(2);
    const all = bars(container).map((r) => r.getAttribute('fill'));
    expect(all).toEqual([swatches[0], swatches[1], swatches[0], swatches[1], swatches[0], swatches[1]]);
    for (const fill of swatches) {
      const id = fill!.slice(5, -1);
      expect(container.querySelector(`pattern[id="${id}"]`)).not.toBeNull();
    }
  });

  it('cuatro series tienen cuatro patrones distintos y los ids no chocan entre dos gráficas', () => {
    const four = Array.from({ length: 4 }, (_, i) => ({ name: `s${i}`, values: [1, 2, 3] }));
    const a = renderChart({ series: four });
    const b = renderChart({ series: four });
    const ids = (c: HTMLElement) => Array.from(c.querySelectorAll('pattern')).map((p) => p.id);
    expect(new Set(ids(a.container)).size).toBe(4);
    expect(ids(a.container).some((id) => ids(b.container).includes(id))).toBe(false);
    expect(ids(a.container).every((id) => /^[A-Za-z0-9_-]+$/.test(id))).toBe(true);
  });

  it('dentro de cada grupo las barras van en el orden de la leyenda', () => {
    const { container } = renderChart();
    const xs = bars(container).map((r) => Number(r.getAttribute('x')));
    expect(xs[0]).toBeLessThan(xs[1]);
    expect(xs[2]).toBeGreaterThan(xs[1]);
  });

  it('la tabla visible está en un <details> abierto y lista cada categoría con todas las series', () => {
    const { container } = renderChart();
    expect(container.querySelector('details')).toHaveAttribute('open');
    const rows = within(table()).getAllByRole('row');
    expect(rows).toHaveLength(4);
    expect(rows[1]).toHaveTextContent('jul');
    expect(rows[1]).toHaveTextContent('$1,500.00');
    expect(rows[1]).toHaveTextContent('$900.00');
    expect(within(table()).getAllByRole('columnheader').every((h) => h.getAttribute('scope') === 'col')).toBe(true);
  });

  it('la tabla se desplaza dentro de una región con nombre que el teclado alcanza', () => {
    renderChart();
    const region = screen.getByRole('region', { name: 'flujo mensual. valores' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toContainElement(table());
  });

  it('las etiquetas del eje están ocultas a los lectores porque la tabla ya las tiene', () => {
    const { container } = renderChart();
    const axis = container.querySelector('.pui-bars__axis')!;
    expect(axis).toHaveAttribute('aria-hidden', 'true');
    expect(axis.textContent).toBe('julagosep');
  });

  it('reenvía la ref y deja pasar las props nativas', () => {
    const ref = createRef<HTMLElement>();
    renderChart({ ref, 'data-testid': 'bc' } as never);
    expect(ref.current).toBe(screen.getByTestId('bc'));
  });

  it('una moneda inválida no lanza', () => {
    expect(() => renderChart({ currency: 'XX' })).not.toThrow();
  });
});

describe('CSS de BarChart', () => {
  const code = readFileSync(resolve(__dirname, 'BarChart.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores, tamaños ni radios literales fuera de 1 px, 2 px y los 40/44 px de área mínima', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((s) => !['1px', '2px', '40px', '44px'].includes(s))).toEqual([]);
  });

  it('color-accent no es color de texto ni de trazo, y no hay animation', () => {
    expect(code.match(/[a-z-]+:\s*var\(--color-accent\)/g) ?? []).toEqual([]);
    expect(code).not.toMatch(/animation/);
  });
});
