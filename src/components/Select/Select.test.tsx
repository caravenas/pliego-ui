import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';
import { Field } from '../Field/Field';

describe('Select', () => {
  it('es un <select> nativo con la clase de cápsula', () => {
    render(
      <Select aria-label="Papel">
        <option value="offset">offset</option>
      </Select>,
    );
    const select = screen.getByRole('combobox', { name: 'Papel' });
    expect(select.tagName).toBe('SELECT');
    expect(select).toHaveClass('pui-select');
  });

  it('reenvía la ref al <select>', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} aria-label="Papel" />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('deja pasar value, onChange, name y disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Select aria-label="Papel" name="paper" value="offset" onChange={onChange}>
        <option value="offset">offset</option>
        <option value="couche">couché</option>
      </Select>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('offset');
    expect(select).toHaveAttribute('name', 'paper');
    await user.selectOptions(select, 'couche');
    expect(onChange).toHaveBeenCalledTimes(1);

    rerender(
      <Select aria-label="Papel" disabled>
        <option>offset</option>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('se une a su etiqueta dentro de Field', () => {
    render(
      <Field label="papel" id="paper">
        <Select>
          <option>offset</option>
        </Select>
      </Field>,
    );
    expect(screen.getByLabelText('papel')).toHaveClass('pui-select');
  });
});

describe('CSS de Select y Field', () => {
  const read = (path: string) => readFileSync(resolve(__dirname, '..', path), 'utf8');
  const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');
  // El data-URI no puede leer variables: se revisa aparte, contra tokens.json.
  const stripUrls = (css: string) => css.replace(/url\([^)]*\)/g, 'url()');
  const sheets = { 'Field.css': read('Field/Field.css'), 'Select.css': read('Select/Select.css') };
  // Excepciones del sistema: cápsula, áreas mínimas de 40/44 px y los pesos de
  // 1 px (borde) y 2 px (anillo y filete) que ya usa Input.
  const allowedSizes = new Set(['9999px', '40px', '44px', '1px', '2px']);

  it.each(Object.entries(sheets))('%s no tiene colores, tamaños ni radios literales', (_name, css) => {
    const code = stripUrls(stripComments(css));
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    const sizes = code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? [];
    expect(sizes.filter((size) => !allowedSizes.has(size))).toEqual([]);
  });

  it('el triángulo usa el valor de color-text-muted de tokens.json', () => {
    const tokens = JSON.parse(readFileSync(resolve(__dirname, '../../../tokens/tokens.json'), 'utf8'));
    const muted = JSON.stringify(tokens).match(/"name":"color-text-muted","value":"(#[0-9a-fA-F]{6})"/)?.[1];
    expect(muted).toBeDefined();
    const fill = sheets['Select.css'].match(/url\([^)]*fill='%23([0-9a-fA-F]{6})'/)?.[1];
    expect(`#${fill}`.toLowerCase()).toBe(muted!.toLowerCase());
  });
});
