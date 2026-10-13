import type { Meta, StoryObj } from '@storybook/react';
import { Notice } from './Notice';

const meta = {
  title: 'Patrones/Notice',
  component: Notice,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 372 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {
  args: { variant: 'note', children: 'El lomo se estima con el calibre del papel elegido.' },
};

export const Preview: Story = {
  args: { variant: 'preview', children: 'Vista previa: las cifras cambian al editar el formato.' },
};

export const Invalid: Story = {
  args: { variant: 'error', children: 'El número de páginas debe ser múltiplo de 4 en esta encuadernación.' },
};

export const Config: Story = {
  args: {
    variant: 'config',
    title: 'La configuración no es válida',
    children: (
      <>
        <ul>
          <li>el calibre del papel «offset» no puede ser 0</li>
          <li>la prensa «70 × 100» no admite el formato elegido</li>
        </ul>
        <p>Corrige el archivo de configuración y recarga la página.</p>
      </>
    ),
  },
};
