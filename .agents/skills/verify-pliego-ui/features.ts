// El mapa de funcionalidades: cada una con los títulos de sus stories y, si
// tiene interacción propia, las teclas que vale la pena recorrer. Se escribe a
// mano porque la interacción no sale de los títulos; features.test.ts falla si
// una story nueva queda sin funcionalidad o si el mapa nombra una que no existe.

export interface Feature {
  titles: string[];
  /** Teclas que se pulsan después del recorrido con Tab, desde el primer control. */
  keys?: string[];
  /** Qué mirar al recorrerla: va al informe, para la persona que lo abre. */
  watch?: string;
}

export const FEATURES: Record<string, Feature> = {
  'Controles de formulario': {
    titles: [
      'Primitivos/Button',
      'Primitivos/Input',
      'Primitivos/Select',
      'Patrones/Field',
      'Patrones/MeasureField',
      'Patrones/OptionField',
    ],
    watch: 'foco visible, etiqueta de cada control, estado de error leído en palabras',
  },
  'Selección con flechas': {
    titles: ['Patrones/SegmentedControl'],
    keys: ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'],
    watch: 'las flechas mueven la selección y el foco; Tab sale del grupo',
  },
  'Panel lateral': {
    titles: ['Patrones/Drawer'],
    keys: ['Escape'],
    watch: 'el foco entra al abrir, queda dentro y Escape lo cierra',
  },
  'Avisos y estados': {
    titles: ['Primitivos/Badge', 'Patrones/Notice', 'Patrones/Toast', 'Patrones/HowPanel', 'Patrones/ResultList', 'Patrones/SpecStep'],
    watch: 'el estado se lee en palabras y no solo por color',
  },
  'Cifras': {
    titles: ['Finanzas/Amount', 'Finanzas/Metric'],
    watch: 'signo, moneda y color: abonos cian, cargos magenta, y además en palabras',
  },
  'Tabla de movimientos': {
    titles: ['Finanzas/MovementsTable'],
    // Sin teclas propias: las teclas se pulsan sobre el primer control, que aquí
    // es el filtro, y el orden está en los encabezados. Se recorre con Tab.
    watch: 'orden y filtro con teclado; el encabezado ordenado se anuncia (aria-sort en aria.yml)',
  },
  'Gráficos': {
    titles: ['Finanzas/BarChart', 'Finanzas/TrendChart'],
    watch: 'alternativa en texto o tabla del gráfico; contraste de series',
  },
  'Panel de datos': {
    titles: ['Finanzas/DataPanel', 'Finanzas/Dashboard'],
    watch: 'estados cargando, vacío y error; el tablero compuesto a 375 px',
  },
};

export const MAPPED_TITLES = Object.values(FEATURES).flatMap((feature) => feature.titles);

export function featureOf(title: string): [string, Feature] | undefined {
  return Object.entries(FEATURES).find(([, feature]) => feature.titles.includes(title));
}
