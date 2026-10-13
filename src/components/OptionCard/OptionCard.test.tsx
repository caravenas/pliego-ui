import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionCard } from './OptionCard';

describe('OptionCard', () => {
  it('es un botón con aria-pressed que llama a onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<OptionCard name="vertical" selected={false} onSelect={onSelect} />);
    const card = screen.getByRole('button', { name: 'vertical' });
    expect(card).toHaveAttribute('type', 'button');
    expect(card).toHaveAttribute('aria-pressed', 'false');
    await user.click(card);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('la elegida lo dice con aria-pressed y con su clase', () => {
    render(<OptionCard name="vertical" selected onSelect={() => {}} />);
    const card = screen.getByRole('button', { name: 'vertical' });
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(card).toHaveClass('pui-option-card--selected');
  });

  it('disabledReason deshabilita la tarjeta y escribe la razón en ella', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<OptionCard name="couché" selected={false} disabledReason="no admite este grosor" onSelect={onSelect} />);
    const card = screen.getByRole('button', { name: /couché/ });
    expect(card).toBeDisabled();
    expect(card).toHaveTextContent('no admite este grosor');
    await user.click(card);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('el dibujo va con aria-hidden y no entra en el nombre accesible', () => {
    render(<OptionCard name="vertical" selected={false} onSelect={() => {}} figure={<svg data-testid="fig" />} />);
    expect(screen.getByTestId('fig').closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'vertical' })).toBeInTheDocument();
  });

  it('ariaLabel sustituye al nombre anunciado, y detail se escribe en la tarjeta', () => {
    render(<OptionCard name="A5" detail="148 × 210" ariaLabel="formato A5" selected={false} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: 'formato A5' })).toHaveTextContent('148 × 210');
  });

  it('aplica las variantes y deja pasar las props nativas y la ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <OptionCard ref={ref} name="80" selected={false} variant="notch" row id="g80" title="80 g" onSelect={() => {}} />,
    );
    const card = screen.getByRole('button', { name: '80' });
    expect(ref.current).toBe(card);
    expect(card).toHaveClass('pui-option-card--notch', 'pui-option-card--row');
    expect(card).toHaveAttribute('id', 'g80');
    expect(card).toHaveAttribute('title', '80 g');
  });
});

describe('CSS de OptionCard', () => {
  const css = readFileSync(resolve(__dirname, 'OptionCard.css'), 'utf8');
  const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // Excepciones comentadas en el CSS: la caja del dibujo (34px), el paso fino
  // del texto (2px), los pesos de 1px y 2px, y el área de 44px.
  const allowedSizes = new Set(['34px', '2px', '1px', '44px']);

  it('no tiene colores, tamaños ni radios literales', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    const sizes = code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? [];
    expect(sizes.filter((size) => !allowedSizes.has(size))).toEqual([]);
    expect(code).not.toMatch(/border-radius:\s*[1-9]/);
  });

  it('el realce de puntero nunca se aplica a la elegida', () => {
    expect(code).toMatch(/:hover:not\(:disabled\):not\(\.pui-option-card--selected\)/);
  });
});
