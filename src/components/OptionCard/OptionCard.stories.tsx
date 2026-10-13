import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OptionCard } from './OptionCard';
import { OptionField } from '../OptionField/OptionField';

const meta = {
  title: 'Patrones/OptionField',
  component: OptionField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 372 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OptionField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Las figuras son del consumidor: aquí, cajas que toman el color de la tarjeta.
const page = (w: number, h: number) => <span className="pui-option-shape" style={{ width: w, height: h }} />;

function Orientation(props: { marginalia?: string | null; error?: string | null; disabledLast?: boolean }) {
  const [value, setValue] = useState('portrait');
  return (
    <OptionField label="orientación" id="orientation" columns={3} {...props}>
      <OptionCard name="vertical" detail="más alto que ancho" figure={page(24, 32)} selected={value === 'portrait'} onSelect={() => setValue('portrait')} />
      <OptionCard name="apaisado" detail="más ancho que alto" figure={page(32, 24)} selected={value === 'landscape'} onSelect={() => setValue('landscape')} />
      <OptionCard
        name="cuadrado"
        figure={page(28, 28)}
        selected={value === 'square'}
        disabledReason={props.disabledLast ? 'no cabe en este pliego' : null}
        onSelect={() => setValue('square')}
      />
    </OptionField>
  );
}

export const Grid: Story = {
  args: { label: 'orientación', id: 'orientation', children: null },
  render: () => <Orientation marginalia="de fábrica" />,
};

export const WithDisabledReason: Story = {
  args: { label: 'orientación', id: 'orientation', children: null },
  render: () => <Orientation disabledLast />,
};

export const WithError: Story = {
  args: { label: 'orientación', id: 'orientation', children: null },
  render: () => <Orientation error="elige una orientación" />,
};

export const Scale: Story = {
  args: { label: 'gramaje', id: 'grammage', children: null },
  render: function ScaleStory() {
    const [value, setValue] = useState('90');
    return (
      <OptionField label="gramaje" id="grammage" layout="scale" columns={4} marginalia="en g/m²">
        {['70', '90', '120', '150'].map((g, i) => (
          <OptionCard
            key={g}
            name={g}
            variant="notch"
            figure={<span className="pui-option-mark" style={{ height: 4 + i * 4 }} />}
            selected={value === g}
            onSelect={() => setValue(g)}
          />
        ))}
      </OptionField>
    );
  },
};
