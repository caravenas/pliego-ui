import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SpecStep } from './SpecStep';
import { Field } from '../Field/Field';
import { Input } from '../Input/Input';

const meta = {
  title: 'Patrones/SpecStep',
  component: SpecStep,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SpecStep>;

export default meta;
type Story = StoryObj<typeof meta>;

const body = (
  <Field label="número de páginas" id="step-pages">
    <Input type="number" defaultValue={64} />
  </Field>
);

export const Closed: Story = {
  args: { number: 1, title: 'Formato', summary: '140 × 210 · 2:3', onOptions: () => {}, children: body },
};

export const Open: Story = {
  args: { number: 2, title: 'Papel interior', summary: 'offset 90 g', defaultOpen: true, onOptions: () => {}, children: body },
};

export const LongTitle: Story = {
  args: {
    number: 3,
    title: 'Páginas y encuadernación',
    summary: '64 páginas · rústica fresada · lomo de 3,2 mm',
    optionsLabel: 'páginas y encuadernación',
    onOptions: () => {},
    children: body,
  },
};

export const Controlled: Story = {
  args: { number: 4, title: 'Imposición', summary: '8 páginas por pliego', children: body },
  render: (args) => {
    const [open, setOpen] = useState(true);
    return <SpecStep {...args} open={open} onOpenChange={setOpen} />;
  },
};
