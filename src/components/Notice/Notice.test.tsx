import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { Notice, type NoticeVariant } from './Notice';

describe('Notice', () => {
  it.each<[NoticeVariant, 'status' | 'alert']>([
    ['note', 'status'],
    ['preview', 'status'],
    ['error', 'alert'],
    ['config', 'alert'],
  ])('la variante %s lleva role="%s" y su clase', (variant, role) => {
    render(<Notice variant={variant}>texto</Notice>);
    const notice = screen.getByRole(role);
    expect(notice).toHaveTextContent('texto');
    expect(notice).toHaveClass('pui-notice', `pui-notice--${variant}`);
  });

  it('el título es una línea antes del texto y no un encabezado', () => {
    render(
      <Notice variant="config" title="La configuración no es válida">
        <ul>
          <li>falta el calibre</li>
        </ul>
      </Notice>,
    );
    expect(screen.getByText('La configuración no es válida').tagName).toBe('P');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveTextContent('falta el calibre');
  });

  it('sin título no pinta nodo de título', () => {
    const { container } = render(<Notice variant="note">x</Notice>);
    expect(container.querySelector('.pui-notice__title')).toBeNull();
  });

  it('reenvía la ref y deja pasar las props nativas, también un role distinto', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Notice ref={ref} variant="note" id="n" role="note">
        x
      </Notice>,
    );
    expect(ref.current).toHaveAttribute('id', 'n');
    expect(ref.current).toHaveAttribute('role', 'note');
  });
});

describe('CSS de Notice', () => {
  const code = readFileSync(resolve(__dirname, 'Notice.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('no tiene colores, tamaños ni radios literales fuera del peso de 1px', () => {
    expect(code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).toEqual([]);
    expect((code.match(/-?\d*\.?\d+(?:px|rem|em)\b/g) ?? []).filter((size) => size !== '1px')).toEqual([]);
    expect(code).not.toMatch(/border-radius:\s*\d/);
  });

  it('el borde del error se deriva de color-danger-foreground', () => {
    expect(code).toMatch(/\.pui-notice--error\s*\{[^}]*border:[^;]*color-mix\([^;]*var\(--color-danger-foreground\)/);
  });
});
