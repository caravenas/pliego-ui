import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MeasureField, MeasureGrid } from './MeasureField';

const meta = {
  title: 'Patrones/MeasureField',
  component: MeasureField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 372 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MeasureField>;

export default meta;
type Story = StoryObj<typeof meta>;

// El control es controlado: cada story lleva su estado.
function Measure(props: { label: string; id: string; initial: number; step?: number; dashed?: boolean; marginalia?: string | null }) {
  const [value, setValue] = useState<number | ''>(props.initial);
  return (
    <MeasureField
      label={props.label}
      id={props.id}
      value={value}
      unit="mm"
      step={props.step ?? 1}
      dashed={props.dashed}
      marginalia={props.marginalia}
      onChange={setValue}
    />
  );
}

const args = { label: 'ancho', id: 'w', value: 140, unit: 'mm', step: 1, onChange: () => {} };

export const Default: Story = {
  args,
  render: () => <Measure label="ancho" id="width" initial={140} marginalia="fijado por 2:3" />,
};

export const Bleed: Story = {
  args,
  render: () => <Measure label="sangrado" id="bleed" initial={3} step={0.5} dashed marginalia="de fábrica" />,
};

export const Grid: Story = {
  args,
  render: () => (
    <MeasureGrid>
      <Measure label="ancho" id="g-width" initial={140} />
      <Measure label="alto" id="g-height" initial={210} />
      <Measure label="lomo" id="g-spine" initial={12.5} step={0.5} marginalia="paso 16" />
    </MeasureGrid>
  ),
};
