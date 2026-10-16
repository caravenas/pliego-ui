import { createRef, useState } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl, type SegmentedOption } from './SegmentedControl';

const options: SegmentedOption<string>[] = [
  { value: 'a', label: 'uno' },
  { value: 'b', label: 'dos' },
  { value: 'c', label: 'tres' },
];

function Harness({
  kind = 'tabs',
  items = options,
  initial = 'a',
  onChange,
}: {
  kind?: 'tabs' | 'options';
  items?: SegmentedOption<string>[];
  initial?: string;
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <SegmentedControl
      kind={kind}
      label="Vista"
      value={value}
      options={items}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe('SegmentedControl · tabs', () => {
  it('pinta un tablist con un tab por opción y un solo punto de tabulación', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist', { name: 'Vista' })).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    expect(tabs.map((tab) => tab.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('las flechas mueven la selección y el foco, con vuelta en los extremos', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'uno' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'dos' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'dos' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'uno' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'tres' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'tres' })).toHaveAttribute('aria-selected', 'true');
  });

  it('Inicio y Fin van al primero y al último', async () => {
    const user = userEvent.setup();
    render(<Harness initial="b" />);
    await user.tab();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'tres' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'uno' })).toHaveFocus();
  });

  it('salta los segmentos deshabilitados, también en Inicio y Fin', async () => {
    const user = userEvent.setup();
    const items = [
      { value: 'a', label: 'uno', disabled: true },
      { value: 'b', label: 'dos' },
      { value: 'c', label: 'tres', disabled: true },
      { value: 'd', label: 'cuatro' },
    ];
    render(<Harness items={items} initial="b" />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'cuatro' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'dos' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'dos' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'cuatro' })).toHaveFocus();
  });

  it('no llama a onChange si la tecla no mueve la selección', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness items={[options[0]]} onChange={onChange} />);
    await user.tab();
    await user.keyboard('{ArrowRight}{Home}{End}a');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('da ids estables a los segmentos con id', () => {
    render(
      <SegmentedControl kind="tabs" label="Vista" value="a" options={options} onChange={() => {}} id="view" />,
    );
    expect(screen.getByRole('tab', { name: 'dos' })).toHaveAttribute('id', 'view-b');
  });

  it('reenvía la ref al contenedor', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SegmentedControl ref={ref} kind="tabs" label="Vista" value="a" options={options} onChange={() => {}} />);
    expect(ref.current).toHaveAttribute('role', 'tablist');
  });
});

describe('SegmentedControl · options', () => {
  it('pinta un radiogroup con radio y aria-checked, y el mismo tabindex móvil', () => {
    render(<Harness kind="options" />);
    expect(screen.getByRole('radiogroup', { name: 'Vista' })).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
    expect(radios.map((radio) => radio.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('las flechas y Fin eligen, y un clic o Espacio llaman a onChange con el valor', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness kind="options" onChange={onChange} />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('b');
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith('c');
    await user.click(screen.getByRole('radio', { name: 'uno' }));
    expect(onChange).toHaveBeenLastCalledWith('a');
    screen.getByRole('radio', { name: 'dos' }).focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith('b');
  });
});

describe('SegmentedControl · flechas verticales', () => {
  it('options responde a arriba y abajo, como un radiogroup nativo, con vuelta', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness kind="options" onChange={onChange} />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('b');
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('c');
  });

  it('tabs no responde a arriba y abajo: un tablist horizontal solo usa izquierda y derecha', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness kind="tabs" onChange={onChange} />);
    await user.tab();
    await user.keyboard('{ArrowDown}{ArrowUp}');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('SegmentedControl · deshabilitados', () => {
  it('un segmento deshabilitado no llama a onChange al hacer clic', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness items={[options[0], { ...options[1], disabled: true }]} onChange={onChange} />);
    await user.click(screen.getByRole('tab', { name: 'dos' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('si el valor no coincide con ninguna opción, el primer segmento habilitado es el punto de tabulación', () => {
    render(
      <SegmentedControl
        kind="tabs"
        label="Vista"
        value="zzz"
        options={[{ ...options[0], disabled: true }, options[1], options[2]]}
        onChange={() => {}}
      />,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((tab) => tab.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
  });
});

describe('CSS de SegmentedControl', () => {
  const css = readFileSync(resolve(__dirname, 'SegmentedControl.css'), 'utf8');
  const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // Excepciones del sistema: áreas mínimas de 40/44 px y los pesos de 1 px
  // (borde y costura) y 2 px (anillo) que ya usa Input.
  const allowedSizes = new Set(['40px', '44px', '1px', '2px']);

  it('no tiene colores, tamaños ni radios literales', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    const sizes = code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? [];
    expect(sizes.filter((size) => !allowedSizes.has(size))).toEqual([]);
    expect(code).not.toMatch(/border-radius/);
  });

  it('la última costura la dibuja el grupo: el último segmento no tiene borde derecho', () => {
    expect(code).toMatch(/\.pui-segmented__segment:last-child\s*\{\s*border-right:\s*0;/);
  });

  it('el realce de puntero excluye al segmento elegido', () => {
    expect(code).toMatch(/:hover:not\(\.pui-segmented__segment--selected\)/);
  });
});
