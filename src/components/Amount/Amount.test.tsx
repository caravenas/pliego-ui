import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { Amount } from './Amount';

describe('Amount', () => {
  it('formatea con la moneda y el idioma, y sin idioma no lanza', () => {
    const { rerender } = render(<Amount value={1234.5} currency="USD" locale="en-US" />);
    expect(screen.getByText('$1,234.50')).toBeInTheDocument();
    rerender(<Amount value={1234.5} currency="CLP" locale="es-CL" />);
    expect(document.body).toHaveTextContent(/\$\s?1\.235|\$\s?1\.234/);
    expect(() => render(<Amount value={3} currency="EUR" />)).not.toThrow();
  });

  it('escribe «sin dato» para lo desconocido y nunca 0 ni NaN', () => {
    for (const value of [undefined, null, NaN, Infinity, '12' as unknown as number]) {
      const { container, unmount } = render(<Amount value={value} currency="USD" />);
      expect(container).toHaveTextContent(/^sin dato$/);
      expect(container.querySelector('.pui-amount--unknown')).not.toBeNull();
      unmount();
    }
  });

  it('un negativo lleva el signo en el texto, también sin flow', () => {
    const { container } = render(<Amount value={-12.5} currency="USD" locale="en-US" />);
    expect(container).toHaveTextContent('−$12.50');
    expect(container.querySelector('.pui-amount__word')).toBeNull();
  });

  it('con flow, un abono y un cargo llevan signo, palabra y color', () => {
    const { container } = render(
      <>
        <Amount flow value={40} currency="USD" locale="en-US" />
        <Amount flow value={-40} currency="USD" locale="en-US" />
        <Amount flow value={0} currency="USD" locale="en-US" />
      </>,
    );
    const [credit, debit, zero] = Array.from(container.querySelectorAll('.pui-amount'));
    expect(credit).toHaveTextContent('+$40.00 abono');
    expect(credit).toHaveClass('pui-amount--credit');
    expect(debit).toHaveTextContent('−$40.00 cargo');
    expect(debit).toHaveClass('pui-amount--debit');
    expect(zero).toHaveTextContent(/^\$0\.00$/);
    expect(zero.className).not.toMatch(/credit|debit/);
  });

  it('las palabras se pueden traducir', () => {
    const { container } = render(<Amount flow value={-1} currency="USD" locale="en-US" debitLabel="charge" />);
    expect(container).toHaveTextContent('charge');
  });

  it('reenvía la ref y deja pasar las props nativas', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Amount ref={ref} value={1} currency="USD" data-testid="amount" />);
    expect(ref.current).toBe(screen.getByTestId('amount'));
  });
});

describe('CSS de Amount', () => {
  const code = readFileSync(resolve(__dirname, 'Amount.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores ni tamaños literales', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect(code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).toEqual([]);
  });

  it('la cifra va en la clase de estilo mono de los datos', () => {
    const { container } = render(<Amount value={1} currency="USD" />);
    expect(container.firstElementChild).toHaveClass('pui-type-stat-value');
    const tokens = JSON.parse(readFileSync(resolve(__dirname, '../../../tokens/tokens.json'), 'utf8'));
    const group = tokens.type.groups.find((g: { styles: { name: string }[] }) => g.styles.some((st) => st.name === 'stat-value'));
    expect(group.family).toBe('mono');
  });

  it('usa tabular-nums, el color sale de los tokens de estado y nunca de color-accent', () => {
    expect(code).toMatch(/font-variant-numeric:\s*tabular-nums/);
    expect(code).toMatch(/--color-success-foreground/);
    expect(code).toMatch(/--color-danger-foreground/);
    expect(code).not.toMatch(/color-accent/);
  });
});

describe('contraste de los colores de estado', () => {
  const tokens = JSON.parse(readFileSync(resolve(__dirname, '../../../tokens/tokens.json'), 'utf8'));
  const colors: Record<string, string> = Object.fromEntries(
    tokens.color.tokens.map((t: { name: string; value: string }) => [t.name, t.value]),
  );
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  it.each(['color-success-foreground', 'color-danger-foreground'])('%s pasa 4,5:1 sobre el papel y sobre la página', (name) => {
    expect(ratio(colors[name], colors['color-bg-secondary'])).toBeGreaterThanOrEqual(4.5);
    expect(ratio(colors[name], colors['color-bg-primary'])).toBeGreaterThanOrEqual(4.5);
  });
});
