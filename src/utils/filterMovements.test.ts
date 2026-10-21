import { filterMovements } from './filterMovements';

const rows = [
  { id: '1', date: '2026-10-01', description: 'Café con leche', amount: 3 },
  { id: '2', date: '2026-10-03', description: 'arriendo (octubre)', amount: -600 },
  { id: '3', date: '2026-11-02', description: 'sueldo', amount: 1500 },
];
const ids = (r: readonly { id: string }[]) => r.map((x) => x.id);

describe('filterMovements', () => {
  it('no distingue mayúsculas ni tildes', () => {
    expect(ids(filterMovements(rows, 'cafe'))).toEqual(['1']);
    expect(ids(filterMovements(rows, 'CAFÉ'))).toEqual(['1']);
  });
  it('ignora los espacios de los extremos y un texto en blanco no filtra', () => {
    expect(ids(filterMovements(rows, '  sueldo  '))).toEqual(['3']);
    expect(ids(filterMovements(rows, '   '))).toEqual(['1', '2', '3']);
    expect(ids(filterMovements(rows, ''))).toEqual(['1', '2', '3']);
  });
  it('toma los caracteres de expresión regular literalmente', () => {
    expect(ids(filterMovements(rows, '(octubre)'))).toEqual(['2']);
    expect(ids(filterMovements(rows, '.*'))).toEqual([]);
    expect(ids(filterMovements(rows, '('))).toEqual(['2']);
  });
  it('busca también en la fecha tal como se escribe', () => {
    expect(ids(filterMovements(rows, '2026-11'))).toEqual(['3']);
    expect(ids(filterMovements(rows, '03 oct', (d) => `${d.slice(-2)} oct`))).toEqual(['2']);
    expect(ids(filterMovements(rows, '2026-11', () => 'noviembre'))).toEqual([]);
  });
  it('un formateador de fecha que lanza no se lleva el filtro', () => {
    expect(ids(filterMovements(rows, 'sueldo', () => { throw new Error('boom'); }))).toEqual(['3']);
  });
  it('cero resultados devuelve una lista vacía', () => {
    expect(filterMovements(rows, 'zzz')).toEqual([]);
  });
});
