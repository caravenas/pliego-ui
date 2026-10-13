import type { Meta, StoryObj } from '@storybook/react';
import { HowPanel } from './HowPanel';

const meta = {
  title: 'Patrones/HowPanel',
  component: HowPanel,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 372 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HowPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    formulas: ['Hojas físicas = ⌈64 ÷ 2⌉ = 32 hojas', 'Lomo estimado = 32 hojas × calibre'],
    note: 'valores preliminares · confirmar con la imprenta',
  },
};

export const WithText: Story = {
  args: {
    formulas: ['Hojas físicas = ⌈64 ÷ 2⌉ = 32 hojas'],
    children: 'Corrimiento (creep): el pliego más externo se desplaza un máximo de 0,4 mm y el más interno no se desplaza.',
  },
};
