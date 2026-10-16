// Las tarjetas del Design System: su grupo, su alto y el script que monta el
// componente real de `window.PliegoUI`. El marco del artifact ya trae cargados
// los tokens, bundle.css, React 18 y bundle.js; cada preview es un elemento raíz
// y un solo <script>, sin red (ver format.md del tipo).

export interface DsComponent {
  name: string;
  group: string;
  /** Alto de la fila de la tarjeta en píxeles. */
  height: number;
  /** Ancho máximo del contenido, en píxeles. */
  maxWidth: number;
  /** Cuerpo de `function App() { … }`: devuelve el árbol con `h` (createElement) y `P` (la librería). */
  script: string;
}

const page = (w: number, h: number) =>
  `h('span', { className: 'pui-option-shape', style: { width: ${w}, height: ${h} } })`;

export const COMPONENTS: DsComponent[] = [
  {
    name: 'Button',
    group: 'Primitivos',
    height: 200,
    maxWidth: 560,
    script: `
      return h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } },
        h(P.Button, { variant: 'primary' }, 'guardar cambios'),
        h(P.Button, { variant: 'secondary' }, 'cancelar'),
        h(P.Button, { variant: 'outline' }, 'ver catálogo'),
        h(P.Button, { variant: 'danger' }, 'volver a fábrica'),
        h(P.Button, { variant: 'secondary', disabled: true }, 'deshabilitado'),
        h(P.Button, { variant: 'outline', shape: 'round', 'aria-label': 'añadir hoja' }, '+')
      );`,
  },
  {
    name: 'Badge',
    group: 'Primitivos',
    height: 140,
    maxWidth: 560,
    script: `
      return h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } },
        h(P.Badge, { variant: 'outline' }, 'datos de ejemplo'),
        h(P.Badge, { variant: 'mono' }, 'config/pliegos.json'),
        h(P.OriginBadge, { origin: 'factory' }),
        h(P.OriginBadge, { origin: 'edited' }),
        h(P.OriginBadge, { origin: 'own' })
      );`,
  },
  {
    name: 'Input',
    group: 'Primitivos',
    height: 220,
    maxWidth: 372,
    script: `
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        h(P.Input, { 'aria-label': 'Nombre de la prensa', placeholder: 'Prensa de pliego 70 × 100' }),
        h(P.Input, { 'aria-label': 'Número de páginas', type: 'number', defaultValue: 64 }),
        h(P.Input, { 'aria-label': 'Calibre', defaultValue: '120 µm', disabled: true })
      );`,
  },
  {
    name: 'Select',
    group: 'Primitivos',
    height: 180,
    maxWidth: 372,
    script: `
      var options = [h('option', { key: 'o', value: 'offset' }, 'Offset ahuesado'), h('option', { key: 'c', value: 'couche' }, 'Estucado mate'), h('option', { key: 'k', value: 'kraft' }, 'Cartulina gráfica')];
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        h(P.Select, { 'aria-label': 'Tipo de papel', defaultValue: 'offset' }, options),
        h(P.Select, { 'aria-label': 'Papel fijado por la prensa', defaultValue: 'kraft', disabled: true }, options)
      );`,
  },
  {
    name: 'Field',
    group: 'Controles',
    height: 460,
    maxWidth: 372,
    script: `
      return h(React.Fragment, null,
        h(P.Field, { label: 'tipo de papel', id: 'f-papel', marginalia: 'de fábrica · config/sustratos.json' },
          h(P.Select, { defaultValue: 'offset' }, h('option', { value: 'offset' }, 'Offset ahuesado'), h('option', { value: 'couche' }, 'Estucado mate'))),
        h(P.Field, { label: 'número de páginas', id: 'f-pp' }, h(P.Input, { type: 'number', defaultValue: 64 })),
        h(P.Field, { label: 'calibre', id: 'f-cal', error: 'El calibre debe ser mayor que 0.' }, h(P.Input, { defaultValue: '0' })),
        h(P.Field, { label: 'nombre de la prensa', id: 'f-nom', note: h(React.Fragment, null, h('div', null, 'config/prensas.json'), h('div', null, 'catálogo de fábrica')) },
          h(P.Input, { placeholder: 'Prensa de pliego 70 × 100' }))
      );`,
  },
  {
    name: 'SegmentedControl',
    group: 'Controles',
    height: 220,
    maxWidth: 560,
    script: `
      var tabs = useState('draw'), opts = useState('a5');
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
        h(P.SegmentedControl, { kind: 'tabs', label: 'Vista central', value: tabs[0], onChange: tabs[1],
          options: [{ value: 'draw', label: 'dibujos' }, { value: 'results', label: 'resultados' }, { value: 'catalog', label: 'catálogo' }] }),
        h(P.SegmentedControl, { kind: 'options', label: 'Formato', value: opts[0], onChange: opts[1],
          options: [{ value: 'a5', label: 'a5' }, { value: 'a4', label: 'a4', disabled: true }, { value: 'letter', label: 'carta' }] })
      );`,
  },
  {
    name: 'OptionField',
    group: 'Controles',
    height: 600,
    maxWidth: 404,
    script: `
      var o = useState('portrait'), g = useState('90');
      var card = function (value, name, figure, extra) {
        return h(P.OptionCard, Object.assign({ key: value, name: name, figure: figure, selected: o[0] === value, onSelect: function () { o[1](value); } }, extra));
      };
      return h(React.Fragment, null,
        h(P.OptionField, { label: 'orientación', id: 'o-orient', columns: 3, marginalia: 'de fábrica' },
          card('portrait', 'vertical', ${page(22, 32)}),
          card('landscape', 'apaisado', ${page(32, 22)}),
          card('square', 'cuadrado', ${page(26, 26)}, { disabledReason: 'no cabe en el pliego' })),
        h(P.OptionField, { label: 'gramaje', id: 'o-gram', layout: 'scale', columns: 4, marginalia: 'en g/m²' },
          ['70', '90', '120', '150'].map(function (v, i) {
            return h(P.OptionCard, { key: v, name: v, variant: 'notch', selected: g[0] === v, onSelect: function () { g[1](v); },
              figure: h('span', { className: 'pui-option-mark', style: { height: 4 + i * 4 } }) });
          }))
      );`,
  },
  {
    name: 'MeasureField',
    group: 'Controles',
    height: 220,
    maxWidth: 404,
    script: `
      var w = useState(140), hh = useState(210), b = useState(3);
      return h(P.MeasureGrid, null,
        h(P.MeasureField, { label: 'ancho cerrado', id: 'm-w', value: w[0], unit: 'mm', step: 1, onChange: w[1], marginalia: 'proporción 2:3' }),
        h(P.MeasureField, { label: 'alto cerrado', id: 'm-h', value: hh[0], unit: 'mm', step: 1, onChange: hh[1] }),
        h(P.MeasureField, { label: 'sangrado', id: 'm-b', value: b[0], unit: 'mm', step: 0.5, onChange: b[1], dashed: true, marginalia: 'por cara' })
      );`,
  },
  {
    name: 'SpecStep',
    group: 'Ficha técnica',
    height: 420,
    maxWidth: 404,
    script: `
      return h(React.Fragment, null,
        h(P.SpecStep, { number: 1, title: 'Formato de página', summary: '140 × 210 · 2:3', defaultOpen: true, onOptions: function () {} },
          h(P.Field, { label: 'número de páginas', id: 's-pp' }, h(P.Input, { type: 'number', defaultValue: 64 }))),
        h(P.SpecStep, { number: 2, title: 'Papel interior', summary: 'offset ahuesado · 120 g/m² · 120 µm', onOptions: function () {} }, 'Cuerpo del paso.'),
        h(P.SpecStep, { number: 3, title: 'Páginas y encuadernación', summary: '64 pp. · rústica fresada', optionsLabel: 'páginas y encuadernación', onOptions: function () {} }, 'Cuerpo del paso.')
      );`,
  },
  {
    name: 'ResultList',
    group: 'Resultados',
    height: 330,
    maxWidth: 360,
    script: `
      return h(P.ResultList, null,
        h(P.ResultRow, { label: 'lomo estimado', unit: 'mm' }, '12,4'),
        h(P.ResultRow, { label: 'hojas de papel (interior)' }, '32'),
        h(P.ResultRow, { label: 'peso del papel interior', unit: 'g' }, '246'),
        h(P.ResultRow, { label: 'pliegos de prensa por ejemplar' }, '4'),
        h(P.ResultRow, { label: 'aprovechamiento del pliego', unit: '%' }, '86,5'),
        h(P.ResultRow, { label: 'corrimiento máx.', unit: 'mm' }, '1,9')
      );`,
  },
  {
    name: 'HowPanel',
    group: 'Resultados',
    height: 300,
    maxWidth: 360,
    script: `
      return h(P.HowPanel, { formulas: ['lomo = (páginas ÷ 2) × calibre declarado del papel + cartón × 2'], note: 'valores de ejemplo · config/sustratos.json' },
        h('p', { style: { margin: 0 } }, 'La encuadernación anida pliegos plegados de 4 páginas: el más externo se desplaza hacia fuera y el más interno no se mueve.'));`,
  },
  {
    name: 'Notice',
    group: 'Estados',
    height: 420,
    maxWidth: 460,
    script: `
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
        h(P.Notice, { variant: 'note' }, 'El lomo se estima con el calibre declarado del papel, no con el medido en prensa.'),
        h(P.Notice, { variant: 'preview' }, 'El dibujo muestra el tiro. La cara de retiro se elige sobre la vista previa.'),
        h(P.Notice, { variant: 'error' }, 'La rústica fresada pide entre 32 y 400 páginas, en múltiplos de 4. 63 no es múltiplo de 4.'),
        h(P.Notice, { variant: 'config', title: 'No se pudo leer la configuración' },
          h('ul', null,
            h('li', null, 'config/pliegos.json · [2].pinza · se esperaba un número en milímetros'),
            h('li', null, 'config/maquinas.json · [0].source · campo obligatorio ausente')),
          h('p', null, 'Corrige el archivo y vuelve a cargar: la app no monta con una configuración inválida.'))
      );`,
  },
  {
    name: 'Drawer',
    group: 'Estructura',
    height: 420,
    maxWidth: 560,
    script: `
      return h(P.Drawer, { defaultOpen: true, title: 'editar catálogo' },
        h(P.Field, { label: 'ancho', id: 'd-w' }, h(P.Input, { type: 'number', defaultValue: 700 })),
        h(P.Field, { label: 'alto', id: 'd-h' }, h(P.Input, { type: 'number', defaultValue: 1000 }))
      );`,
  },
  {
    name: 'Toast',
    group: 'Estados',
    height: 360,
    maxWidth: 560,
    script: `
      return h(P.ToastProvider, null,
        h(P.Toast, { title: 'guardado', duration: Infinity }, 'Los cambios están en este navegador.'),
        h(P.Toast, { variant: 'error', title: 'no se pudo guardar', action: { label: 'reintentar', onAction: function () {} } }, 'Este navegador no deja guardar: los cambios valen solo para esta sesión.')
      );`,
  },
];

/** El documento de una tarjeta: línea 1 el marcador `@dsCard`, luego raíz y un solo script. */
export function previewHtml(component: DsComponent): string {
  return `<!-- @dsCard group="${component.group}" height=${component.height} -->
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${component.name}</title>
<style>
  body { margin: 0; padding: 20px 24px; }
  .dsx { max-width: ${component.maxWidth}px; }
</style>
</head>
<body>
<div class="dsx" id="root"></div>
<script>
(function () {
  var P = window.PliegoUI, h = React.createElement, useState = React.useState;
  function App() {${component.script}
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
</script>
</body>
</html>
`;
}
