import type { Meta, StoryObj } from '@storybook/react';
import { Badge, OriginBadge } from './Badge';

const meta = {
  title: 'Primitivos/Badge',
  component: Badge,
  args: { children: 'Datos de ejemplo' },
  argTypes: { variant: { control: 'inline-radio', options: ['outline', 'mono'] } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = { args: { variant: 'outline' } };
export const Mono: Story = { args: { variant: 'mono', children: 'config/pliegos.json' } };

/** El origen de una entrada de catálogo, en las tres palabras de la app. */
export const Origins: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
      <OriginBadge origin="factory" />
      <OriginBadge origin="edited" />
      <OriginBadge origin="own" />
    </div>
  ),
};
