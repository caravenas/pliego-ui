import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Dashboard.stories';
import { FinanceDashboard, sampleLoaders, type Loaders, type Period } from './Dashboard.stories';

const { Loading, AllFail, PanelWithoutData, WithoutOnePanel } = composeStories(stories);

const PANELS = ['resumen en dólares', 'evolución del saldo', 'cuenta en pesos', 'ingresos y gastos', 'movimientos'];

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}
const setup = () => userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
const panel = (name: string) => screen.getByRole('region', { name });

/** Todo texto que un lector oiría: regiones vivas con contenido y que no están apagadas. */
function liveTexts() {
  return Array.from(document.querySelectorAll<HTMLElement>('[role="status"], [role="alert"], [aria-live]'))
    .filter((el) => el.getAttribute('aria-live') !== 'off' && el.getAttribute('role') !== 'none')
    .map((el) => el.textContent?.trim() ?? '')
    .filter(Boolean);
}

/** El nombre que dan `aria-label`, `aria-labelledby` o el `figcaption`: lo que usan las piezas de esta pantalla. */
function nameOf(el: Element): string {
  const label = el.getAttribute('aria-label');
  if (label) return label;
  const ids = el.getAttribute('aria-labelledby')?.split(/\s+/) ?? [];
  const byIds = ids.map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim();
  return byIds || (el.querySelector('figcaption')?.textContent ?? '');
}

/** Cargadores cuyas peticiones controla el test, con la lista de las claves pedidas. */
function controlled() {
  const calls: Record<keyof Loaders, { key: unknown; resolve: (v: never) => void; reject: (e: unknown) => void }[]> = {
    summary: [],
    trend: [],
    bars: [],
    movements: [],
    pesos: [],
  };
  const make = <K extends keyof Loaders>(name: K) =>
    ((key: unknown) =>
      new Promise((resolve, reject) => {
        calls[name].push({ key, resolve: resolve as (v: never) => void, reject });
      })) as Loaders[K];
  const loaders: Loaders = {
    summary: make('summary'),
    trend: make('trend'),
    bars: make('bars'),
    movements: make('movements'),
    pesos: make('pesos'),
  };
  return { calls, loaders };
}

/** Con los datos de ejemplo, resuelve cada petición pendiente con lo que pide su clave. */
async function resolveAll(c: ReturnType<typeof controlled>, from = 0) {
  const sample = sampleLoaders();
  const signal = new AbortController().signal;
  for (const name of ['summary', 'trend', 'bars', 'movements'] as const) {
    for (const call of c.calls[name].slice(from)) {
      const value = await (sample[name] as (k: Period, s: AbortSignal) => Promise<unknown>)(call.key as Period, signal);
      await act(async () => call.resolve(value as never));
    }
  }
  for (const call of c.calls.pesos) {
    await act(async () => call.resolve({ balance: 1_850_000, previous: 1_700_000 } as never));
  }
}

async function ready(props: React.ComponentProps<typeof FinanceDashboard> = {}) {
  const view = render(<FinanceDashboard {...props} />);
  await advance(10);
  return view;
}

describe('Dashboard · anuncios', () => {
  it('todos cargando: un único texto vivo en toda la pantalla y cada panel con su marca escrita', async () => {
    render(<Loading />);
    await advance(250);
    expect(liveTexts()).toEqual(['cargando 5 paneles']);
    for (const name of PANELS) expect(within(panel(name)).getByText('cargando')).toBeVisible();
  });

  it('todos fallando: una sola alerta con los títulos en orden y un «reintentar» por panel', async () => {
    render(<AllFail />);
    await advance(10); // los rechazos llegan y los paneles pasan a error
    await advance(250); // y DashboardStatus junta los avisos
    expect(screen.getAllByRole('alert').filter((el) => el.textContent)).toHaveLength(1);
    expect(liveTexts()).toEqual([`no se pudieron cargar: ${PANELS.join(', ')}`]);
    expect(screen.getAllByRole('button', { name: 'reintentar' })).toHaveLength(5);
    for (const name of PANELS) expect(within(panel(name)).getByText('el banco no respondió')).toBeVisible();
  });
});

describe('Dashboard · aislamiento de errores y datos anteriores', () => {
  it('un panel que falla con datos anteriores no toca a los demás ni presenta sus cifras como vigentes', async () => {
    const failing = (period: Period, signal: AbortSignal) =>
      period === '12m' ? Promise.reject(new Error('el banco no respondió en 30 s')) : sampleLoaders().movements(period, signal);
    await ready({ switchTo: '12m', loaders: { movements: failing } });
    await advance(300);

    const movements = panel('movimientos');
    expect(within(movements).getByText(/no se pudieron actualizar; estos datos son de 30 días/)).toBeVisible();
    expect(within(movements).getByText('el banco no respondió en 30 s', { exact: false })).toBeVisible();
    expect(within(movements).getByText('Arriendo')).toBeVisible();
    expect(within(movements).queryByText('Seguro anual')).toBeNull();

    // Los demás paneles ya muestran los 12 meses, sin marca.
    expect(within(panel('evolución del saldo')).getAllByText('mes 12').length).toBeGreaterThan(0);
    expect(within(panel('evolución del saldo')).queryByText(/datos de/)).toBeNull();
    expect(within(panel('resumen en dólares')).queryByText(/no se pudieron/)).toBeNull();
    // Solo «movimientos» se anuncia.
    expect(liveTexts()).toEqual(['no se pudieron cargar: movimientos']);
  });

  it('mientras carga el periodo nuevo los datos del anterior dicen de cuál son', async () => {
    const c = controlled();
    render(<FinanceDashboard loaders={c.loaders} />);
    await resolveAll(c);
    const user = setup();
    await user.click(screen.getByRole('radio', { name: '12 meses' }));
    expect(within(panel('evolución del saldo')).getByText('datos de 30 días; cargando los de 12 meses')).toBeVisible();
    expect(within(panel('evolución del saldo')).getAllByText('semana 4').length).toBeGreaterThan(0);
  });

  it('un panel más lento que el siguiente cambio de periodo no pisa al periodo nuevo', async () => {
    const c = controlled();
    render(<FinanceDashboard loaders={c.loaders} />);
    await resolveAll(c);
    const user = setup();
    await user.click(screen.getByRole('radio', { name: '7 días' }));
    await user.click(screen.getByRole('radio', { name: '12 meses' }));
    expect(c.calls.movements.map((call) => call.key)).toEqual(['30d', '7d', '12m']);

    await resolveAll(c, 2); // solo la de 12 meses
    expect(within(panel('movimientos')).getByText('Seguro anual')).toBeVisible();

    // La de 7 días llega tarde.
    const late = await sampleLoaders().movements('7d', new AbortController().signal);
    await act(async () => c.calls.movements[1].resolve(late as never));
    expect(within(panel('movimientos')).getByText('Seguro anual')).toBeVisible();
    expect(within(panel('movimientos')).queryByText('Café Tostado')).toBeNull();
    expect(within(panel('movimientos')).queryByText(/datos de/)).toBeNull();
  });

  it('un error tardío de un periodo anterior no marca error en el actual', async () => {
    const c = controlled();
    render(<FinanceDashboard loaders={c.loaders} />);
    await resolveAll(c);
    const user = setup();
    await user.click(screen.getByRole('radio', { name: '7 días' }));
    await user.click(screen.getByRole('radio', { name: '12 meses' }));
    await resolveAll(c, 2);
    await act(async () => c.calls.movements[1].reject(new Error('tarde')));
    await advance(300);
    expect(liveTexts()).toEqual([]);
    expect(within(panel('movimientos')).queryByText('tarde')).toBeNull();
  });

  it('cambiar de periodo dos veces seguidas pide una vez por periodo y gana el último', async () => {
    const c = controlled();
    render(<FinanceDashboard loaders={c.loaders} />);
    await resolveAll(c);
    const user = setup();
    await user.click(screen.getByRole('radio', { name: '7 días' }));
    await user.click(screen.getByRole('radio', { name: '12 meses' }));
    for (const name of ['summary', 'trend', 'bars', 'movements'] as const) {
      expect(c.calls[name].map((call) => call.key)).toEqual(['30d', '7d', '12m']);
    }
    expect(c.calls.pesos).toHaveLength(1);
    expect(screen.getByRole('radio', { name: '12 meses' })).toBeChecked();
  });

  it('un periodo que no existe no cambia el selector ni pide nada distinto', async () => {
    const c = controlled();
    render(<FinanceDashboard loaders={c.loaders} initialPeriod="1y" />);
    expect(screen.getByRole('radio', { name: '30 días' })).toBeChecked();
    expect(c.calls.movements.map((call) => call.key)).toEqual(['30d']);
  });
});

describe('Dashboard · paneles sin datos y monedas', () => {
  it('un panel sin datos junto a uno con datos: el primero lo dice y el otro no se afecta', async () => {
    render(<PanelWithoutData />);
    await advance(10);
    expect(within(panel('ingresos y gastos')).getByText('sin datos para graficar')).toBeVisible();
    expect(within(panel('resumen en dólares')).getByRole('group', { name: 'saldo disponible' })).toBeVisible();
    expect(within(panel('movimientos')).getByText('Sueldo')).toBeVisible();
  });

  it('las dos monedas no se mezclan: cada panel lleva la suya y no hay ninguna suma', async () => {
    await ready();
    const usd = panel('resumen en dólares');
    const clp = panel('cuenta en pesos');
    expect(usd).toHaveTextContent('US$');
    expect(clp).not.toHaveTextContent('US$');
    expect(clp).toHaveTextContent('$1.850.000');
    expect(usd).not.toHaveTextContent('1.850.000');
    // Ninguna cifra es la suma de las dos monedas.
    expect(document.body.textContent).not.toMatch(/1\.851\.\d{3}|1\.851\.250/);
    // Cada gráfica y la tabla dicen su moneda en el título.
    expect(screen.getByRole('img', { name: /saldo de la cuenta en dólares/ })).toBeInTheDocument();
  });
});

describe('Dashboard · foco', () => {
  it('el foco en el filtro de la tabla sobrevive a un cambio de periodo y a la llegada de los datos, con lo escrito', async () => {
    await ready();
    const user = setup();
    const filter = screen.getByRole('searchbox', { name: 'filtrar' });
    await user.type(filter, 'caf');
    expect(filter).toHaveFocus();
    fireEvent.click(screen.getByRole('radio', { name: '12 meses' })); // cambia el periodo sin mover el foco
    expect(filter).toHaveFocus();
    await advance(10);
    expect(filter).toHaveFocus();
    expect(filter).toHaveValue('caf');
    expect(screen.getByRole('searchbox', { name: 'filtrar' })).toBe(filter);
  });

  it('el foco en el selector de periodo no salta cuando llegan los datos', async () => {
    await ready();
    const user = setup();
    const radio = screen.getByRole('radio', { name: '30 días' });
    radio.focus();
    await user.keyboard('{ArrowRight}');
    const next = screen.getByRole('radio', { name: '12 meses' });
    expect(next).toHaveFocus();
    await advance(10);
    expect(next).toHaveFocus();
  });

  it('tras «reintentar» el foco queda en el panel, no en el cuerpo', async () => {
    let fails = true;
    const movements = (period: Period, signal: AbortSignal) =>
      fails ? Promise.reject(new Error('el banco no respondió')) : sampleLoaders().movements(period, signal);
    await ready({ loaders: { movements } });
    await advance(300);
    const user = setup();
    fails = false;
    await user.click(within(panel('movimientos')).getByRole('button', { name: 'reintentar' }));
    await advance(10);
    expect(panel('movimientos')).toHaveFocus();
  });

  it('ningún elemento tiene un tabindex positivo', async () => {
    await ready();
    const positive = Array.from(document.querySelectorAll('[tabindex]')).filter((el) => Number(el.getAttribute('tabindex')) > 0);
    expect(positive).toEqual([]);
  });
});

describe('Dashboard · estructura', () => {
  const NAMED = ['main', 'region', 'group', 'figure', 'img'] as const;

  async function structure() {
    const names = NAMED.flatMap((role) =>
      screen
        .queryAllByRole(role)
        // Un <details> es un grupo para el árbol, pero su nombre lo da el <summary> al abrirlo; no es un punto de referencia.
        .filter((el) => el.tagName !== 'DETAILS')
        .map((el) => ({ role, name: nameOf(el) })),
    );
    return names;
  }

  async function checkPage(expectedPanels: string[]) {
    expect(screen.getAllByRole('main')).toHaveLength(1);
    const headings = screen.getAllByRole('heading');
    expect(headings.filter((h) => h.tagName === 'H1')).toHaveLength(1);
    expect(headings[0].tagName).toBe('H1');
    // Tras el h1 solo h2: ningún salto de nivel ni encabezado más profundo.
    expect(headings.slice(1).map((h) => h.tagName)).toEqual(expectedPanels.map(() => 'H2'));
    expect(headings.slice(1).map((h) => h.textContent)).toEqual(expectedPanels);
    const names = await structure();
    for (const { role, name } of names) expect(name, `un ${role} sin nombre`).not.toBe('');
    const all = names.map((n) => n.name);
    expect(all.filter((name, i) => all.indexOf(name) !== i), 'nombres repetidos').toEqual([]);
  }

  it('una sola main, un h1, h2 en orden y cada región con un nombre único', async () => {
    await ready();
    await checkPage(PANELS);
  });

  it('la misma página con un panel quitado sigue siendo válida y no lo anuncia', async () => {
    render(<WithoutOnePanel />);
    await advance(10);
    await checkPage(PANELS.filter((name) => name !== 'evolución del saldo'));
    expect(screen.queryByRole('region', { name: 'evolución del saldo' })).toBeNull();
  });

  it('un panel quitado no pide su carga al consumidor', async () => {
    const c = controlled();
    render(<FinanceDashboard loaders={c.loaders} without={['evolución']} />);
    expect(c.calls.trend).toHaveLength(0);
    expect(c.calls.summary).toHaveLength(1);
    await advance(300);
    expect(liveTexts()).toEqual(['cargando 4 paneles']);
  });
});

describe('Dashboard · rendimiento', () => {
  it('cambiar el periodo no vuelve a pedir ni a pintar «cuenta en pesos»', async () => {
    const c = controlled();
    const log: string[] = [];
    const onPanelRender = (id: string) => log.push(id);
    render(<FinanceDashboard loaders={c.loaders} onPanelRender={onPanelRender} />);
    await resolveAll(c);
    const before = log.length;
    expect(before).toBeGreaterThan(0);
    log.length = 0;

    const user = setup();
    await user.click(screen.getByRole('radio', { name: '12 meses' }));
    await resolveAll(c, 1);
    await advance(300);

    expect(c.calls.pesos).toHaveLength(1);
    expect(log.filter((id) => id === 'pesos')).toEqual([]);
    for (const name of ['summary', 'trend', 'bars', 'movements'] as const) expect(c.calls[name]).toHaveLength(2);
    // Los que dependen del periodo sí se repintaron.
    expect(new Set(log)).toEqual(new Set(['resumen', 'evolución', 'barras', 'movimientos']));
  });
});
