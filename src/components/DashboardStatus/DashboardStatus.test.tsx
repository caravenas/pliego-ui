import { act, render, screen } from '@testing-library/react';
import { DashboardStatus, type DashboardStatusPanel } from './DashboardStatus';

const ids = ['saldo', 'evolución', 'ingresos y gastos', 'movimientos'];
const all = (status: DashboardStatusPanel['status']): DashboardStatusPanel[] => ids.map((title) => ({ title, status }));

const polite = () => screen.getByRole('status');
const assertive = () => screen.getByRole('alert');

/** Cuenta cuántas veces cambia el texto de una región, que es lo que un lector oye. */
function watch(node: HTMLElement) {
  const texts: string[] = [];
  const observer = new MutationObserver(() => {
    // Vaciar una región no se oye: solo cuenta el texto nuevo.
    const text = node.textContent ?? '';
    if (text && text !== texts[texts.length - 1]) texts.push(text);
  });
  observer.observe(node, { childList: true, characterData: true, subtree: true });
  return { texts, flush: () => observer.takeRecords(), stop: () => observer.disconnect() };
}

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('DashboardStatus · carga', () => {
  it('las dos regiones existen desde el primer render y están vacías', () => {
    render(<DashboardStatus panels={all('ready')} />);
    expect(polite()).toBeEmptyDOMElement();
    expect(assertive()).toBeEmptyDOMElement();
  });

  it('todos cargando dan un solo cambio de texto: «cargando 4 paneles»', async () => {
    const { rerender } = render(<DashboardStatus panels={all('ready')} />);
    const log = watch(polite());
    rerender(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    expect(polite()).toHaveTextContent('cargando 4 paneles');
    log.flush();
    expect(log.texts).toEqual(['cargando 4 paneles']);
  });

  it('que los paneles terminen no reescribe el texto', async () => {
    const { rerender } = render(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    const log = watch(polite());
    const progress = all('loading').map((p, i) => (i < 3 ? { ...p, status: 'ready' as const } : p));
    rerender(<DashboardStatus panels={progress} />);
    await advance(1000);
    await advance(1000);
    log.flush();
    expect(log.texts).toEqual([]);
    expect(polite()).toHaveTextContent('cargando 4 paneles');
  });

  it('un segundo cambio de periodo con paneles aún cargando no lo repite', async () => {
    const { rerender } = render(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    const log = watch(polite());
    rerender(<DashboardStatus panels={all('loading').map((p, i) => ({ ...p, status: i === 0 ? 'ready' : 'loading' }))} />);
    await advance(300);
    rerender(<DashboardStatus panels={all('loading')} />);
    await advance(1000);
    log.flush();
    expect(log.texts).toEqual([]);
  });

  it('dos cambios dentro de la espera de 250 ms dan un único aviso con la cuenta final', async () => {
    const { rerender } = render(<DashboardStatus panels={all('ready')} />);
    const log = watch(polite());
    rerender(<DashboardStatus panels={all('ready').map((p, i) => ({ ...p, status: i < 2 ? 'loading' : 'ready' }))} />);
    await advance(100);
    rerender(<DashboardStatus panels={all('loading')} />);
    await advance(400);
    log.flush();
    expect(log.texts).toEqual(['cargando 4 paneles']);
  });

  it('con un solo panel cargando dice «cargando 1 panel»', async () => {
    const { rerender } = render(<DashboardStatus panels={all('ready')} />);
    rerender(<DashboardStatus panels={all('ready').map((p, i) => ({ ...p, status: i === 0 ? 'loading' : 'ready' }))} />);
    await advance(250);
    expect(polite()).toHaveTextContent('cargando 1 panel');
  });

  it('al terminar bien no anuncia nada y vacía la región para que la siguiente carga se lea', async () => {
    const { rerender } = render(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    rerender(<DashboardStatus panels={all('ready')} />);
    await advance(250);
    expect(polite()).toBeEmptyDOMElement();
    expect(assertive()).toBeEmptyDOMElement();
    const log = watch(polite());
    rerender(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    log.flush();
    expect(log.texts).toEqual(['cargando 4 paneles']);
  });
});

describe('DashboardStatus · errores', () => {
  it('todos fallando dan un solo aviso en la región alert, con los títulos en orden', async () => {
    const { rerender } = render(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    const log = watch(assertive());
    rerender(<DashboardStatus panels={all('error')} />);
    await advance(250);
    log.flush();
    expect(log.texts).toEqual(['no se pudieron cargar: saldo, evolución, ingresos y gastos, movimientos']);
  });

  it('uno que falla con los demás listos nombra solo ese', async () => {
    const { rerender } = render(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    rerender(<DashboardStatus panels={all('ready').map((p) => ({ ...p, status: p.title === 'movimientos' ? 'error' : 'ready' }))} />);
    await advance(250);
    expect(assertive()).toHaveTextContent('no se pudieron cargar: movimientos');
    expect(assertive()).not.toHaveTextContent('saldo');
  });

  it('un error sin esperar a que terminen los lentos', async () => {
    const { rerender } = render(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    rerender(<DashboardStatus panels={all('loading').map((p, i) => ({ ...p, status: i === 1 ? 'error' : 'loading' }))} />);
    await advance(250);
    expect(assertive()).toHaveTextContent('no se pudieron cargar: evolución');
  });

  it('un error posterior anuncia solo el nuevo, no repite el anterior', async () => {
    const first = all('loading').map((p, i) => ({ ...p, status: i === 0 ? ('error' as const) : ('loading' as const) }));
    const { rerender } = render(<DashboardStatus panels={all('loading')} />);
    rerender(<DashboardStatus panels={first} />);
    await advance(250);
    const log = watch(assertive());
    rerender(<DashboardStatus panels={first.map((p, i) => (i === 3 ? { ...p, status: 'error' as const } : p))} />);
    await advance(250);
    log.flush();
    expect(log.texts).toEqual(['no se pudieron cargar: movimientos']);
  });

  it('un panel que sigue en error tras un nuevo cambio de periodo se vuelve a anunciar si vuelve a fallar', async () => {
    const failed = all('ready').map((p, i) => ({ ...p, status: i === 0 ? ('error' as const) : ('ready' as const) }));
    const { rerender } = render(<DashboardStatus panels={all('ready')} />);
    rerender(<DashboardStatus panels={failed} />);
    await advance(250);
    rerender(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    const log = watch(assertive());
    rerender(<DashboardStatus panels={failed} />);
    await advance(250);
    log.flush();
    expect(log.texts).toEqual(['no se pudieron cargar: saldo']);
  });

  it('títulos repetidos se conservan los dos', async () => {
    const dup: DashboardStatusPanel[] = [
      { title: 'saldo', status: 'error' },
      { title: 'saldo', status: 'error' },
    ];
    render(<DashboardStatus panels={dup} />);
    await advance(250);
    expect(assertive()).toHaveTextContent('no se pudieron cargar: saldo, saldo');
  });
});

describe('DashboardStatus · entradas límite', () => {
  it('una lista vacía pinta las regiones vacías y no lanza', async () => {
    render(<DashboardStatus panels={[]} />);
    await advance(500);
    expect(polite()).toBeEmptyDOMElement();
    expect(assertive()).toBeEmptyDOMElement();
  });

  it('un panel quitado de la lista no deja un aviso colgado', async () => {
    const { rerender } = render(<DashboardStatus panels={all('loading')} />);
    await advance(250);
    rerender(<DashboardStatus panels={all('loading').slice(0, 3)} />);
    rerender(<DashboardStatus panels={all('ready').slice(0, 3)} />);
    await advance(250);
    expect(polite()).toBeEmptyDOMElement();
  });

  it('un estado que no reconoce no se cuenta como carga ni como error', async () => {
    const odd = [{ title: 'saldo', status: 'weird' }] as unknown as DashboardStatusPanel[];
    render(<DashboardStatus panels={odd} />);
    await advance(500);
    expect(polite()).toBeEmptyDOMElement();
    expect(assertive()).toBeEmptyDOMElement();
  });

  it('las etiquetas se pueden sustituir', async () => {
    render(
      <DashboardStatus
        panels={all('loading')}
        labels={{ loading: (n) => `${n} cargando`, failed: (t) => `fallaron ${t}` }}
      />,
    );
    await advance(250);
    expect(polite()).toHaveTextContent('4 cargando');
  });

  it('desmontar con una espera pendiente no escribe ni lanza', async () => {
    const { rerender, unmount } = render(<DashboardStatus panels={all('ready')} />);
    rerender(<DashboardStatus panels={all('loading')} />);
    unmount();
    await advance(500);
  });
});
