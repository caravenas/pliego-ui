import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta = {
  title: 'Finanzas/BarChart',
  component: BarChart,
  args: { title: 'ingresos y gastos por mes', currency: 'USD', locale: 'en-US', categories: [], series: [] },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const months = ['may', 'jun', 'jul', 'ago', 'sep', 'oct'];

export const Default: Story = {
  args: {
    categories: months,
    series: [
      { name: 'ingresos', values: [1500, 1500, 1600, 1500, 1700, 1800] },
      { name: 'gastos', values: [900, 1100, 700, 1250, 980, 1020] },
    ],
  },
};

export const SingleSeries: Story = {
  args: { title: 'gasto por mes', categories: months, series: [{ name: 'gastos', values: [900, 1100, 700, 1250, 980, 1020] }] },
};

export const FourSeries: Story = {
  args: {
    title: 'gasto por rubro',
    categories: months.slice(3),
    series: [
      { name: 'vivienda', values: [600, 600, 600] },
      { name: 'comida', values: [320, 280, 350] },
      { name: 'transporte', values: [90, 120, 80] },
      { name: 'ocio', values: [140, 60, 210] },
    ],
  },
};

export const MoreThanFour: Story = {
  args: {
    title: 'gasto por rubro',
    categories: months.slice(3),
    series: [
      { name: 'vivienda', values: [600, 600, 600] },
      { name: 'comida', values: [320, 280, 350] },
      { name: 'transporte', values: [90, 120, 80] },
      { name: 'ocio', values: [140, 60, 210] },
      { name: 'salud', values: [40, 0, 130] },
      { name: 'otros', values: [20, 35, 15] },
    ],
  },
};

export const NegativesAndZeros: Story = {
  args: {
    title: 'resultado por mes',
    categories: months.slice(0, 4),
    series: [
      { name: 'resultado', values: [600, 0, -350, 120] },
      { name: 'ahorro', values: [200, 0, -100, 40] },
    ],
  },
};

export const UnknownValues: Story = {
  args: {
    categories: months.slice(0, 4),
    series: [
      { name: 'ingresos', values: [1500, null, 1600, NaN] },
      { name: 'gastos', values: [900, 1100, undefined, 700] },
    ],
  },
};

export const UnevenSeries: Story = {
  args: {
    categories: months.slice(0, 4),
    series: [
      { name: 'ingresos', values: [1500, 1500, 1600, 1500] },
      { name: 'proyección', values: [1550, 1580] },
    ],
  },
};

export const Empty: Story = {};
