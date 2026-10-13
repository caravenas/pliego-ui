import type { Meta, StoryObj } from '@storybook/react';
import { ResultList, ResultRow } from './ResultList';
import { HowPanel } from '../HowPanel/HowPanel';

const meta = {
  title: 'Patrones/ResultList',
  component: ResultList,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 372 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResultList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ResultList>
      <ResultRow label="hojas de papel (interior)" unit="hojas">
        32
      </ResultRow>
      <ResultRow label="pliegos de prensa por ejemplar">4</ResultRow>
      <ResultRow label="lomo estimado" unit="mm">
        3,2
      </ResultRow>
      <ResultRow label="peso interior" unit="g">
        118,4
      </ResultRow>
    </ResultList>
  ),
};

export const WithHowPanel: Story = {
  render: () => (
    <>
      <ResultList>
        <ResultRow label="hojas de papel (interior)" unit="hojas">
          32
        </ResultRow>
        <ResultRow label="lomo estimado" unit="mm">
          3,2
        </ResultRow>
      </ResultList>
      <HowPanel
        formulas={['Hojas físicas = ⌈64 ÷ 2⌉ = 32 hojas', 'Lomo estimado = 32 hojas × calibre']}
        note="valores preliminares · confirmar con la imprenta"
      >
        Corrimiento (creep): esta encuadernación anida pliegos plegados de 4 páginas, uno dentro de otro.
      </HowPanel>
    </>
  ),
};
