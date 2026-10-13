import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';

const meta = {
  title: 'Patrones/Field',
  component: Field,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 372 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'número de páginas',
    id: 'pages',
    children: <Input type="number" defaultValue={64} />,
  },
};

export const WithMarginalia: Story = {
  args: {
    label: 'calibre',
    id: 'caliper',
    marginalia: 'en micras',
    note: (
      <>
        <div>papel.json</div>
        <div>ficha del proveedor</div>
      </>
    ),
    children: <Input defaultValue="120" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'calibre',
    id: 'caliper-error',
    error: 'el calibre debe ser mayor que 0',
    children: <Input defaultValue="0" />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'papel',
    id: 'paper',
    marginalia: 'fijado por la prensa',
    children: (
      <Select disabled defaultValue="kraft">
        <option value="offset">offset ahuesado</option>
        <option value="kraft">kraft</option>
      </Select>
    ),
  },
};

export const WithSelect: Story = {
  args: {
    label: 'papel',
    id: 'paper-select',
    children: (
      <Select defaultValue="offset">
        <option value="offset">offset ahuesado</option>
        <option value="couche">couché mate</option>
      </Select>
    ),
  },
};
