import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import type { DataPanelStatus } from '../DataPanel/DataPanel';
import './DashboardStatus.css';

export interface DashboardStatusPanel {
  /** El título del panel tal como lo ve quien lee; es lo que se nombra en el aviso. */
  title: string;
  status: DataPanelStatus;
}

export interface DashboardStatusLabels {
  /** «cargando 4 paneles». */
  loading: (count: number) => string;
  /** «no se pudieron cargar: saldo, movimientos»; recibe los títulos ya unidos. */
  failed: (titles: string) => string;
}

const DEFAULT_LABELS: DashboardStatusLabels = {
  loading: (count) => (count === 1 ? 'cargando 1 panel' : `cargando ${count} paneles`),
  failed: (titles) => `no se pudieron cargar: ${titles}`,
};

export interface DashboardStatusProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  panels: readonly DashboardStatusPanel[];
  labels?: Partial<DashboardStatusLabels>;
  /** Cuánto se espera para juntar los paneles que cambian a la vez. */
  settleMs?: number;
}

/** Los paneles que cambian en el mismo instante comparten un aviso. */
const SETTLE_MS = 250;

interface Keyed extends DashboardStatusPanel {
  /** Título y número de aparición: dos paneles con el mismo título siguen siendo dos. */
  key: string;
}

function keyPanels(panels: readonly DashboardStatusPanel[]): Keyed[] {
  const seen = new Map<string, number>();
  return panels.map((panel) => {
    const n = (seen.get(panel.title) ?? 0) + 1;
    seen.set(panel.title, n);
    return { ...panel, key: `${panel.title}#${n}` };
  });
}

/**
 * El único anunciador de una pantalla con varios paneles. Cada `DataPanel` va
 * con `announce={false}` y esta pieza habla por todos con dos regiones ocultas
 * y montadas desde el principio: una `status` para la carga y una `alert` para
 * los errores.
 *
 * - Cargar se anuncia una vez («cargando 4 paneles») y no se repite mientras
 *   quede alguno cargando; que los demás terminen no lo reescribe.
 * - Fallar se anuncia una vez por tanda, en el orden en que se ven, sin esperar
 *   a que terminen los lentos: un error no debe quedar callado tras una carga.
 * - Terminar bien no anuncia nada.
 */
export const DashboardStatus = forwardRef<HTMLDivElement, DashboardStatusProps>(function DashboardStatus(
  { panels, labels, settleMs = SETTLE_MS, className, ...rest },
  ref,
) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [loadingText, setLoadingText] = useState('');
  const [errorText, setErrorText] = useState('');

  const keyed = keyPanels(panels);
  const signature = keyed.map((p) => `${p.key}:${p.status}`).join('|');

  // Lo último que se vio y las etiquetas, para que los temporizadores no lean un render viejo.
  const latest = useRef(keyed);
  latest.current = keyed;
  const labelsRef = useRef(text);
  labelsRef.current = text;

  const loadingActive = useRef(false);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const announced = useRef(new Set<string>());

  useEffect(() => {
    const current = latest.current;
    const loading = current.filter((p) => p.status === 'loading');
    const failed = current.filter((p) => p.status === 'error');

    if (loading.length === 0) {
      loadingActive.current = false;
      if (loadTimer.current) clearTimeout(loadTimer.current);
      loadTimer.current = null;
      setLoadingText('');
    } else if (!loadingActive.current && !loadTimer.current) {
      loadTimer.current = setTimeout(() => {
        loadTimer.current = null;
        const count = latest.current.filter((p) => p.status === 'loading').length;
        if (count === 0) return;
        loadingActive.current = true;
        setLoadingText(labelsRef.current.loading(count));
      }, settleMs);
    }

    // Un panel que dejó de fallar puede volver a anunciarse si falla de nuevo.
    for (const key of [...announced.current]) {
      if (!failed.some((p) => p.key === key)) announced.current.delete(key);
    }
    if (failed.length === 0) setErrorText('');
    if (failed.some((p) => !announced.current.has(p.key)) && !failTimer.current) {
      failTimer.current = setTimeout(() => {
        failTimer.current = null;
        const fresh = latest.current.filter((p) => p.status === 'error' && !announced.current.has(p.key));
        if (fresh.length === 0) return;
        for (const p of fresh) announced.current.add(p.key);
        setErrorText(labelsRef.current.failed(fresh.map((p) => p.title).join(', ')));
      }, settleMs);
    }
    // `signature` resume lo que importa de `panels`: un array nuevo con lo mismo no reinicia nada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, settleMs]);

  useEffect(
    () => () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
      if (failTimer.current) clearTimeout(failTimer.current);
    },
    [],
  );

  return (
    <div ref={ref} className={cx('pui-dashboard-status', className)} {...rest}>
      <div role="status" className="pui-dashboard-status__region">
        {loadingText}
      </div>
      <div role="alert" className="pui-dashboard-status__region">
        {errorText}
      </div>
    </div>
  );
});
