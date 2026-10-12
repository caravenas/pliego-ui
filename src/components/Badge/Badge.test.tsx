import { render, screen } from '@testing-library/react';
import { Badge, OriginBadge, ORIGIN_LABELS } from './Badge';

describe('Badge', () => {
  it('es outline por defecto', () => {
    render(<Badge>Datos de ejemplo</Badge>);
    expect(screen.getByText('Datos de ejemplo')).toHaveClass('pui-badge', 'pui-badge--outline');
  });

  it('acepta la variante mono', () => {
    render(<Badge variant="mono">config/pliegos.json</Badge>);
    expect(screen.getByText('config/pliegos.json')).toHaveClass('pui-badge--mono');
  });
});

describe('OriginBadge', () => {
  it.each([
    ['factory', 'de fábrica'],
    ['edited', 'editado'],
    ['own', 'tuyo'],
  ] as const)('escribe el origen %s como «%s», legible como texto', (origin, label) => {
    render(<OriginBadge origin={origin} />);
    const badge = screen.getByText(label);
    expect(badge).toHaveAttribute('data-origin', origin);
    expect(badge).toHaveClass('pui-badge--mono');
  });

  it('expone las etiquetas para quien las necesite fuera del componente', () => {
    expect(ORIGIN_LABELS).toEqual({ factory: 'de fábrica', edited: 'editado', own: 'tuyo' });
  });
});
