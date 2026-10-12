import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Primitivos/Button',
  component: Button,
  args: { children: 'Guardar cambios', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'danger'] },
    shape: { control: 'inline-radio', options: ['rect', 'round'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancelar' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Cambiar pliego' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Volver a fábrica' } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };

/** El contador de páginas: dos botones redondos alrededor de la cifra. */
export const Counter: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <Button shape="round" variant="outline" aria-label="Quitar 4 páginas">−</Button>
      <span className="pui-type-measure-input">64</span>
      <Button shape="round" variant="outline" aria-label="Añadir 4 páginas">+</Button>
    </div>
  ),
};

/** La fila de acciones del formulario de catálogo para una entrada de fábrica. */
export const CatalogActions: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', maxWidth: 560 }}>
      <Button variant="danger">Volver a fábrica</Button>
      <Button variant="danger">Ocultar</Button>
      <span style={{ flex: 1 }} />
      <Button variant="secondary">Cancelar</Button>
      <Button variant="primary">Guardar cambios</Button>
    </div>
  ),
};
