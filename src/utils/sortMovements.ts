export type SortColumn = 'date' | 'description' | 'amount';
export type SortDirection = 'ascending' | 'descending';
export interface Sort {
  column: SortColumn;
  direction: SortDirection;
}
interface Row {
  date: string;
  description: string;
  amount: number | null | undefined;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/;

/** Los milisegundos de una fecha ISO real, o `null`: `2026-02-31` y «hoy» no son fechas. */
function dateKey(date: string): number | null {
  const match = ISO_DATE.exec(date);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const day = new Date(Date.UTC(y, m - 1, d));
  // Date.UTC desborda en silencio (31 de febrero pasa a marzo): se comprueba que el día sobrevive.
  if (day.getUTCFullYear() !== y || day.getUTCMonth() !== m - 1 || day.getUTCDate() !== d) return null;
  const time = Date.parse(date);
  if (Number.isFinite(time)) return time;
  // Una fecha con parte de hora que Date.parse no entiende (`T25:00`, `Tnada`) no es una fecha válida:
  // solo una fecha sin hora cae a su día.
  return date.includes('T') ? null : day.getTime();
}

function collatorFor(locale: string | undefined): Intl.Collator {
  try {
    return new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  } catch {
    // Un idioma mal escrito no debe tumbar la tabla: se usa el del entorno.
    return new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  }
}

/**
 * Ordena sin modificar la entrada. Lo desconocido (importe ausente o no finito,
 * fecha que no existe, concepto vacío) va siempre al final, en las dos
 * direcciones, y los empates conservan el orden original: invertir el sentido
 * no invierte a los iguales.
 */
export function sortMovements<T extends Row>(rows: readonly T[], sort: Sort | null, locale?: string): T[] {
  if (!sort) return [...rows];
  const sign = sort.direction === 'ascending' ? 1 : -1;
  const collator = collatorFor(locale);
  const keyed = rows.map((row, index) => {
    let key: number | string | null;
    if (sort.column === 'amount') key = typeof row.amount === 'number' && Number.isFinite(row.amount) ? row.amount : null;
    else if (sort.column === 'date') key = dateKey(row.date);
    else key = row.description.trim() === '' ? null : row.description;
    return { row, index, key };
  });
  keyed.sort((a, b) => {
    if (a.key === null || b.key === null) {
      if (a.key === b.key) return a.index - b.index;
      return a.key === null ? 1 : -1;
    }
    const order = typeof a.key === 'number' ? a.key - (b.key as number) : collator.compare(a.key, b.key as string);
    return order === 0 ? a.index - b.index : sign * order;
  });
  return keyed.map((k) => k.row);
}
