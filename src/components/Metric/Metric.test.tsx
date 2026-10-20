import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { Metric } from './Metric';

const change = (container: HTMLElement) => container.querySelector('.pui-metric__change')?.textContent ?? null;

describe('Metric', () => {
  it('es un grupo nombrado por su rótulo, con la cifra en Amount', () => {
    const { container } = render(<Metric label="saldo disponible" value={1240} previous={1000} currency="USD" locale="en-US" />);
    const group = screen.getByRole('group', { name: 'saldo disponible' });
    expect(group).toContainElement(container.querySelector('.pui-amount'));
    expect(group.querySelector('.pui-metric__value')).toHaveTextContent('$1,240.00');
  });

  it('escribe la variación con palabra, diferencia, porcentaje y comparación', () => {
    const { container, rerender } = render(
      <Metric label="saldo" value={1240} previous={1000} currency="USD" locale="en-US" comparison="frente a septiembre" />,
    );
    expect(change(container)).toBe('sube $240.00 (24.0%) frente a septiembre');
    rerender(<Metric label="saldo" value={750} previous={1000} currency="USD" locale="en-US" />);
    expect(change(container)).toBe('baja $250.00 (25.0%)');
  });

  it('sin anterior escribe «sin dato anterior», y sin cambio lo dice en palabras', () => {
    const { container, rerender } = render(<Metric label="saldo" value={100} currency="USD" />);
    expect(change(container)).toBe('sin dato anterior');
    rerender(<Metric label="saldo" value={100} previous={NaN} currency="USD" />);
    expect(change(container)).toBe('sin dato anterior');
    rerender(<Metric label="saldo" value={0.1 + 0.2} previous={0.3} currency="USD" comparison="frente a ayer" />);
    expect(change(container)).toBe('sin cambio frente a ayer');
  });

  it('con el anterior en 0 escribe la razón en vez del porcentaje, y un cambio mínimo dice «menos de»', () => {
    const { container, rerender } = render(<Metric label="ahorro" value={50} previous={0} currency="USD" locale="en-US" />);
    expect(change(container)).toBe('sube $50.00; sin porcentaje: el valor anterior es 0');
    rerender(<Metric label="ahorro" value={1_000_010} previous={1_000_000} currency="USD" locale="en-US" />);
    expect(change(container)).toBe('sube $10.00 (menos de 0.1%)');
  });

  it('con el valor desconocido la cifra dice «sin dato» y no hay variación', () => {
    const { container } = render(<Metric label="saldo" value={null} previous={100} currency="USD" />);
    expect(container.querySelector('.pui-metric__value')).toHaveTextContent('sin dato');
    expect(change(container)).toBeNull();
    expect(container).not.toHaveTextContent(/NaN|Infinity/);
  });

  it('las palabras se pueden traducir', () => {
    const { container } = render(
      <Metric label="balance" value={1} previous={2} currency="USD" locale="en-US" labels={{ down: 'down' }} />,
    );
    expect(change(container)).toBe('down $1.00 (50.0%)');
  });

  it('reenvía la ref y deja pasar las props nativas', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Metric ref={ref} label="saldo" value={1} currency="USD" data-testid="metric" />);
    expect(ref.current).toBe(screen.getByTestId('metric'));
  });
});

describe('CSS de Metric', () => {
  const code = readFileSync(resolve(__dirname, 'Metric.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores, tamaños ni radios literales fuera del peso de 1px, ni animación, opacidad o acento', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((size) => size !== '1px')).toEqual([]);
    expect(code).not.toMatch(/animation|opacity|color-accent/);
  });

  it('la cifra toma el estilo metric-value, mono, y conserva tabular-nums', () => {
    const { container } = render(<Metric label="saldo" value={1} currency="USD" />);
    expect(container.querySelector('.pui-metric__value')).toHaveClass('pui-type-metric-value');
    const tokens = JSON.parse(readFileSync(resolve(__dirname, '../../../tokens/tokens.json'), 'utf8'));
    const group = tokens.type.groups.find((g: { styles: { name: string }[] }) => g.styles.some((st) => st.name === 'metric-value'));
    expect(group.family).toBe('mono');
    // `font: inherit` reiniciaría font-variant-numeric; se heredan las propiedades sueltas.
    expect(code).not.toMatch(/\bfont:\s*inherit/);
    expect(code).toMatch(/font-size:\s*inherit/);
  });

  it('va sin caja: un filete superior de color-border y nada de fondo', () => {
    expect(code).toMatch(/border-top:[^;]*var\(--color-border\)/);
    expect(code).not.toMatch(/background/);
  });
});
