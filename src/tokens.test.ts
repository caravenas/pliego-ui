import { cssVar, tokenNames, typeStyles } from './tokens';

describe('tokens generados', () => {
  it('conserva los nombres de PliegoStack, para que su CSS funcione sin renombrar', () => {
    for (const name of ['color-text-primary', 'color-accent-ink', 'space-4', 'radius-md', 'text-xs', 'transition-fast']) {
      expect(tokenNames).toContain(name);
    }
  });

  it('incluye space-7 y ya no los glass-* sin uso', () => {
    expect(tokenNames).toContain('space-7');
    expect(tokenNames.some((n) => n.startsWith('glass-'))).toBe(false);
  });

  it('no repite nombres', () => {
    expect(new Set(tokenNames).size).toBe(tokenNames.length);
  });

  it('cssVar devuelve la variable', () => {
    expect(cssVar('color-text-primary')).toBe('var(--color-text-primary)');
  });

  it('expone los estilos de texto', () => {
    expect(typeStyles).toContain('form-label');
  });
});
