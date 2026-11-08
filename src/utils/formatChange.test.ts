import { formatChange, type ChangeParts } from './formatChange';

const usd = (current: unknown, previous: unknown) => formatChange(current, previous, 'USD', 'en-US');

const texts = (parts: ChangeParts) => JSON.stringify(parts);

describe('formatChange', () => {
  it('escribe la dirección, la diferencia sin signo y el porcentaje sin signo', () => {
    expect(usd(1240, 1000)).toEqual({ kind: 'change', direction: 'up', difference: '$240.00', percent: '24.0%', lessThan: false });
    expect(usd(750, 1000)).toEqual({ kind: 'change', direction: 'down', difference: '$250.00', percent: '25.0%', lessThan: false });
  });

  it('con un anterior en 0 escribe la diferencia y no el porcentaje', () => {
    expect(usd(50, 0)).toEqual({ kind: 'change', direction: 'up', difference: '$50.00', percent: null, lessThan: false });
    expect(usd(-50, 0)).toMatchObject({ direction: 'down', percent: null });
  });

  it('un anterior que redondea a 0 cuenta como 0 y no da un porcentaje enorme', () => {
    expect(usd(50, 0.001)).toMatchObject({ direction: 'up', percent: null });
  });

  it('con una base negativa la dirección sigue a la diferencia y el porcentaje es sobre su valor absoluto', () => {
    expect(usd(-100, -200)).toEqual({ kind: 'change', direction: 'up', difference: '$100.00', percent: '50.0%', lessThan: false });
    expect(usd(-300, -200)).toMatchObject({ direction: 'down', percent: '50.0%' });
    expect(usd(50, -100)).toMatchObject({ direction: 'up', difference: '$150.00', percent: '150.0%' });
  });

  it.each([undefined, null, NaN, Infinity, -Infinity, '100'])('sin anterior válido (%s) no hay variación', (previous) => {
    expect(usd(100, previous)).toEqual({ kind: 'no-previous' });
  });

  it.each([undefined, null, NaN, Infinity, '100'])('con el valor actual desconocido (%s) no hay variación', (current) => {
    expect(usd(current, 100)).toEqual({ kind: 'no-current' });
  });

  it('una diferencia que redondea a cero es «sin cambio», aunque los flotantes no den 0', () => {
    expect(0.1 + 0.2 - 0.3).not.toBe(0);
    expect(usd(0.1 + 0.2, 0.3)).toEqual({ kind: 'flat' });
    expect(usd(100.004, 100)).toEqual({ kind: 'flat' });
    expect(usd(100, 100)).toEqual({ kind: 'flat' });
  });

  it('un porcentaje que redondea a 0,0 con una diferencia real se escribe como «menos de 0,1 %»', () => {
    expect(usd(1_000_010, 1_000_000)).toEqual({ kind: 'change', direction: 'up', difference: '$10.00', percent: '0.1%', lessThan: true });
  });

  it('un porcentaje que no sale finito se omite', () => {
    expect(usd(Number.MAX_VALUE, 0.01)).toMatchObject({ kind: 'change', direction: 'up', percent: null });
  });

  it('una diferencia que no cabe en un número no se compara', () => {
    expect(usd(Number.MAX_VALUE, -Number.MAX_VALUE)).toEqual({ kind: 'incomparable' });
  });

  it('el porcentaje sigue al idioma y uno inválido no lanza', () => {
    expect(formatChange(1240, 1000, 'EUR', 'es-ES')).toMatchObject({ percent: expect.stringMatching(/^24,0\s%$/) });
    expect(() => formatChange(1240, 1000, 'EUR', 'no_es_un_idioma')).not.toThrow();
  });

  it('ninguna salida escribe Infinity, NaN ni un menos', () => {
    const cases: [unknown, unknown][] = [
      [50, 0], [0, 50], [-100, -200], [100, NaN], [NaN, 100], [0.1 + 0.2, 0.3], [-0.001, 0], [1e308, -1e308], [5, 1e-320],
    ];
    for (const [current, previous] of cases) {
      expect(texts(usd(current, previous))).not.toMatch(/Infinity|NaN|−|-\$/);
    }
  });
});
