import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('se une a su etiqueta por id', () => {
    render(
      <>
        <label htmlFor="pp">número de páginas</label>
        <Input id="pp" type="number" defaultValue={64} />
      </>,
    );
    expect(screen.getByLabelText('número de páginas')).toHaveValue(64);
  });

  it('es type="text" por defecto y lleva la clase de cápsula', () => {
    render(<Input aria-label="Nombre" />);
    const input = screen.getByRole('textbox', { name: 'Nombre' });
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveClass('pui-input');
  });

  it('recibe lo que se escribe', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Nombre" />);
    await user.type(screen.getByRole('textbox'), 'Offset ahuesado');
    expect(screen.getByRole('textbox')).toHaveValue('Offset ahuesado');
  });

  it('reenvía la ref al <input>', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Nombre" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
