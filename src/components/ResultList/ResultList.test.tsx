import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { ResultList, ResultRow } from './ResultList';

describe('ResultList', () => {
  it('es una <dl> de filas con un <dt> y un <dd> cada una', () => {
    const { container } = render(
      <ResultList>
        <ResultRow label="hojas de papel (interior)" unit="hojas">
          32
        </ResultRow>
        <ResultRow label="lomo">3,2</ResultRow>
      </ResultList>,
    );
    const list = container.firstElementChild as HTMLElement;
    expect(list.tagName).toBe('DL');
    expect(list.querySelectorAll(':scope > .pui-result-row')).toHaveLength(2);
    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual(['hojas de papel (interior)', 'lomo']);
    expect(screen.getAllByRole('definition')).toHaveLength(2);
  });

  it('la unidad es del <dd>, junto a la cifra, y sin unidad no queda nodo', () => {
    const { container } = render(
      <ResultList>
        <ResultRow label="peso" unit="g">
          18,5
        </ResultRow>
        <ResultRow label="pliegos">4</ResultRow>
      </ResultList>,
    );
    const [weight, sheets] = screen.getAllByRole('definition');
    expect(weight).toHaveTextContent('18,5 g');
    expect(weight.querySelector('.pui-result-row__unit')).toHaveTextContent('g');
    expect(sheets.querySelector('.pui-result-row__unit')).toBeNull();
    expect(container.querySelectorAll('.pui-result-row__unit')).toHaveLength(1);
  });

  it('reenvía la ref y deja pasar las props nativas', () => {
    const listRef = createRef<HTMLDListElement>();
    const rowRef = createRef<HTMLDivElement>();
    render(
      <ResultList ref={listRef} aria-label="resultados">
        <ResultRow ref={rowRef} label="lomo" data-testid="row">
          3
        </ResultRow>
      </ResultList>,
    );
    expect(listRef.current).toBeInstanceOf(HTMLDListElement);
    expect(listRef.current).toHaveAttribute('aria-label', 'resultados');
    expect(rowRef.current).toBe(screen.getByTestId('row'));
  });
});

describe('CSS de ResultList', () => {
  const code = readFileSync(resolve(__dirname, 'ResultList.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores, tamaños ni radios literales fuera del peso de 1px', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((size) => size !== '1px')).toEqual([]);
  });

  it('las cifras van con tabular-nums, sin saltar de línea, y las filas con punteado de color-border', () => {
    expect(code).toMatch(/font-variant-numeric:\s*tabular-nums/);
    expect(code).toMatch(/white-space:\s*nowrap/);
    expect(code).toMatch(/border-bottom:\s*1px dotted var\(--color-border\)/);
  });
});
