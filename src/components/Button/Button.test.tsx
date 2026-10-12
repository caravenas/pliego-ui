import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('es type="button" por defecto, para no enviar un formulario sin querer', () => {
    render(<Button>Cancelar</Button>);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveAttribute('type', 'button');
  });

  it('respeta type="submit" cuando se pide', () => {
    render(<Button type="submit">Guardar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('aplica la variante y la forma como clases', () => {
    render(<Button variant="primary" shape="round" aria-label="Añadir">+</Button>);
    const button = screen.getByRole('button', { name: 'Añadir' });
    expect(button).toHaveClass('pui-button', 'pui-button--primary', 'pui-button--round');
  });

  it('es secundario y rectangular por defecto', () => {
    render(<Button>Cancelar</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('pui-button--secondary');
    expect(button).not.toHaveClass('pui-button--round');
  });

  it('llama a onClick y no lo hace deshabilitado', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Guardar</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<Button onClick={onClick} disabled>Guardar</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reenvía la ref al <button> y conserva la clase del consumidor', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} className="extra">Ok</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveClass('pui-button', 'extra');
  });
});
