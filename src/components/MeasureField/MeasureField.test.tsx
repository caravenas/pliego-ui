import { createRef, useState } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MeasureField, MeasureGrid } from './MeasureField';

function Harness({
  initial = 10,
  step = 1,
  min,
  pixelsPerStep,
  dashed,
  marginalia,
  spy,
}: {
  initial?: number | '';
  step?: number;
  min?: number;
  pixelsPerStep?: number;
  dashed?: boolean;
  marginalia?: string | null;
  spy?: (value: number) => void;
}) {
  const [value, setValue] = useState<number | ''>(initial);
  return (
    <MeasureField
      label="ancho"
      id="width"
      value={value}
      unit="mm"
      step={step}
      min={min}
      pixelsPerStep={pixelsPerStep}
      dashed={dashed}
      marginalia={marginalia}
      onChange={(next) => {
        setValue(next);
        spy?.(next);
      }}
    />
  );
}

// jsdom no implementa la captura de puntero ni PointerEvent con coordenadas.
function pointer(target: Element, type: string, clientX: number) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX });
  Object.defineProperty(event, 'pointerId', { value: 7 });
  fireEvent(target, event);
}

describe('MeasureField', () => {
  const captured = new Set<number>();
  beforeEach(() => {
    captured.clear();
    HTMLElement.prototype.setPointerCapture = vi.fn((id: number) => void captured.add(id));
    HTMLElement.prototype.hasPointerCapture = vi.fn((id: number) => captured.has(id));
    HTMLElement.prototype.releasePointerCapture = vi.fn((id: number) => void captured.delete(id));
  });

  it('une etiqueta y cifra por id y es un input numérico con su paso y su mínimo', () => {
    render(<Harness step={0.5} min={2} />);
    const input = screen.getByLabelText('ancho');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('step', '0.5');
    expect(input).toHaveAttribute('min', '2');
    expect(input).toHaveValue(10);
  });

  it('escribir no redondea mientras se escribe', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness initial={1} step={0.5} spy={spy} />);
    const input = screen.getByLabelText('ancho');
    await user.clear(input);
    await user.type(input, '1.234');
    expect(spy).toHaveBeenLastCalledWith(1.234);
  });

  it('Mayús + flecha da diez pasos, redondeados a la rejilla del paso', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness initial={1} step={0.125} spy={spy} />);
    screen.getByLabelText('ancho').focus();
    await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
    expect(spy).toHaveBeenLastCalledWith(2.25);
    await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}');
    expect(spy).toHaveBeenLastCalledWith(0);
  });

  it('una flecha sola se deja al input nativo: no se intercepta', () => {
    render(<Harness />);
    const event = createEvent.keyDown(screen.getByLabelText('ancho'), { key: 'ArrowUp' });
    fireEvent(screen.getByLabelText('ancho'), event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('nunca baja de min, ni por flechas ni por arrastre', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness initial={3} min={1} spy={spy} />);
    screen.getByLabelText('ancho').focus();
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
    expect(spy).toHaveBeenLastCalledWith(1);
    const handle = screen.getByTitle('Arrastra para ajustar');
    pointer(handle, 'pointerdown', 100);
    pointer(handle, 'pointermove', -500);
    expect(spy).toHaveBeenLastCalledWith(1);
  });

  it('arrastrar la unidad cambia el valor por muescas y captura el puntero', () => {
    const spy = vi.fn();
    render(<Harness initial={10} step={1} pixelsPerStep={3} spy={spy} />);
    const handle = screen.getByTitle('Arrastra para ajustar');
    pointer(handle, 'pointerdown', 100);
    expect(handle.setPointerCapture).toHaveBeenCalledWith(7);
    pointer(handle, 'pointermove', 112);
    expect(spy).toHaveBeenLastCalledWith(14);
    pointer(handle, 'pointermove', 94);
    expect(spy).toHaveBeenLastCalledWith(8);
  });

  it('al soltar o cancelar, libera la captura y el arrastre termina', () => {
    const spy = vi.fn();
    render(<Harness initial={10} spy={spy} />);
    const handle = screen.getByTitle('Arrastra para ajustar');
    pointer(handle, 'pointerdown', 100);
    pointer(handle, 'pointerup', 100);
    expect(handle.releasePointerCapture).toHaveBeenCalledWith(7);
    spy.mockClear();
    pointer(handle, 'pointermove', 200);
    expect(spy).not.toHaveBeenCalled();
  });

  it('sin valor finito no arranca el arrastre ni las flechas con Mayús', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness initial="" spy={spy} />);
    const handle = screen.getByTitle('Arrastra para ajustar');
    pointer(handle, 'pointerdown', 100);
    pointer(handle, 'pointermove', 200);
    screen.getByLabelText('ancho').focus();
    await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
    expect(spy).not.toHaveBeenCalled();
  });

  it('dashed y la marginalia: clase, enlace con aria-describedby y sin nodo si es null', () => {
    const { container, rerender } = render(<Harness dashed marginalia="fijado por 2:3" />);
    expect(container.querySelector('.pui-measure__value')).toHaveClass('pui-measure__value--dashed');
    expect(screen.getByLabelText('ancho')).toHaveAttribute('aria-describedby', 'width-unit width-marginalia');
    expect(screen.getByText('fijado por 2:3')).toHaveAttribute('id', 'width-marginalia');
    rerender(<Harness marginalia={null} />);
    expect(container.querySelector('.pui-measure__marginalia')).toBeNull();
    expect(screen.getByLabelText('ancho')).toHaveAttribute('aria-describedby', 'width-unit');
  });

  it('reenvía la ref al input y MeasureGrid agrupa tres medidas', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <MeasureGrid>
        <MeasureField ref={ref} label="ancho" id="w" value={1} unit="mm" step={1} onChange={() => {}} />
        <MeasureField label="alto" id="h" value={2} unit="mm" step={1} onChange={() => {}} />
        <MeasureField label="lomo" id="s" value={3} unit="mm" step={1} onChange={() => {}} />
      </MeasureGrid>,
    );
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(container.querySelector('.pui-measure-grid')?.children).toHaveLength(3);
  });
});

describe('CSS de MeasureField', () => {
  const code = readFileSync(resolve(__dirname, 'MeasureField.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // Comentadas en el CSS: 40/44px de área mínima, 1px de filete, 2px de anillo
  // los 3px de separación del anillo de tinta de esta cota y 1.5em, la altura
  // de línea de la nota.
  const allowedSizes = new Set(['40px', '44px', '1px', '2px', '3px', '1.5em']);

  it('no tiene colores, tamaños ni radios literales', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    const sizes = code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? [];
    expect(sizes.filter((size) => !allowedSizes.has(size))).toEqual([]);
    expect(code).not.toMatch(/border-radius/);
  });

  it('el foco es un anillo de tinta, nunca de acento', () => {
    expect(code).toMatch(/:focus-visible\s*\{[^}]*color-text-primary/);
    expect(code).not.toMatch(/color-accent/);
  });
});
