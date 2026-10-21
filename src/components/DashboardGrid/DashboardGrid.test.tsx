import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { DashboardCell, DashboardGrid } from './DashboardGrid';

describe('DashboardGrid · estructura', () => {
  it('conserva el orden de los hijos en el DOM', () => {
    render(
      <DashboardGrid data-testid="grid">
        <DashboardCell>uno</DashboardCell>
        <DashboardCell wide>dos</DashboardCell>
        <DashboardCell>tres</DashboardCell>
      </DashboardGrid>,
    );
    expect(Array.from(screen.getByTestId('grid').children).map((c) => c.textContent)).toEqual(['uno', 'dos', 'tres']);
  });

  it('wide marca la celda que ocupa la fila entera y la otra no', () => {
    render(
      <DashboardGrid>
        <DashboardCell data-testid="a">a</DashboardCell>
        <DashboardCell wide data-testid="b">
          b
        </DashboardCell>
      </DashboardGrid>,
    );
    expect(screen.getByTestId('a')).not.toHaveClass('pui-dashboard-cell--wide');
    expect(screen.getByTestId('b')).toHaveClass('pui-dashboard-cell--wide');
  });

  it('no impone landmark, rol ni encabezado: eso es de la página', () => {
    const { container } = render(
      <DashboardGrid>
        <DashboardCell>x</DashboardCell>
      </DashboardGrid>,
    );
    expect(container.querySelector('[role], main, h1, h2, h3, section, nav')).toBeNull();
  });

  it('reenvía la ref y deja pasar las props nativas', () => {
    const ref = createRef<HTMLDivElement>();
    const cell = createRef<HTMLDivElement>();
    render(
      <DashboardGrid ref={ref} aria-hidden={undefined} data-x="1">
        <DashboardCell ref={cell} id="c" />
      </DashboardGrid>,
    );
    expect(ref.current).toHaveAttribute('data-x', '1');
    expect(cell.current).toHaveAttribute('id', 'c');
  });

  it('sin hijos no lanza', () => {
    render(<DashboardGrid data-testid="grid" />);
    expect(screen.getByTestId('grid')).toBeEmptyDOMElement();
  });
});

describe('CSS de DashboardGrid', () => {
  const raw = readFileSync(resolve(__dirname, 'DashboardGrid.css'), 'utf8');
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, '');

  it('el orden visual es el del DOM: ni order, ni dense, ni posiciones explícitas', () => {
    expect(code).not.toMatch(/\border\s*:/);
    expect(code).not.toMatch(/dense/);
    // La única posición permitida es la fila entera de `wide`.
    expect(code.replace(/grid-column:\s*1 \/ -1/, '')).not.toMatch(/grid-(row|area|template-areas|column)(?!s)/);
  });

  it('las columnas se reparten solas y no ensanchan la página', () => {
    expect(code).toMatch(/repeat\(auto-fit,\s*minmax\(min\(100%,\s*18rem\),\s*1fr\)\)/);
    expect(code).toMatch(/\.pui-dashboard-cell\s*\{[^}]*min-width:\s*0/);
    expect(code).toMatch(/\.pui-dashboard-cell--wide\s*\{[^}]*grid-column:\s*1 \/ -1/);
  });

  it('no tiene colores, tamaños ni radios literales fuera de 18rem comentado, ni animación', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((size) => size !== '18rem')).toEqual([]);
    expect(raw.match(/\/\*[\s\S]*?\*\//g)?.join('')).toContain('18rem');
    expect(code).not.toMatch(/animation|transition|color-accent[^-]/);
  });
});
