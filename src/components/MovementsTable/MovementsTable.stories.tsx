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

const extract = [
  { id: '1', date: '2026-10-01', description: 'sueldo', amount: 1500 },
  { id: '2', date: '2026-10-03', description: 'Arriendo', amount: -600.25 },
  { id: '3', date: '2026-10-05', description: 'café', amount: -3.5 },
  { id: '4', date: '2026-10-07', description: 'supermercado', amount: -84.1 },
  { id: '5', date: '2026-10-09', description: 'transferencia pendiente', amount: undefined },
  { id: '6', date: '2026-10-12', description: 'reembolso', amount: 32 },
  { id: '7', date: '', description: 'ajuste sin fecha', amount: -5 },
];

export const Sortable: Story = { args: { movements: extract, sortable: true, defaultSort: { column: 'amount', direction: 'ascending' } } };

export const Filterable: Story = { args: { movements: extract, filterable: true } };

export const SortableAndFilterable: Story = { args: { movements: extract, sortable: true, filterable: true } };

export const NoMatches: Story = {
  args: { movements: extract, filterable: true },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    if (!input) return;
    // El filtro es controlado por React: se escribe con el setter nativo para que onChange se entere.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, 'zzz');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  },
};
