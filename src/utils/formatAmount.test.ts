import { formatAmount, formatSigned } from './formatAmount';

describe('formatAmount', () => {
  it('formatea con la moneda y el idioma recibidos', () => {
    expect(formatSigned(1234.5, 'USD', 'en-US')).toBe('$1,234.50');
    expect(formatSigned(1234, 'CLP', 'es-CL')).toMatch(/^\$\s?1\.234$/);
  });

  it('un valor que no es un número finito es desconocido, nunca 0', () => {
    for (const value of [undefined, null, NaN, Infinity, -Infinity, '12.5', {}, []]) {
      expect(formatAmount(value, 'USD', 'en-US')).toEqual({ kind: 'unknown' });
    }
  });

  it('un negativo lleva el signo escrito y -0,001 no es «−0,00»', () => {
    expect(formatSigned(-12.5, 'USD', 'en-US')).toBe('−$12.50');
    expect(formatAmount(-0.001, 'USD', 'en-US')).toMatchObject({ sign: 'zero' });
    expect(formatSigned(-0.001, 'USD', 'en-US')).toBe('$0.00');
    expect(formatAmount(-0, 'USD', 'en-US')).toMatchObject({ sign: 'zero' });
  });

  it('una moneda inválida no lanza: escribe la cifra y el código recibido', () => {
    expect(() => formatAmount(5, 'XX', 'en-US')).not.toThrow();
    expect(formatSigned(5, 'XX', 'en-US')).toBe('5 XX');
    expect(formatSigned(5, '', 'en-US')).toBe('5');
  });

  it('un idioma inválido no lanza: usa el del entorno', () => {
    expect(() => formatAmount(5, 'USD', 'no es un idioma')).not.toThrow();
    expect(formatAmount(5, 'USD', 'no es un idioma')).toMatchObject({ kind: 'known', sign: 'positive' });
  });
});
