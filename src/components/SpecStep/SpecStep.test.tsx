import { createRef, useState } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpecStep } from './SpecStep';

const base = { number: 1, title: 'Formato', summary: '140 × 210 · 2:3' };

describe('SpecStep', () => {
  it('es un <details> con el número a dos dígitos, un título h2 y el resumen dentro del summary', () => {
    const { container } = render(<SpecStep {...base}>cuerpo</SpecStep>);
    const details = container.querySelector('details') as HTMLDetailsElement;
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Formato' })).toBeInTheDocument();
    expect(details.querySelector('summary')).toContainElement(screen.getByText('140 × 210 · 2:3'));
    expect(details.querySelector('.pui-spec-step__body')).toHaveTextContent('cuerpo');
  });

  it('sin defaultOpen empieza cerrado, con defaultOpen empieza abierto', () => {
    const { container, rerender } = render(<SpecStep {...base}>x</SpecStep>);
    expect(container.querySelector('details')).not.toHaveAttribute('open');
    rerender(
      <SpecStep {...base} key="b" defaultOpen>
        x
      </SpecStep>,
    );
    expect(container.querySelector('details')).toHaveAttribute('open');
  });

  it('no controlado: un clic en el summary alterna y avisa con onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <SpecStep {...base} onOpenChange={onOpenChange}>
        x
      </SpecStep>,
    );
    const summary = container.querySelector('summary') as HTMLElement;
    await user.click(summary);
    expect(container.querySelector('details')).toHaveAttribute('open');
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await user.click(summary);
    expect(container.querySelector('details')).not.toHaveAttribute('open');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('controlado: sigue a `open` y un clic solo pide el cambio', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container, rerender } = render(
      <SpecStep {...base} open onOpenChange={onOpenChange}>
        x
      </SpecStep>,
    );
    await user.click(container.querySelector('summary') as HTMLElement);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(container.querySelector('details')).toHaveAttribute('open');
    rerender(
      <SpecStep {...base} open={false} onOpenChange={onOpenChange}>
        x
      </SpecStep>,
    );
    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });

  it('el botón de opciones no está dentro del <summary> ni del <details>, que lo ocultaría cerrado', () => {
    const { container } = render(
      <SpecStep {...base} onOptions={() => {}}>
        x
      </SpecStep>,
    );
    const button = screen.getByRole('button', { name: 'Opciones de formato' });
    expect(container.querySelector('summary')).not.toContainElement(button);
    expect(container.querySelector('details')).not.toContainElement(button);
  });

  it('el botón de opciones llama a onOptions sin abrir ni cerrar el paso', async () => {
    const user = userEvent.setup();
    const onOptions = vi.fn();
    const onOpenChange = vi.fn();
    const { container } = render(
      <SpecStep {...base} onOptions={onOptions} onOpenChange={onOpenChange}>
        x
      </SpecStep>,
    );
    await user.click(screen.getByRole('button', { name: 'Opciones de formato' }));
    expect(onOptions).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });

  it('optionsLabel nombra el catálogo y sin onOptions no hay botón', () => {
    const { rerender } = render(
      <SpecStep {...base} onOptions={() => {}} optionsLabel="papel">
        x
      </SpecStep>,
    );
    expect(screen.getByRole('button', { name: 'Opciones de papel' })).toBeInTheDocument();
    rerender(<SpecStep {...base}>x</SpecStep>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('reenvía la ref al <details> y funciona dentro de un estado del consumidor', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDetailsElement>();
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <SpecStep {...base} ref={ref} open={open} onOpenChange={setOpen}>
          x
        </SpecStep>
      );
    }
    render(<Host />);
    expect(ref.current).toBeInstanceOf(HTMLDetailsElement);
    await user.click(screen.getByText('Formato'));
    expect(ref.current).toHaveAttribute('open');
  });
});

describe('CSS de SpecStep', () => {
  const css = readFileSync(resolve(__dirname, 'SpecStep.css'), 'utf8');
  const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // Comentadas en el CSS: 40/44px de área mínima, los pesos de 1px y 2px, y el
  // punto de cambio de maquetación del sistema (1024px).
  const allowedSizes = new Set(['40px', '44px', '1px', '2px', '1024px']);

  it('no tiene colores, tamaños ni radios literales', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    const sizes = code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? [];
    expect(sizes.filter((size) => !allowedSizes.has(size))).toEqual([]);
    expect(code).not.toMatch(/border-radius/);
  });

  it('oculta el valor con el paso abierto, sangra valor y cuerpo con space-7 y quita el triángulo de Safari', () => {
    expect(code).toMatch(/\.pui-spec-step__details\[open\] \.pui-spec-step__value\s*\{\s*display:\s*none/);
    expect(code).toMatch(/__value\s*\{[^}]*padding-left:\s*var\(--space-7\)/);
    expect(code).toMatch(/__body\s*\{[^}]*padding:[^;]*var\(--space-7\)/);
    expect(code).toMatch(/::-webkit-details-marker/);
  });
});
