import type { Meta, StoryObj } from '@storybook/react';
import { Metric } from './Metric';

const meta = {
  title: 'Finanzas/Metric',
  component: Metric,
  args: { label: 'saldo disponible', currency: 'USD', locale: 'en-US', value: 1240, previous: 1000, comparison: 'frente a septiembre' },
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Down: Story = { args: { value: 750 } };

export const Flat: Story = { args: { value: 1000 } };

export const NoPrevious: Story = { args: { previous: undefined, comparison: undefined } };

export const ZeroBase: Story = { args: { label: 'ahorro del mes', value: 50, previous: 0 } };

export const NegativeBase: Story = { args: { label: 'saldo de la tarjeta', value: -100, previous: -200 } };

export const TinyChange: Story = { args: { value: 1_000_010, previous: 1_000_000 } };

export const Unknown: Story = { args: { value: null } };

export const Row: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: 24 }}>
      <Metric {...args} />
      <Metric {...args} label="gasto del mes" value={830.4} previous={910} />
      <Metric {...args} label="ingresos del mes" currency="CLP" locale="es-CL" value={1_250_000} previous={1_250_000} />
    </div>
  ),
};
