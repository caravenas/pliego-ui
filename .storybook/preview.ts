import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';
import '../src/styles/base.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'papel',
      values: [
        { name: 'papel', value: '#fcfcfc' },
        { name: 'papel cálido', value: '#f9f9f7' },
      ],
    },
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
};

export default preview;
