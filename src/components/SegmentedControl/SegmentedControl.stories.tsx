import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl, type SegmentedControlProps } from './SegmentedControl';

// El control es controlado: cada story parte de su `value` y lleva su estado.
function Stateful(props: SegmentedControlProps<string>) {
  const [value, setValue] = useState(props.value);
  return <SegmentedControl {...props} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Patrones/SegmentedControl',
  component: SegmentedControl,
  render: (args) => <Stateful {...(args as SegmentedControlProps<string>)} />,
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const views = [
  { value: 'results', label: 'resultados' },
  { value: 'drawings', label: 'dibujos' },
  { value: 'catalog', label: 'catálogo' },
];

const formats = [
  { value: 'a5', label: 'a5' },
  { value: 'a4', label: 'a4' },
  { value: 'letter', label: 'carta' },
];

export const Tabs: Story = {
  args: { kind: 'tabs', label: 'Vista central', value: 'results', options: views, onChange: () => {} },
};

export const Options: Story = {
  args: { kind: 'options', label: 'Formato', value: 'a5', options: formats, onChange: () => {} },
};

export const WithDisabledSegment: Story = {
  args: {
    kind: 'options',
    label: 'Formato',
    value: 'a5',
    options: [formats[0], { ...formats[1], disabled: true }, formats[2]],
    onChange: () => {},
  },
};

export const LongActiveSegment: Story = {
  args: {
    kind: 'tabs',
    label: 'Vista central',
    value: 'results',
    options: [{ value: 'results', label: 'resultados del cálculo completo' }, views[1], views[2]],
    onChange: () => {},
  },
};
