import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Input } from '../Input/Input';

describe('Field', () => {
  it('une etiqueta y control por id', () => {
    render(
      <Field label="número de páginas" id="pp">
        <Input type="number" />
      </Field>,
    );
    const input = screen.getByLabelText('número de páginas');
    expect(input).toHaveAttribute('id', 'pp');
  });

  it('con group, la etiqueta es un <span> y el grupo la referencia', () => {
    render(
      <Field label="papel" id="paper" group>
        <button type="button">offset</button>
      </Field>,
    );
    const label = screen.getByText('papel');
    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveAttribute('id', 'paper-label');
    expect(screen.getByRole('group', { name: 'papel' })).toHaveAttribute('aria-labelledby', 'paper-label');
  });

  it('pinta el error con role="alert" y el control lo nombra junto a la nota', () => {
    render(
      <Field label="calibre" id="cal" error="debe ser mayor que 0" note="ficha técnica">
        <Input />
      </Field>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('debe ser mayor que 0');
    expect(alert).toHaveAttribute('id', 'cal-error');
    const input = screen.getByLabelText('calibre');
    expect(input).toHaveAttribute('aria-describedby', 'cal-error cal-note');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('ficha técnica')).toHaveAttribute('id', 'cal-note');
  });

  it('sin error ni nota el control no lleva aria-describedby ni aria-invalid', () => {
    render(
      <Field label="calibre" id="cal">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText('calibre');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('solo la nota: aria-describedby apunta a ella', () => {
    render(
      <Field label="calibre" id="cal" note="origen">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText('calibre')).toHaveAttribute('aria-describedby', 'cal-note');
  });

  it('con marginalia={null} no queda ningún nodo; con texto, sí', () => {
    const { container, rerender } = render(
      <Field label="calibre" id="cal" marginalia={null}>
        <Input />
      </Field>,
    );
    expect(container.querySelector('.pui-field__marginalia')).toBeNull();
    rerender(
      <Field label="calibre" id="cal" marginalia="µm">
        <Input />
      </Field>,
    );
    expect(screen.getByText('µm')).toBeInTheDocument();
  });

  it('el nombre accesible es el texto en minúsculas: las versalitas son de CSS', () => {
    render(
      <Field label="número de páginas" id="pp">
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'número de páginas' })).toBeInTheDocument();
  });

  it('si children no es un único elemento, no inyecta nada', () => {
    render(
      <Field label="calibre" id="cal" error="mal">
        texto suelto
      </Field>,
    );
    expect(screen.getByText('texto suelto')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'cal-error');
  });
});
