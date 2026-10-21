import { useCallback, useEffect, useRef, useState } from 'react';
import type { DataPanelStatus } from '../components/DataPanel/DataPanel';

export interface PanelData<K, T> {
  status: DataPanelStatus;
  /** El último dato que llegó, aunque sea de otra clave. Nunca se borra por un error. */
  data: T | undefined;
  /** La clave a la que pertenece `data`: lo que permite escribir «datos de 30 días». */
  dataKey: K | undefined;
  /** Lo que rechazó la última petición de la clave actual; el consumidor lo escribe en palabras. */
  error: unknown;
  /** Vuelve a pedir la clave actual, una sola vez por error. */
  retry: () => void;
}

interface State<K, T> {
  key: K;
  outcome: DataPanelStatus;
  data: T | undefined;
  dataKey: K | undefined;
  error: unknown;
}

/**
 * Carga los datos de un panel para una clave (el periodo) y se queda solo con
 * la respuesta de la última. Una respuesta tardía de una clave anterior, buena
 * o mala, se descarta, y su señal se aborta al cambiar de clave y al desmontar.
 *
 * El estado se deriva en el render en que cambia la clave, no en un efecto: no
 * existe un fotograma con la clave nueva, `ready` y los datos de la anterior,
 * que es por donde una cifra vieja pasaría por vigente.
 */
export function usePanelData<K, T>(
  key: K,
  load: (key: K, signal: AbortSignal) => Promise<T>,
): PanelData<K, T> {
  const [state, setState] = useState<State<K, T>>({
    key,
    outcome: 'loading',
    data: undefined,
    dataKey: undefined,
    error: undefined,
  });
  const [attempt, setAttempt] = useState(0);

  // `load` suele ser una función nueva en cada render; la petición no debe repetirse por eso.
  const loadRef = useRef(load);
  loadRef.current = load;

  // Una ref y no estado: dos llamadas seguidas llegan antes de que React vuelva a pintar.
  const retryLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    retryLock.current = false;
    setState((prev) => (prev.key === key && prev.outcome === 'loading' ? prev : { ...prev, key, outcome: 'loading', error: undefined }));

    let request: Promise<T>;
    try {
      request = loadRef.current(key, controller.signal);
    } catch (thrown) {
      request = Promise.reject(thrown);
    }
    request.then(
      (data) => {
        if (controller.signal.aborted) return;
        setState({ key, outcome: 'ready', data, dataKey: key, error: undefined });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        retryLock.current = false;
        setState((prev) => ({ ...prev, key, outcome: 'error', error }));
      },
    );
    return () => controller.abort();
  }, [key, attempt]);

  // Solo hay algo que reintentar tras un error de la clave actual.
  const canRetry = useRef(false);

  const retry = useCallback(() => {
    if (retryLock.current || !canRetry.current) return;
    retryLock.current = true;
    setAttempt((n) => n + 1);
  }, []);

  // Con otra clave que la del estado guardado, todavía no hay nada vigente.
  const current = Object.is(state.key, key);
  const status = current ? state.outcome : 'loading';
  canRetry.current = status === 'error';
  return {
    status,
    data: state.data,
    dataKey: state.dataKey,
    error: current ? state.error : undefined,
    retry,
  };
}
