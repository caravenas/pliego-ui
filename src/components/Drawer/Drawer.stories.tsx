import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './Drawer';
import { Button } from '../Button/Button';
import { Field } from '../Field/Field';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';

const meta = {
  title: 'Patrones/Drawer',
  component: Drawer,
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const args = { title: 'editar catálogo', children: null };

export const Default: Story = {
  args,
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <p>La vista de abajo sigue siendo accesible con el panel abierto: no es modal.</p>
        <Button onClick={() => setOpen(true)}>editar</Button>
        <Button variant="secondary">otra acción</Button>
        <Drawer open={open} onOpenChange={setOpen} title="editar catálogo">
          <Field label="nombre" id="drawer-name">
            <Input defaultValue="Offset ahuesado" />
          </Field>
          <Field label="papel" id="drawer-paper">
            <Select defaultValue="offset">
              <option value="offset">offset</option>
              <option value="couche">couché</option>
            </Select>
          </Field>
        </Drawer>
      </>
    );
  },
};

export const OpenAtStart: Story = {
  args,
  render: () => (
    <Drawer defaultOpen title="editar catálogo">
      <Field label="nombre" id="drawer-name-open">
        <Input defaultValue="Offset ahuesado" />
      </Field>
    </Drawer>
  ),
};
