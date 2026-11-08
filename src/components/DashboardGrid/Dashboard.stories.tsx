import { Profiler, memo, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DashboardCell, DashboardGrid } from './DashboardGrid';
import { DashboardStatus } from '../DashboardStatus/DashboardStatus';
import { DataPanel, type DataPanelStatus } from '../DataPanel/DataPanel';
import { Metric } from '../Metric/Metric';
import { BarChart } from '../BarChart/BarChart';
import { MovementsTable, type Movement } from '../MovementsTable/MovementsTable';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { TrendChart, type TrendPoint } from '../TrendChart/TrendChart';
import { usePanelData } from '../../hooks/usePanelData';

/* ── Datos de ejemplo ────────────────────────────────────────────────────── */

export type Period = '7d' | '30d' | '12m';

export const PERIODS: { value: Period; label: string; name: string }[] = [
  { value: '7d', label: '7 días', name: '7 días' },
  { value: '30d', label: '30 días', name: '30 días' },
  { value: '12m', label: '12 meses', name: '12 meses' },
];
const DEFAULT_PERIOD: Period = '30d';

/** Un periodo desconocido vuelve al de siempre; nunca se pide algo que no existe. */
export const normalizePeriod = (value: unknown): Period =>
  PERIODS.find((period) => period.value === value)?.value ?? DEFAULT_PERIOD;
const periodName = (value: Period | undefined) => PERIODS.find((period) => period.value === value)?.name ?? '';

interface Summary {
  balance: number;
  balancePrevious: number;
  income: number;
  incomePrevious: number;
  spend: number;
  spendPrevious: number;
}
interface Bars {
  categories: string[];
  income: number[];
  spend: number[];
}

const SCALE: Record<Period, number> = { '7d': 0.25, '30d': 1, '12m': 11 };
const SUMMARY = (period: Period): Summary => ({
  balance: 1240 + SCALE[period] * 10,
  balancePrevious: 1000,
  income: 3200 * SCALE[period],
  incomePrevious: 3000 * SCALE[period],
  spend: 2100 * SCALE[period],
  spendPrevious: 2300 * SCALE[period],
});
const TREND: Record<Period, TrendPoint[]> = {
  '7d': [1180, 1195, 1210, 1205, 1222, 1230, 1240].map((value, i) => ({
    label: `día ${i + 1}`,
    value,
  })),
  '30d': [1000, 1080, 1120, 1240].map((value, i) => ({
    label: `semana ${i + 1}`,
    value,
  })),
  '12m': [640, 700, 820, 760, 900, 950, 1010, 980, 1050, 1000, 1120, 1240].map((value, i) => ({
    label: `mes ${i + 1}`,
    value,
  })),
};
const BARS: Record<Period, Bars> = {
  '7d': {
    categories: ['lun', 'mar', 'mié', 'jue', 'vie'],
    income: [0, 0, 3200, 0, 0],
    spend: [120, 80, 310, 95, 240],
  },
  '30d': {
    categories: ['semana 1', 'semana 2', 'semana 3', 'semana 4'],
    income: [3200, 0, 0, 0],
    spend: [520, 610, 480, 490],
  },
  '12m': {
    categories: Array.from({ length: 12 }, (_, i) => `mes ${i + 1}`),
    income: Array(12).fill(3100),
    spend: [2100, 2300, 1900, 2500, 2250, 2100, 2800, 2000, 2200, 2150, 2400, 2100],
  },
};
const MOVEMENTS: Record<Period, Movement[]> = {
  '7d': [
    { id: 'a1', date: '2026-10-18', description: 'Café Tostado', amount: -4.5 },
    {
      id: 'a2',
      date: '2026-10-16',
      description: 'Supermercado',
      amount: -86.2,
    },
    { id: 'a3', date: '2026-10-15', description: 'Sueldo', amount: 3200 },
  ],
  '30d': [
    { id: 'b1', date: '2026-10-18', description: 'Café Tostado', amount: -4.5 },
    {
      id: 'b2',
      date: '2026-10-16',
      description: 'Supermercado',
      amount: -86.2,
    },
    { id: 'b3', date: '2026-10-15', description: 'Sueldo', amount: 3200 },
    { id: 'b4', date: '2026-10-05', description: 'Arriendo', amount: -600 },
    {
      id: 'b5',
      date: '2026-10-02',
      description: 'Reembolso médico',
      amount: 32,
    },
  ],
  '12m': [
    { id: 'c1', date: '2026-10-15', description: 'Sueldo', amount: 3200 },
    { id: 'c2', date: '2026-07-01', description: 'Seguro anual', amount: -420 },
    { id: 'c3', date: '2026-03-12', description: 'Vuelo a Lima', amount: -310 },
    { id: 'c4', date: '2026-01-10', description: 'Bono', amount: 800 },
  ],
};

const never = () => new Promise<never>(() => {});

export interface Loaders {
  summary: (period: Period, signal: AbortSignal) => Promise<Summary>;
  trend: (period: Period, signal: AbortSignal) => Promise<TrendPoint[]>;
  bars: (period: Period, signal: AbortSignal) => Promise<Bars>;
  movements: (period: Period, signal: AbortSignal) => Promise<Movement[]>;
  /** No depende del periodo: su clave es siempre `undefined`. */
  pesos: (key: undefined, signal: AbortSignal) => Promise<{ balance: number; previous: number }>;
}

/** Responde con los datos de ejemplo tras `delay` ms, o rechaza si la señal se aborta. */
function after<T>(delay: number, value: () => T, signal: AbortSignal): Promise<T> {
  // Sin retraso no hay temporizador: la respuesta llega en el siguiente turno, también con relojes simulados.
  if (delay <= 0) return Promise.resolve().then(value);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(value()), delay);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('abortada', 'AbortError'));
    });
  });
}

export const sampleLoaders = (delay = 0): Loaders => ({
  summary: (period, signal) => after(delay, () => SUMMARY(period), signal),
  trend: (period, signal) => after(delay, () => TREND[period], signal),
  bars: (period, signal) => after(delay, () => BARS[period], signal),
  movements: (period, signal) => after(delay, () => MOVEMENTS[period], signal),
  pesos: (_key, signal) => after(delay, () => ({ balance: 1_850_000, previous: 1_700_000 }), signal),
});

const failing = (message: string) => () => Promise.reject(new Error(message));

/* ── El dashboard ────────────────────────────────────────────────────────── */

const LOCALE = 'es-CL';

const errorText = (error: unknown) => (error instanceof Error ? error.message : 'no se pudieron cargar los datos');

type RenderPhase = 'mount' | 'update' | 'nested-update';
type OnPanelRender = (id: string, phase: RenderPhase) => void;

/** Lo que cada panel recibe: el estado de su carga y, si depende del periodo, cuál se pidió. */
interface PanelProps<T> {
  status: DataPanelStatus;
  data: T | undefined;
  dataKey?: Period;
  error: unknown;
  retry: () => void;
  period?: Period;
  onRender?: OnPanelRender;
}

interface FrameProps {
  id: string;
  title: string;
  status: DataPanelStatus;
  error: unknown;
  retry: () => void;
  dataKey?: Period;
  period?: Period;
  onRender?: OnPanelRender;
  children: ReactNode;
}

/**
 * Un `DataPanel` que no habla por su cuenta (`DashboardStatus` anuncia por
 * todos) y que escribe de qué periodo son los datos que muestra: «datos
 * anteriores» a secas no dice si son de 7 días o de 12 meses.
 */
function Frame({ id, title, status, error, retry, dataKey, period, onRender, children }: FrameProps) {
  const stale =
    period && dataKey
      ? {
          staleLabel: `datos de ${periodName(dataKey)}; cargando los de ${periodName(period)}`,
          staleErrorLabel: `no se pudieron actualizar; estos datos son de ${periodName(dataKey)}`,
        }
      : {};
  const panel = (
    <DataPanel
      title={title}
      status={status}
      announce={false}
      error={error === undefined ? undefined : errorText(error)}
      onRetry={retry}
      {...stale}
    >
      {children}
    </DataPanel>
  );
  return onRender ? (
    <Profiler id={id} onRender={(_id, phase) => onRender(id, phase)}>
      {panel}
    </Profiler>
  ) : (
    panel
  );
}

// Cada panel es `memo` y recibe datos que no cambian de identidad entre renders:
// cambiar el periodo repinta solo los que dependen de él.
const SummaryPanel = memo(function SummaryPanel({ data, dataKey, ...frame }: PanelProps<Summary>) {
  return (
    <Frame id="resumen" title="resumen en dólares" dataKey={dataKey} {...frame}>
      {data ? (
        <div style={{ display: 'grid', gap: 16 }}>
          <Metric
            label="saldo disponible"
            value={data.balance}
            previous={data.balancePrevious}
            currency="USD"
            locale={LOCALE}
            comparison={`frente al inicio de ${periodName(dataKey)}`}
          />
          <Metric
            label="ingresos"
            value={data.income}
            previous={data.incomePrevious}
            currency="USD"
            locale={LOCALE}
            comparison="frente al periodo anterior"
          />
          <Metric
            label="gastos"
            value={data.spend}
            previous={data.spendPrevious}
            currency="USD"
            locale={LOCALE}
            comparison="frente al periodo anterior"
          />
        </div>
      ) : null}
    </Frame>
  );
});

const TrendPanel = memo(function TrendPanel({ data, ...frame }: PanelProps<TrendPoint[]>) {
  return (
    <Frame id="evolución" title="evolución del saldo" {...frame}>
      {data ? <TrendChart title="saldo de la cuenta en dólares" points={data} currency="USD" locale={LOCALE} /> : null}
    </Frame>
  );
});

const PesosPanel = memo(function PesosPanel({ data, ...frame }: PanelProps<{ balance: number; previous: number }>) {
  return (
    <Frame id="pesos" title="cuenta en pesos" {...frame}>
      {data ? (
        <Metric
          label="saldo en pesos"
          value={data.balance}
          previous={data.previous}
          currency="CLP"
          locale={LOCALE}
          comparison="frente al mes pasado"
        />
      ) : null}
    </Frame>
  );
});

const BarsPanel = memo(function BarsPanel({ data, ...frame }: PanelProps<Bars>) {
  return (
    <Frame id="barras" title="ingresos y gastos" {...frame}>
      {data ? (
        <BarChart
          title="ingresos y gastos en dólares"
          categories={data.categories}
          series={[
            { name: 'ingresos', values: data.income },
            { name: 'gastos', values: data.spend },
          ]}
          currency="USD"
          locale={LOCALE}
        />
      ) : null}
    </Frame>
  );
});

const MovementsPanel = memo(function MovementsPanel({ data, ...frame }: PanelProps<Movement[]>) {
  return (
    <Frame id="movimientos" title="movimientos" {...frame}>
      {data ? (
        <MovementsTable
          caption="movimientos de la cuenta en dólares"
          movements={data}
          currency="USD"
          locale={LOCALE}
          sortable
          filterable
        />
      ) : null}
    </Frame>
  );
});

export type PanelId = 'resumen' | 'evolución' | 'pesos' | 'barras' | 'movimientos';

export interface FinanceDashboardProps {
  /** Paneles que la página no incluye: ni se pintan, ni se piden, ni se anuncian. */
  without?: PanelId[];
  loaders?: Partial<Loaders>;
  initialPeriod?: string;
  /** Cuando todo termina de cargar por primera vez, cambia a este periodo (para mostrar datos anteriores). */
  switchTo?: Period;
  /** Cada vez que un panel se vuelve a pintar; para medir que no se repinta lo que no cambió. Debe ser estable. */
  onPanelRender?: OnPanelRender;
}

export function FinanceDashboard({ without = [], loaders, initialPeriod, switchTo, onPanelRender }: FinanceDashboardProps) {
  const base = { ...sampleLoaders(), ...loaders };
  // Un panel quitado no llama al cargador del consumidor; el hook se llama igual, porque los hooks no son condicionales.
  const skip = (id: PanelId) => without.includes(id);
  const [period, setPeriod] = useState<Period>(normalizePeriod(initialPeriod));

  const summary = usePanelData(period, skip('resumen') ? never : base.summary);
  const trend = usePanelData(period, skip('evolución') ? never : base.trend);
  const bars = usePanelData(period, skip('barras') ? never : base.bars);
  const movements = usePanelData(period, skip('movimientos') ? never : base.movements);
  const pesos = usePanelData<undefined, { balance: number; previous: number }>(
    undefined,
    skip('pesos') ? never : base.pesos,
  );

  const switched = useRef(false);
  const settled = [summary, trend, bars, movements, pesos].every((p) => p.status !== 'loading');
  useEffect(() => {
    if (switchTo && settled && !switched.current) {
      switched.current = true;
      setPeriod(switchTo);
    }
  }, [switchTo, settled]);

  const hidden = without.join('|');
  const panels = useMemo(
    () =>
      [
        { id: 'resumen', title: 'resumen en dólares', status: summary.status },
        { id: 'evolución', title: 'evolución del saldo', status: trend.status },
        { id: 'pesos', title: 'cuenta en pesos', status: pesos.status },
        { id: 'barras', title: 'ingresos y gastos', status: bars.status },
        { id: 'movimientos', title: 'movimientos', status: movements.status },
      ]
        .filter((panel) => !hidden.split('|').includes(panel.id))
        .map(({ title, status }) => ({ title, status })),
    [hidden, summary.status, trend.status, pesos.status, bars.status, movements.status],
  );

  const cell = (id: PanelId, wide: boolean, node: ReactNode) =>
    skip(id) ? null : (
      <DashboardCell key={id} wide={wide}>
        {node}
      </DashboardCell>
    );

  return (
    <main aria-labelledby="finanzas-titulo" style={{ display: 'grid', gap: 24 }}>
      <h1 id="finanzas-titulo" className="pui-type-panel-title" style={{ margin: 0 }}>
        finanzas
      </h1>
      <DashboardStatus panels={panels} />
      <SegmentedControl
        kind="options"
        label="periodo"
        value={period}
        options={PERIODS.map(({ value, label }) => ({ value, label }))}
        onChange={(next) => setPeriod(normalizePeriod(next))}
      />
      <DashboardGrid>
        {cell('resumen', false, <SummaryPanel {...summary} period={period} onRender={onPanelRender} />)}
        {cell('evolución', false, <TrendPanel {...trend} period={period} onRender={onPanelRender} />)}
        {cell('pesos', false, <PesosPanel {...pesos} onRender={onPanelRender} />)}
        {cell('barras', false, <BarsPanel {...bars} period={period} onRender={onPanelRender} />)}
        {cell('movimientos', true, <MovementsPanel {...movements} period={period} onRender={onPanelRender} />)}
      </DashboardGrid>
    </main>
  );
}

/* ── Stories ─────────────────────────────────────────────────────────────── */

const meta = {
  title: 'Finanzas/Dashboard',
  component: FinanceDashboard,
  parameters: { layout: 'fullscreen' },
  // El componente de ejemplo y sus datos son de los tests, no stories.
  excludeStories: ['PERIODS', 'normalizePeriod', 'sampleLoaders', 'FinanceDashboard'],
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FinanceDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loaders: {
      summary: never,
      trend: never,
      bars: never,
      movements: never,
      pesos: never,
    },
  },
};

export const AllFail: Story = {
  args: {
    loaders: {
      summary: failing('el banco no respondió'),
      trend: failing('el banco no respondió'),
      bars: failing('el banco no respondió'),
      movements: failing('el banco no respondió'),
      pesos: failing('el banco no respondió'),
    },
  },
};

/** Carga bien en 30 días y, al pasar a 12 meses, «movimientos» falla: sigue con los datos de 30 días, marcados. */
export const OneFailsWithPreviousData: Story = {
  args: {
    switchTo: '12m',
    loaders: {
      movements: (period, signal) =>
        period === '12m'
          ? Promise.reject(new Error('el banco no respondió en 30 s'))
          : sampleLoaders().movements(period, signal),
    },
  },
};

/**
 * Cambia de periodo: cada panel carga por su cuenta, «movimientos» tarda más y
 * «cuenta en pesos» no se vuelve a pedir. El periodo inicial responde al
 * instante, para que la captura de la story sea estable; los demás tardan.
 */
const slow = (delay: number): Loaders => {
  const quick = sampleLoaders(0);
  const late = sampleLoaders(delay);
  const pick = (period: Period) => (period === DEFAULT_PERIOD ? quick : late);
  return {
    summary: (period, signal) => pick(period).summary(period, signal),
    trend: (period, signal) => pick(period).trend(period, signal),
    bars: (period, signal) => pick(period).bars(period, signal),
    movements: (period, signal) => pick(period).movements(period, signal),
    pesos: quick.pesos,
  };
};

export const WithPeriod: Story = {
  args: {
    loaders: {
      ...slow(900),
      movements: (period, signal) =>
        period === DEFAULT_PERIOD ? sampleLoaders(0).movements(period, signal) : sampleLoaders(2600).movements(period, signal),
    },
  },
};

/** «ingresos y gastos» sin ningún valor conocido junto a paneles con datos. */
export const PanelWithoutData: Story = {
  args: {
    loaders: {
      bars: () => Promise.resolve({ categories: [], income: [], spend: [] }),
    },
  },
};

/** Una página que no incluye «evolución del saldo»: sigue siendo válida y no se anuncia un panel que no existe. */
export const WithoutOnePanel: Story = { args: { without: ['evolución'] } };
