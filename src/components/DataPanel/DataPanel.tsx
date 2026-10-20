import {
  Children,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { Notice } from '../Notice/Notice';
import './DataPanel.css';

export type DataPanelStatus = 'ready' | 'loading' | 'error';

export interface DataPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** En minúsculas; las versalitas las pone CSS. Es un `h2` y nombra la región. */
  title: string;
  /** Lo decide quien carga los datos: el panel muestra el estado que recibe. */
  status: DataPanelStatus;
  /** Qué falló, escrito por el consumidor: «el banco no respondió». */
  error?: string;
  /** Sin él no hay botón de reintentar. Se llama una vez por error, aunque se pulse dos. */
  onRetry?: () => void;
  retryLabel?: string;
  loadingLabel?: string;
  /** Lo que se escribe sobre los datos anteriores mientras llegan los nuevos. */
  staleLabel?: string;
  /** Lo que se escribe sobre los datos anteriores cuando no se pudieron actualizar. */
  staleErrorLabel?: string;
  /** El error cuando no hay datos y el consumidor no escribió `error`. */
  loadErrorLabel?: string;
  /** Los datos. Vacío, el panel no tiene nada anterior que mostrar. */
  children?: ReactNode;
}

/**
 * Un panel del sistema (título sin caja) que dice en palabras si está
 * cargando, si falló o si lo que muestra es anterior. Los datos anteriores no
 * se ocultan ni se atenúan: se quedan legibles y marcados, para que ninguna
 * cifra vieja pase por vigente y nadie pierda lo que estaba leyendo.
 *
 * Se anuncia por una región de estado que existe siempre, porque una región
 * viva que aparece con su texto no siempre se lee. Solo el error sin datos,
 * que deja el panel sin nada, se anuncia al momento.
 */
export const DataPanel = forwardRef<HTMLElement, DataPanelProps>(function DataPanel(
  {
    title,
    status,
    error,
    onRetry,
    retryLabel = 'reintentar',
    loadingLabel = 'cargando',
    staleLabel = 'datos anteriores; cargando los nuevos',
    staleErrorLabel = 'no se pudieron actualizar; estos datos son anteriores',
    loadErrorLabel = 'no se pudieron cargar los datos',
    children,
    className,
    ...rest
  },
  ref,
) {
  const titleId = useId();
  const statusId = useId();
  const panel = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => panel.current as HTMLElement);

  const hasData = Children.toArray(children).length > 0;
  const isError = status === 'error';

  // El candado es una ref porque dos clics seguidos llegan antes de que React
  // vuelva a pintar; el estado solo dice al lector que el botón ya actuó.
  const retryLock = useRef(false);
  const [retrying, setRetrying] = useState(false);
  const focusAfterRetry = useRef(false);

  useEffect(() => {
    retryLock.current = false;
    setRetrying(false);
  }, [status, error]);

  useEffect(() => {
    if (!focusAfterRetry.current || status === 'error') return;
    focusAfterRetry.current = false;
    const node = panel.current;
    const active = document.activeElement;
    // El botón ya no está: el foco cayó a body o sigue en el panel. Si quien
    // reintentó se fue a otra parte entretanto, no se le quita el foco.
    if (node && (active === null || active === document.body || node.contains(active))) node.focus();
  }, [status]);

  const retry = () => {
    if (retryLock.current || !onRetry) return;
    retryLock.current = true;
    focusAfterRetry.current = true;
    setRetrying(true);
    onRetry();
  };

  let statusText = '';
  if (status === 'loading') statusText = hasData ? staleLabel : loadingLabel;
  else if (isError && hasData) statusText = error ? `${staleErrorLabel}. ${error}` : staleErrorLabel;
  const marked = hasData && status !== 'ready';

  return (
    <section
      ref={panel}
      aria-labelledby={titleId}
      tabIndex={-1}
      className={cx('pui-data-panel', className)}
      {...rest}
    >
      <h2 id={titleId} className="pui-data-panel__title pui-type-panel-title">
        {title}
      </h2>
      <div
        id={statusId}
        role="status"
        className={cx('pui-data-panel__status pui-type-mono-note', isError && 'pui-data-panel__status--error')}
      >
        {statusText}
      </div>
      {isError && !hasData ? <Notice variant="error">{error ?? loadErrorLabel}</Notice> : null}
      {isError && onRetry ? (
        <Button className="pui-data-panel__retry" aria-disabled={retrying || undefined} onClick={retry}>
          {retryLabel}
        </Button>
      ) : null}
      {hasData ? (
        <div
          className="pui-data-panel__data"
          aria-busy={status === 'loading' || undefined}
          aria-describedby={marked ? statusId : undefined}
        >
          {children}
        </div>
      ) : null}
    </section>
  );
});
