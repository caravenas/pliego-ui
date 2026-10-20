import type { Meta, StoryObj } from '@storybook/react';
import { Amount } from './Amount';

const meta = {
  title: 'Finanzas/Amount',
  component: Amount,
  args: { currency: 'USD', locale: 'en-US', value: 1234.5 },
} satisfies Meta<typeof Amount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Negative: Story = { args: { value: -1234.5 } };

export const Unknown: Story = { args: { value: undefined } };

export const Flow: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Amount {...args} flow value={1500} />
      <Amount {...args} flow value={-600.25} />
      <Amount {...args} flow value={0} />
      <Amount {...args} flow value={null} />
    </div>
  ),
};

export const OtherLocale: Story = { args: { currency: 'CLP', locale: 'es-CL', value: 1250000 } };
