import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataPanel, type DataPanelProps } from './DataPanel';

const data = <p>saldo 1.240</p>;

function panel(props: Partial<DataPanelProps>) {
  return <DataPanel title="saldo" status="ready" {...props} />;
}

const statusRegion = () => screen.getByRole('status');
const dataBox = (container: HTMLElement) => container.querySelector<HTMLElement>('.pui-data-panel__data');

describe('DataPanel · qué muestra cada estado', () => {
  it('es una región con un h2 por título', () => {
    render(panel({ children: data }));
    expect(screen.getByRole('region', { name: 'saldo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'saldo' })).toBeInTheDocument();
  });

  it('en ready muestra los datos sin ninguna marca', () => {
    const { container } = render(panel({ children: data }));
    expect(screen.getByText('saldo 1.240')).toBeVisible();
    expect(statusRegion()).toBeEmptyDOMElement();
    expect(dataBox(container)).not.toHaveAttribute('aria-busy');
    expect(dataBox(container)).not.toHaveAttribute('aria-describedby');
  });

  it('cargando sin datos solo dice «cargando»', () => {
    const { container } = render(panel({ status: 'loading' }));
    expect(statusRegion()).toHaveTextContent(/^cargando$/);
    expect(dataBox(container)).toBeNull();
  });

  it('cargando con datos los deja visibles, ocupados y marcados como anteriores', () => {
    const { container } = render(panel({ status: 'loading', children: data }));
    expect(screen.getByText('saldo 1.240')).toBeVisible();
    expect(statusRegion()).toHaveTextContent('datos anteriores; cargando los nuevos');
    const box = dataBox(container)!;
    expect(box).toHaveAttribute('aria-busy', 'true');
    expect(box.getAttribute('aria-describedby')).toBe(statusRegion().id);
  });

  it('con error y sin datos escribe el error y ofrece reintentar', () => {
    render(panel({ status: 'error', error: 'el banco no respondió', onRetry: () => {} }));
    expect(screen.getByRole('alert')).toHaveTextContent('el banco no respondió');
    expect(screen.getByRole('button', { name: 'reintentar' })).toBeInTheDocument();
  });

  it('con error y con datos los deja visibles con su marca y el error', () => {
    const { container } = render(panel({ status: 'error', error: 'el banco no respondió', onRetry: () => {}, children: data }));
    expect(screen.getByText('saldo 1.240')).toBeVisible();
    expect(statusRegion()).toHaveTextContent('no se pudieron actualizar; estos datos son anteriores. el banco no respondió');
    expect(dataBox(container)!.getAttribute('aria-describedby')).toBe(statusRegion().id);
    expect(dataBox(container)).not.toHaveAttribute('aria-busy');
    expect(screen.getByRole('button', { name: 'reintentar' })).toBeInTheDocument();
  });

  it('sin onRetry no hay botón, y los textos se pueden traducir', () => {
    render(panel({ status: 'loading', loadingLabel: 'loading' }));
    expect(statusRegion()).toHaveTextContent('loading');
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('DataPanel · qué se anuncia', () => {
  it('la región de estado existe desde el primer render y en todos los estados, siempre la misma', () => {
    const { rerender } = render(panel({ children: data }));
    const region = statusRegion();
    for (const status of ['loading', 'error', 'ready'] as const) {
      rerender(panel({ status, error: 'falló', children: data }));
      expect(statusRegion()).toBe(region);
    }
    rerender(panel({ status: 'error', error: 'falló' }));
    expect(statusRegion()).toBe(region);
  });

  it('role="alert" solo aparece en el error sin datos', () => {
    const { rerender } = render(panel({ status: 'loading' }));
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(panel({ status: 'error', error: 'falló', children: data }));
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(panel({ status: 'error', error: 'falló' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(panel({ status: 'ready', children: data }));
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('DataPanel · dónde queda el foco', () => {
  it('un cambio de estado que viene de fuera no mueve el foco', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <button type="button">30 días</button>
        {panel({ children: data })}
      </>,
    );
    await user.tab();
    const outside = screen.getByRole('button', { name: '30 días' });
    expect(outside).toHaveFocus();
    for (const status of ['loading', 'error', 'ready'] as const) {
      rerender(
        <>
          <button type="button">30 días</button>
          {panel({ status, error: 'falló', onRetry: () => {} })}
        </>,
      );
      expect(outside).toHaveFocus();
    }
  });

  it('al reintentar, el foco pasa al panel y no cae a body', async () => {
    const user = userEvent.setup();
    const { rerender } = render(panel({ status: 'error', error: 'falló', onRetry: () => rerenderLoading() }));
    const rerenderLoading = () => rerender(panel({ status: 'loading' }));
    await user.click(screen.getByRole('button', { name: 'reintentar' }));
    expect(screen.getByRole('region', { name: 'saldo' })).toHaveFocus();
    expect(document.body).not.toHaveFocus();
  });

  it('también con datos anteriores', async () => {
    const user = userEvent.setup();
    const { rerender } = render(panel({ status: 'error', error: 'falló', onRetry: () => rerender(panel({ status: 'loading', children: data })), children: data }));
    await user.click(screen.getByRole('button', { name: 'reintentar' }));
    expect(screen.getByRole('region', { name: 'saldo' })).toHaveFocus();
  });
});

describe('DataPanel · reintentar dos veces', () => {
  it('dos activaciones seguidas llaman a onRetry una sola vez', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(panel({ status: 'error', error: 'falló', onRetry }));
    const retry = screen.getByRole('button', { name: 'reintentar' });
    await user.dblClick(retry);
    await user.keyboard('{Enter}');
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(retry).toHaveAttribute('aria-disabled', 'true');
  });

  it('tras un nuevo error el botón vuelve a funcionar', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(panel({ status: 'error', error: 'falló', onRetry }));
    await user.click(screen.getByRole('button', { name: 'reintentar' }));
    rerender(panel({ status: 'loading', onRetry }));
    rerender(panel({ status: 'error', error: 'falló otra vez', onRetry }));
    const retry = screen.getByRole('button', { name: 'reintentar' });
    expect(retry).not.toHaveAttribute('aria-disabled');
    await user.click(retry);
    expect(onRetry).toHaveBeenCalledTimes(2);
  });
});

describe('DataPanel · ref y props', () => {
  it('reenvía la ref y deja pasar las props nativas', () => {
    const ref = createRef<HTMLElement>();
    render(<DataPanel ref={ref} title="saldo" status="ready" data-testid="panel" />);
    expect(ref.current).toBe(screen.getByTestId('panel'));
  });
});

describe('CSS de DataPanel', () => {
  const code = readFileSync(resolve(__dirname, 'DataPanel.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores, tamaños ni radios literales fuera de 2 px del anillo, ni animación, opacidad o acento', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((size) => size !== '2px')).toEqual([]);
    expect(code).not.toMatch(/animation|opacity|color-accent[^-]/);
  });

  it('el foco del panel es el anillo de color-accent-ink en :focus-visible', () => {
    expect(code).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--color-accent-ink\)/);
  });
});
