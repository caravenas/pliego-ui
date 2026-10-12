import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Primitivos/Input',
  component: Input,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 372 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const labelStyle = { display: 'block', marginBottom: 'var(--space-2)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' } as const;

export const WithLabel: Story = {
  render: (args) => (
    <>
      <label htmlFor="pp" className="pui-type-form-label" style={labelStyle}>
        número de páginas
      </label>
      <Input id="pp" type="number" defaultValue={64} {...args} />
    </>
  ),
};

export const Placeholder: Story = {
  args: { 'aria-label': 'Nombre de la prensa', placeholder: 'Prensa de pliego 70 × 100' },
};

export const Disabled: Story = {
  args: { 'aria-label': 'Calibre', defaultValue: '120 µm', disabled: true },
};
