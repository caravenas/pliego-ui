/** Redondea a un número de decimales. */
export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Cuántos decimales tiene un paso, para que ocho pasos de 0,125 no caigan en
 * 1.0000000000000002 y se impriman así.
 */
export function decimalsOf(step: number): number {
  const [, decimals = ''] = String(step).split('.');
  return decimals.length;
}
