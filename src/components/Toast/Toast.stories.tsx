import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastProvider } from './Toast';
import { Button } from '../Button/Button';

const meta = {
  title: 'Patrones/Toast',
  component: Toast,
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const args = { children: null };

export const Note: Story = {
  args,
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>guardar</Button>
        <Toast open={open} onOpenChange={setOpen} title="guardado">
          Los cambios están en este navegador.
        </Toast>
      </>
    );
  },
};

export const Failure: Story = {
  args,
  render: () => (
    <Toast variant="error" title="no se pudo guardar">
      Este navegador no deja guardar: los cambios valen solo para esta sesión.
    </Toast>
  ),
};

export const WithAction: Story = {
  args,
  render: () => (
    <Toast title="entrada oculta" action={{ label: 'deshacer', onAction: () => {} }}>
      El papel «kraft» ya no aparece en el catálogo.
    </Toast>
  ),
};
