import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataPanel, type DataPanelStatus } from './DataPanel';
import { Metric } from '../Metric/Metric';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { TrendChart } from '../TrendChart/TrendChart';

const meta = {
  title: 'Finanzas/DataPanel',
  component: DataPanel,
  args: { title: 'saldo', status: 'ready' },
} satisfies Meta<typeof DataPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const balance = <Metric label="saldo disponible" value={1240} previous={1000} currency="USD" locale="en-US" comparison="frente a septiembre" />;

export const Ready: Story = { args: { children: balance } };

export const Loading: Story = { args: { status: 'loading' } };

export const Refreshing: Story = { args: { status: 'loading', children: balance } };

export const LoadError: Story = { args: { status: 'error', error: 'el banco no respondió en 30 s', onRetry: () => {} } };

export const StaleError: Story = {
  args: { status: 'error', error: 'el banco no respondió en 30 s', onRetry: () => {}, children: balance },
};

type Period = '7d' | '30d' | '12m';

const SERIES: Record<Period, { label: string; value: number }[]> = {
  '7d': [1180, 1195, 1210, 1205, 1222, 1230, 1240].map((value, i) => ({ label: `día ${i + 1}`, value })),
  '30d': [1000, 1080, 1120, 1240].map((value, i) => ({ label: `semana ${i + 1}`, value })),
  '12m': [640, 700, 820, 760, 900, 950, 1010, 980, 1050, 1000, 1120, 1240].map((value, i) => ({ label: `mes ${i + 1}`, value })),
};

/**
 * Para revisar a mano el flujo: cambiar de periodo carga 1,2 s con los datos
 * anteriores marcados; «12 meses» falla la primera vez para probar reintentar.
 */
function WithPeriodDemo() {
  const [period, setPeriod] = useState<Period>('30d');
  const [shown, setShown] = useState<Period>('30d');
  const [status, setStatus] = useState<DataPanelStatus>('ready');
  const failed = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const load = (next: Period) => {
    clearTimeout(timer.current);
    setStatus('loading');
    timer.current = setTimeout(() => {
      if (next === '12m' && !failed.current) {
        failed.current = true;
        setStatus('error');
        return;
      }
      setShown(next);
      setStatus('ready');
    }, 1200);
  };

  const points = SERIES[shown];
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: '32rem' }}>
      <SegmentedControl
        kind="options"
        label="periodo"
        value={period}
        options={[
          { value: '7d', label: '7 días' },
          { value: '30d', label: '30 días' },
          { value: '12m', label: '12 meses' },
        ]}
        onChange={(next) => {
          setPeriod(next);
          load(next);
        }}
      />
      <DataPanel title="saldo" status={status} error="el banco no respondió en 30 s" onRetry={() => load(period)}>
        <Metric
          label="saldo disponible"
          value={points[points.length - 1].value}
          previous={points[0].value}
          currency="USD"
          locale="en-US"
          comparison="frente al inicio del periodo"
        />
        <TrendChart title="saldo de la cuenta corriente" points={points} currency="USD" locale="en-US" />
      </DataPanel>
    </div>
  );
}

export const WithPeriod: Story = { render: () => <WithPeriodDemo /> };
