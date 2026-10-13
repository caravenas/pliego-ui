import { render, screen } from '@testing-library/react';
import { OptionField } from './OptionField';
import { OptionCard } from '../OptionCard/OptionCard';

describe('OptionField', () => {
  it('se compone sobre Field con group: etiqueta <span> y grupo nombrado', () => {
    render(
      <OptionField label="orientación" id="orient">
        <OptionCard name="vertical" selected onSelect={() => {}} />
      </OptionField>,
    );
    const label = screen.getByText('orientación');
    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveAttribute('id', 'orient-label');
    expect(screen.getByRole('group', { name: 'orientación' })).toContainElement(
      screen.getByRole('button', { name: 'vertical' }),
    );
  });

  it('columns decide --option-columns y layout="scale" cambia la disposición', () => {
    const { container, rerender } = render(
      <OptionField label="formato" id="fmt" columns={2}>
        <OptionCard name="a5" selected={false} onSelect={() => {}} />
      </OptionField>,
    );
    const group = container.querySelector('.pui-option-group') as HTMLElement;
    expect(group.style.getPropertyValue('--option-columns')).toBe('2');
    expect(group).not.toHaveClass('pui-option-group--scale');
    rerender(
      <OptionField label="formato" id="fmt" layout="scale" fromCatalog>
        <OptionCard name="a5" selected={false} onSelect={() => {}} />
      </OptionField>,
    );
    const next = container.querySelector('.pui-option-group') as HTMLElement;
    expect(next).toHaveClass('pui-option-group--scale', 'pui-option-group--catalog');
    expect(next.style.getPropertyValue('--option-columns')).toBe('3');
  });

  it('el error y la nota van enlazados al grupo, y marginalia={null} no deja nodo', () => {
    const { container } = render(
      <OptionField label="papel" id="paper" marginalia={null} error="elige un papel" note="ficha">
        <OptionCard name="offset" selected={false} onSelect={() => {}} />
      </OptionField>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('elige un papel');
    expect(screen.getByRole('group')).toHaveAttribute('aria-describedby', 'paper-error paper-note');
    expect(container.querySelector('.pui-field__marginalia')).toBeNull();
  });
});

describe('CSS de OptionField', () => {
  it('no tiene colores ni tamaños literales', async () => {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const code = readFileSync(resolve(__dirname, 'OptionField.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((size) => size !== '1px')).toEqual([]);
  });
});
