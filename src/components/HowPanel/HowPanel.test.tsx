import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { HowPanel } from './HowPanel';

describe('HowPanel', () => {
  it('es una región con el título por defecto «Cómo se calcula» y un h3', () => {
    render(<HowPanel formulas={['Hojas = ⌈64 ÷ 2⌉ = 32']} />);
    expect(screen.getByRole('region', { name: 'Cómo se calcula' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Cómo se calcula' })).toBeInTheDocument();
  });

  it('el título se puede cambiar y nombra la región', () => {
    render(<HowPanel title="De dónde sale" formulas={['a']} />);
    expect(screen.getByRole('region', { name: 'De dónde sale' })).toBeInTheDocument();
  });

  it('pinta cada fórmula en su línea, el texto de children y la nota', () => {
    const { container } = render(
      <HowPanel formulas={['uno', 'dos', 'tres']} note="valores preliminares">
        <p>explicación larga</p>
      </HowPanel>,
    );
    const formula = container.querySelector('.pui-how-panel__formula') as HTMLElement;
    expect(formula.childNodes).toHaveLength(5);
    expect(formula.querySelectorAll('br')).toHaveLength(2);
    expect(formula).toHaveTextContent('unodostres');
    expect(screen.getByText('explicación larga')).toBeInTheDocument();
    expect(screen.getByText('valores preliminares')).toBeInTheDocument();
  });

  it('sin fórmulas ni texto no pinta nada, ni siquiera la nota', () => {
    const { container } = render(<HowPanel formulas={[]} note="valores preliminares" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('solo con texto sí se pinta, y no hay párrafo de fórmulas', () => {
    const { container } = render(
      <HowPanel formulas={[]}>
        <p>solo texto</p>
      </HowPanel>,
    );
    expect(container.querySelector('.pui-how-panel__formula')).toBeNull();
    expect(screen.getByText('solo texto')).toBeInTheDocument();
  });

  it('reenvía la ref y deja pasar las props nativas', () => {
    const ref = createRef<HTMLElement>();
    render(<HowPanel ref={ref} formulas={['a']} id="how" />);
    expect(ref.current).toHaveAttribute('id', 'how');
  });
});

describe('CSS de HowPanel', () => {
  const code = readFileSync(resolve(__dirname, 'HowPanel.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores, tamaños ni radios literales fuera del peso de 1px', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((size) => size !== '1px')).toEqual([]);
  });
});
