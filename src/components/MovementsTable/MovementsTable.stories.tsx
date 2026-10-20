import type { Meta, StoryObj } from '@storybook/react';
import { MovementsTable } from './MovementsTable';

const meta = {
  title: 'Finanzas/MovementsTable',
  component: MovementsTable,
  args: { caption: 'movimientos de octubre', currency: 'USD', locale: 'en-US', movements: [] },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MovementsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    movements: [
      { id: '1', date: '2026-10-01', description: 'sueldo', amount: 1500 },
      { id: '2', date: '2026-10-03', description: 'arriendo', amount: -600.25 },
      { id: '3', date: '2026-10-07', description: 'supermercado', amount: -84.1 },
      { id: '4', date: '2026-10-12', description: 'reembolso', amount: 32 },
    ],
  },
};

export const Empty: Story = {};

export const UnknownAmount: Story = {
  args: {
    movements: [
      { id: '1', date: '2026-10-01', description: 'transferencia pendiente', amount: undefined },
      { id: '2', date: '2026-10-02', description: 'ajuste', amount: 0 },
      { id: '3', date: '', description: 'sin fecha registrada', amount: -5 },
    ],
  },
};
