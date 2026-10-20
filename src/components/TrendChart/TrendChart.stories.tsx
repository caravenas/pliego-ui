import type { Meta, StoryObj } from '@storybook/react';
import { TrendChart } from './TrendChart';

const meta = {
  title: 'Finanzas/TrendChart',
  component: TrendChart,
  args: { title: 'saldo de la cuenta', currency: 'USD', locale: 'en-US', points: [] },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TrendChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    points: [
      { label: 'may', value: 820 },
      { label: 'jun', value: 1100 },
      { label: 'jul', value: 960 },
      { label: 'ago', value: 1340 },
      { label: 'sep', value: 1210 },
      { label: 'oct', value: 1480 },
    ],
  },
};

export const Empty: Story = {};

export const SinglePoint: Story = { args: { points: [{ label: 'oct', value: 1480 }] } };

export const WithGaps: Story = {
  args: {
    points: [
      { label: 'may', value: 820 },
      { label: 'jun', value: 1100 },
      { label: 'jul', value: undefined },
      { label: 'ago', value: 1340 },
      { label: 'sep', value: 1210 },
    ],
  },
};

export const Negative: Story = {
  args: {
    points: [
      { label: 'ene', value: 200 },
      { label: 'feb', value: -150 },
      { label: 'mar', value: -420 },
      { label: 'abr', value: 60 },
    ],
  },
};
