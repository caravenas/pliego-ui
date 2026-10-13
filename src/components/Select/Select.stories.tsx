import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'Primitivos/Select',
  component: Select,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 372 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = (
  <>
    <option value="offset">offset ahuesado</option>
    <option value="couche">couché mate</option>
    <option value="kraft">kraft</option>
  </>
);

export const Default: Story = {
  args: { 'aria-label': 'Papel', defaultValue: 'offset', children: options },
};

export const Disabled: Story = {
  args: { 'aria-label': 'Papel', defaultValue: 'kraft', disabled: true, children: options },
};
