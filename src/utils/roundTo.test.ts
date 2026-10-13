import { decimalsOf, roundTo } from './roundTo';

describe('roundTo', () => {
  it('redondea al número de decimales pedido', () => {
    expect(roundTo(1.23456, 2)).toBe(1.23);
    expect(roundTo(1.005, 0)).toBe(1);
    expect(roundTo(0.1 + 0.2, 1)).toBe(0.3);
  });
});

describe('decimalsOf', () => {
  it('cuenta los decimales del paso', () => {
    expect(decimalsOf(1)).toBe(0);
    expect(decimalsOf(0.5)).toBe(1);
    expect(decimalsOf(0.125)).toBe(3);
  });

  it('evita el ruido de coma flotante al acumular pasos', () => {
    const step = 0.125;
    expect(roundTo(8 * step + 0.0000000000000002, decimalsOf(step))).toBe(1);
  });
});
