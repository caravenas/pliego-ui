import { StrictMode, type ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { usePanelData } from './usePanelData';

/** Una petición que el test resuelve o rechaza cuando quiere. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

type Call = { key: string; signal: AbortSignal; request: ReturnType<typeof deferred<string>> };

function setup(initialKey = 'a') {
  const calls: Call[] = [];
  const load = vi.fn((key: string, signal: AbortSignal) => {
    const request = deferred<string>();
    calls.push({ key, signal, request });
    return request.promise;
  });
  const renders: { key: string; status: string; data: string | undefined; dataKey: string | undefined }[] = [];
  const view = renderHook(
    ({ key }: { key: string }) => {
      const result = usePanelData(key, load);
      renders.push({ key, status: result.status, data: result.data, dataKey: result.dataKey });
      return result;
    },
    { initialProps: { key: initialKey } },
  );
  return { calls, load, renders, ...view };
}

const settle = async (fn: () => void) => {
  await act(async () => {
    fn();
  });
};

describe('usePanelData · estados', () => {
  it('empieza en loading sin datos, pasa a ready con los datos y su clave', async () => {
    const { result, calls } = setup();
    expect(result.current).toMatchObject({ status: 'loading', data: undefined, dataKey: undefined });
    await settle(() => calls[0].request.resolve('datos a'));
    expect(result.current).toMatchObject({ status: 'ready', data: 'datos a', dataKey: 'a' });
  });

  it('un rechazo sin datos previos da error y guarda lo que falló', async () => {
    const { result, calls } = setup();
    const failure = new Error('sin red');
    await settle(() => calls[0].request.reject(failure));
    expect(result.current).toMatchObject({ status: 'error', data: undefined, error: failure });
  });

  it('un rechazo que no es un Error también es un error', async () => {
    const { result, calls } = setup();
    await settle(() => calls[0].request.reject('texto suelto'));
    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('texto suelto');
  });

  it('un load que lanza sin ser asíncrono da error y no rompe el render', async () => {
    const load = vi.fn((): Promise<string> => {
      throw new Error('boom');
    });
    const { result } = renderHook(() => usePanelData('a', load));
    await act(async () => {});
    expect(result.current.status).toBe('error');
    expect((result.current.error as Error).message).toBe('boom');
  });
});

describe('usePanelData · cambio de clave', () => {
  it('en el render en que cambia la clave el estado ya es loading y nunca junta clave nueva, ready y datos viejos', async () => {
    const { calls, renders, rerender } = setup('a');
    await settle(() => calls[0].request.resolve('datos a'));
    rerender({ key: 'b' });
    await settle(() => calls[1].request.resolve('datos b'));
    const lie = renders.filter((r) => r.status === 'ready' && r.dataKey !== r.key);
    expect(lie).toEqual([]);
    const first = renders.find((r) => r.key === 'b');
    expect(first).toMatchObject({ status: 'loading', data: 'datos a', dataKey: 'a' });
  });

  it('mientras carga la clave nueva conserva los datos anteriores con su clave', async () => {
    const { result, calls, rerender } = setup('a');
    await settle(() => calls[0].request.resolve('datos a'));
    rerender({ key: 'b' });
    expect(result.current).toMatchObject({ status: 'loading', data: 'datos a', dataKey: 'a' });
  });

  it('una respuesta tardía de una clave anterior, buena, no pisa a la actual', async () => {
    const { result, calls, rerender } = setup('a');
    rerender({ key: 'b' });
    await settle(() => calls[1].request.resolve('datos b'));
    await settle(() => calls[0].request.resolve('datos a, tarde'));
    expect(result.current).toMatchObject({ status: 'ready', data: 'datos b', dataKey: 'b' });
  });

  it('una respuesta tardía de una clave anterior, mala, no marca error en la actual', async () => {
    const { result, calls, rerender } = setup('a');
    rerender({ key: 'b' });
    await settle(() => calls[1].request.resolve('datos b'));
    await settle(() => calls[0].request.reject(new Error('tarde')));
    expect(result.current).toMatchObject({ status: 'ready', data: 'datos b', error: undefined });
  });

  it('a→b→c seguidos dejan solo c y abortan las señales de a y b', async () => {
    const { result, calls, rerender } = setup('a');
    rerender({ key: 'b' });
    rerender({ key: 'c' });
    expect(calls.map((c) => c.signal.aborted)).toEqual([true, true, false]);
    await settle(() => calls[2].request.resolve('datos c'));
    await settle(() => calls[1].request.resolve('datos b'));
    await settle(() => calls[0].request.resolve('datos a'));
    expect(result.current).toMatchObject({ status: 'ready', data: 'datos c', dataKey: 'c' });
  });

  it('volver a una clave ya vista la vuelve a pedir: no hay caché', async () => {
    const { calls, rerender } = setup('a');
    await settle(() => calls[0].request.resolve('datos a'));
    rerender({ key: 'b' });
    await settle(() => calls[1].request.resolve('datos b'));
    rerender({ key: 'a' });
    expect(calls.map((c) => c.key)).toEqual(['a', 'b', 'a']);
  });

  it('repintar con la misma clave no vuelve a pedir', async () => {
    const { load, rerender } = setup('a');
    rerender({ key: 'a' });
    rerender({ key: 'a' });
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('una clave que no existe (el load la rechaza) da error con los datos anteriores marcados', async () => {
    const { result, calls, rerender } = setup('a');
    await settle(() => calls[0].request.resolve('datos a'));
    rerender({ key: 'nope' });
    await settle(() => calls[1].request.reject(new Error('periodo desconocido')));
    expect(result.current).toMatchObject({ status: 'error', data: 'datos a', dataKey: 'a' });
  });

  it('un error en la clave nueva conserva los datos y no los borra', async () => {
    const { result, calls, rerender } = setup('a');
    await settle(() => calls[0].request.resolve('datos a'));
    rerender({ key: 'b' });
    await settle(() => calls[1].request.reject(new Error('x')));
    expect(result.current.data).toBe('datos a');
    expect(result.current.dataKey).toBe('a');
  });
});

describe('usePanelData · reintentar y desmontar', () => {
  it('retry vuelve a pedir la clave actual y deja el panel en loading con los datos anteriores', async () => {
    const { result, calls, rerender } = setup('a');
    await settle(() => calls[0].request.resolve('datos a'));
    rerender({ key: 'b' });
    await settle(() => calls[1].request.reject(new Error('x')));
    await settle(() => result.current.retry());
    expect(calls.map((c) => c.key)).toEqual(['a', 'b', 'b']);
    expect(result.current).toMatchObject({ status: 'loading', data: 'datos a' });
    await settle(() => calls[2].request.resolve('datos b'));
    expect(result.current).toMatchObject({ status: 'ready', data: 'datos b', dataKey: 'b' });
  });

  it('retry dos veces seguidas pide una sola vez', async () => {
    const { result, calls, load } = setup('a');
    await settle(() => calls[0].request.reject(new Error('x')));
    await settle(() => {
      result.current.retry();
      result.current.retry();
    });
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('retry vuelve a funcionar tras un nuevo error', async () => {
    const { result, calls, load } = setup('a');
    await settle(() => calls[0].request.reject(new Error('x')));
    await settle(() => result.current.retry());
    await settle(() => calls[1].request.reject(new Error('y')));
    await settle(() => result.current.retry());
    expect(load).toHaveBeenCalledTimes(3);
  });

  it('retry sin error no pide nada', async () => {
    const { result, calls, load } = setup('a');
    await settle(() => calls[0].request.resolve('datos a'));
    await settle(() => result.current.retry());
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('desmontar aborta la petición y una respuesta posterior no escribe estado', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { calls, unmount } = setup('a');
    unmount();
    expect(calls[0].signal.aborted).toBe(true);
    await settle(() => calls[0].request.resolve('tarde'));
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('bajo StrictMode la primera petición se aborta y la segunda manda', async () => {
    const calls: Call[] = [];
    const load = (key: string, signal: AbortSignal) => {
      const request = deferred<string>();
      calls.push({ key, signal, request });
      return request.promise;
    };
    const wrapper = ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>;
    const { result } = renderHook(() => usePanelData('a', load), { wrapper });
    const live = calls.filter((c) => !c.signal.aborted);
    expect(live).toHaveLength(1);
    await settle(() => live[0].request.resolve('datos a'));
    expect(result.current.status).toBe('ready');
  });
});
