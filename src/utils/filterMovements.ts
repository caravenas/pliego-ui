interface Row {
  date: string;
  description: string;
}

/** Minúsculas y sin tildes, para que «cafe» encuentre «Café». */
export function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function written(date: string, formatDate?: (date: string) => string): string {
  if (!formatDate) return date;
  try {
    return formatDate(date);
  } catch {
    // Como en la tabla: si el formateador del consumidor falla, la fecha se busca tal cual.
    return date;
  }
}

/**
 * Los movimientos cuyo concepto o fecha escrita contienen el texto, tomado
 * literalmente (nada de expresiones regulares). Un texto vacío o en blanco no filtra.
 */
export function filterMovements<T extends Row>(rows: readonly T[], query: string, formatDate?: (date: string) => string): T[] {
  const q = fold(query.trim());
  if (q === '') return [...rows];
  return rows.filter((row) => fold(`${row.description} ${written(row.date, formatDate)}`).includes(q));
}
