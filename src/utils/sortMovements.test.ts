import { sortMovements } from './sortMovements';

const row = (id: string, amount: unknown, date = '2026-10-01', description = id) => ({ id, date, description, amount: amount as number });
const ids = (rows: readonly { id: string }[]) => rows.map((r) => r.id);

describe('sortMovements', () => {
  it('ordena los importes con negativos y ceros', () => {
    const rows = [row('a', 32), row('b', -600), row('c', 0), row('d', 1500)];
    expect(ids(sortMovements(rows, { column: 'amount', direction: 'ascending' }))).toEqual(['b', 'c', 'a', 'd']);
    expect(ids(sortMovements(rows, { column: 'amount', direction: 'descending' }))).toEqual(['d', 'a', 'c', 'b']);
  });

  it('un importe ausente o no finito va al final en las dos direcciones', () => {
    const rows = [row('u', undefined), row('a', 5), row('n', null), row('x', NaN), row('b', 1), row('i', Infinity)];
    expect(ids(sortMovements(rows, { column: 'amount', direction: 'ascending' }))).toEqual(['b', 'a', 'u', 'n', 'x', 'i']);
    expect(ids(sortMovements(rows, { column: 'amount', direction: 'descending' }))).toEqual(['a', 'b', 'u', 'n', 'x', 'i']);
  });

  it('una fecha vacía o inválida va al final en las dos direcciones', () => {
    const rows = [row('e', 1, ''), row('b', 1, '2026-10-05'), row('f', 1, '2026-02-31'), row('h', 1, 'hoy'), row('a', 1, '2026-10-01')];
    expect(ids(sortMovements(rows, { column: 'date', direction: 'ascending' }))).toEqual(['a', 'b', 'e', 'f', 'h']);
    expect(ids(sortMovements(rows, { column: 'date', direction: 'descending' }))).toEqual(['b', 'a', 'e', 'f', 'h']);
  });

  it('una fecha con hora mal formada va al final en las dos direcciones, como una fecha inválida', () => {
    const rows = [row('h', 1, '2026-10-01T25:00'), row('n', 1, '2026-10-01Tnada'), row('t', 1, '2026-10-01T'), row('b', 1, '2026-10-05'), row('a', 1, '2026-10-03')];
    expect(ids(sortMovements(rows, { column: 'date', direction: 'ascending' }))).toEqual(['a', 'b', 'h', 'n', 't']);
    expect(ids(sortMovements(rows, { column: 'date', direction: 'descending' }))).toEqual(['b', 'a', 'h', 'n', 't']);
  });

  it('una fecha con hora válida sigue ordenando por su instante, con o sin zona', () => {
    // Con zona explícita el instante no depende de la zona de quien corre la prueba.
    const rows = [row('c', 1, '2026-10-01T10:30:00Z'), row('d', 1, '2026-10-01T09:00:00Z'), row('g', 1, '2026-10-01T10:30:00+02:00'), row('f', 1, '2026-10-01')];
    expect(ids(sortMovements(rows, { column: 'date', direction: 'ascending' }))).toEqual(['f', 'g', 'd', 'c']);
    // Sin zona vale la hora local: solo se comprueba que cuenta como fecha y no queda tras una inválida.
    const local = [row('x', 1, '2026-10-01T10:30:00'), row('h', 1, '2026-10-01T25:00')];
    expect(ids(sortMovements(local, { column: 'date', direction: 'ascending' }))).toEqual(['x', 'h']);
    expect(ids(sortMovements(local, { column: 'date', direction: 'descending' }))).toEqual(['x', 'h']);
  });

  it('los empates conservan el orden original también en descendente', () => {
    const rows = [row('a', 5), row('b', 9), row('c', 5), row('d', 5)];
    expect(ids(sortMovements(rows, { column: 'amount', direction: 'ascending' }))).toEqual(['a', 'c', 'd', 'b']);
    expect(ids(sortMovements(rows, { column: 'amount', direction: 'descending' }))).toEqual(['b', 'a', 'c', 'd']);
  });

  it('el concepto se compara con tildes y números, y uno vacío va al final', () => {
    const rows = [
      row('1', 1, '2026-10-01', 'cuota 10'),
      row('2', 1, '2026-10-01', ''),
      row('3', 1, '2026-10-01', 'cuota 2'),
      row('4', 1, '2026-10-01', 'árbol'),
      row('5', 1, '2026-10-01', 'zapato'),
    ];
    expect(ids(sortMovements(rows, { column: 'description', direction: 'ascending' }, 'es'))).toEqual(['4', '3', '1', '5', '2']);
    expect(ids(sortMovements(rows, { column: 'description', direction: 'descending' }, 'es'))).toEqual(['5', '1', '3', '4', '2']);
  });

  it('un locale inválido no lanza', () => {
    const rows = [row('b', 1, '2026-10-01', 'b'), row('a', 1, '2026-10-01', 'a')];
    expect(ids(sortMovements(rows, { column: 'description', direction: 'ascending' }, 'no_es_un_locale'))).toEqual(['a', 'b']);
  });

  it('sin orden devuelve el original, y nunca modifica la entrada', () => {
    const rows = [row('a', 3), row('b', 1)];
    const copy = [...rows];
    expect(ids(sortMovements(rows, null))).toEqual(['a', 'b']);
    sortMovements(rows, { column: 'amount', direction: 'ascending' });
    expect(rows).toEqual(copy);
  });
});
