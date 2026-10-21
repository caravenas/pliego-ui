# Componentes — especificación

Una sección por componente: de dónde sale, qué API tiene y qué reglas no se pueden romper. Los hechos están marcados ✅; los demás son la propuesta para su incremento en `docs/PLAN.md`, y el agente que lo implemente puede ajustar la API si el código de origen lo justifica, dejándolo anotado aquí.

«Origen» siempre es relativo a `../book-engineering-tool`.

---

## ✅ Button

- **Origen**: `.catalog-primary`, `.catalog-secondary`, `.catalog-danger` y `.counter-button` en `src/styles/index.css`.
- **API**: `variant: 'primary' | 'secondary' | 'outline' | 'danger'` (por defecto `secondary`), `shape: 'rect' | 'round'`, más las props nativas de `<button>`. Por defecto `type="button"`.
- Todas las variantes llevan un borde de 1 px, transparente donde no se ve, para medir lo mismo. En la app el primario medía 2 px menos.
- El realce de puntero solo va en `secondary` y `outline`.

## ✅ Badge / OriginBadge

- **Origen**: `.header-badge` (`outline`) y `.catalog-list-origin` (`mono`); las palabras, de `CatalogOrigin.tsx`.
- **API**: `Badge` lleva `variant: 'outline' | 'mono'`. `OriginBadge` lleva `origin: 'factory' | 'edited' | 'own'` y escribe «de fábrica», «editado» o «tuyo». `ORIGIN_LABELS` exporta esas palabras.
- La regla: el origen se lee como texto, nunca solo por color ni por símbolo.

## ✅ Input

- **Origen**: `.form-input`.
- **API**: las props nativas de `<input>`, con `type="text"` por defecto.
- Cápsula `9999px` con borde de tinta. No trae etiqueta: la pone `Field` o el consumidor.

---

## Field (L-2)

- **Origen**: `.form-group`, `.form-label-row`, `.form-label`, `.field-marginalia` y `.calculation-error`. Ver cómo los compone `OptionField` en `src/components/OptionGroup.tsx`.

```ts
interface FieldProps {
  label: string;             // en minúsculas; las versalitas las pone CSS
  id: string;                // id del control; de él salen `${id}-label`, `-error` y `-note`
  marginalia?: string | null; // nota en el margen derecho de la fila de etiqueta
  error?: string | null;     // role="alert", enlazado con aria-describedby
  note?: ReactNode;          // debajo del control (p. ej. la nota de origen)
  group?: boolean;           // el control es un grupo: etiqueta <span> + aria-labelledby
  children: ReactNode;       // el control
}
```

- La nota al margen empuja con `margin-left: auto` y no reserva espacio cuando es `null`.
- La nota de origen va en dos líneas cortas: el archivo en mono y el texto de origen debajo, **sin** el prefijo «Fuente:» (Design System, README § Fundamentos de contenido).

## Select (L-2)

- **Origen**: `select.form-input`.
- Desplegable nativo en cápsula, con el triángulo SVG en `background-image`, `background-position: right 12px center` y `padding-right: 36px`. El color del triángulo es hoy `#94a3b8` literal: pásalo a `color-text-muted` (5.15:1 frente a 2.6:1, y una flecha de control necesita 3:1).
- No se reimplementa un listbox. Si algún día hace falta uno con búsqueda, va con Radix y en otro componente.

## SegmentedControl (L-3)

- **Origen**: `.central-tabs` y `.central-tab` (la vista central). Ver también los segmentos de formato y proporción en `CanvasDesigner.tsx`.

```ts
interface SegmentedControlProps<V extends string> {
  kind: 'tabs' | 'options';
  label: string;             // aria-label del grupo
  value: V;
  options: { value: V; label: string; disabled?: boolean }[];
  onChange: (value: V) => void;
}
```

- Se dibuja como un rectángulo recortado: borde de tinta en el grupo, costura `border-right` entre segmentos y ninguna en el último.
- 40 px de alto mínimo. Texto con el estilo `central-tab`.
- El activo se rellena de tinta; el apuntado que no está activo pasa a `color-bg-card-hover`.
- `tabs`: `role="tablist"`, un solo punto de tabulación, flechas izquierda y derecha con vuelta, Inicio y Fin; la flecha selecciona al mover. No responde a arriba y abajo. No pinta los paneles.
- `options`: `role="radiogroup"` con `role="radio"` y `aria-checked`, con el mismo teclado y además arriba y abajo, como un radiogroup nativo.
- `id` opcional: da a cada segmento el id `${id}-${value}`. Los segmentos `disabled` se saltan al navegar.
- Sin opciones no pinta nada. Con valores repetidos pinta la primera aparición y avisa en consola. Si `value` no está entre las opciones, ninguno se marca elegido y el componente no lo cambia por su cuenta.
- **Selector de periodo** (L-15): es un `SegmentedControl` con `kind="options"`, no un componente aparte. El cambio de periodo lo anuncia el `DataPanel` que recarga, no el selector.

## OptionField / OptionCard (L-4)

- **Origen**: `src/components/OptionGroup.tsx` (léelo entero: sus comentarios explican cada decisión) y los selectores `.option-group`, `.option-group-scale`, `.option-card`, `.option-card-row`, `.option-card-notch`, `.option-figure`, `.option-name`, `.option-detail`, `.option-reason` y `.grammage-notch`.
- **API**: la misma de PliegoStack.
  - `OptionField`: `{ label, id, marginalia?, columns = 3, layout: 'grid' | 'scale', fromCatalog?, error?, note?, children }`. Debería componerse sobre `Field` con `group`.
  - `OptionCard`: `{ name, detail?, figure?, selected, disabledReason?, onSelect, id?, row?, ariaLabel?, title?, variant: 'card' | 'notch' }`.
- `--option-columns` decide las columnas.
- Toda tarjeta mide 40 px de alto como mínimo (44 con `pointer: coarse`), también la marca de una escala (`variant="notch"`); su número queda pegado a la marca, no en una fila común.
- Estados:
  - Elegida: tinta con el texto en `color-bg-primary`.
  - Apuntada: `color-bg-card-hover`, **nunca** sobre la elegida.
  - Deshabilitada: filete `color-border`, texto en muted y la razón escrita.

## MeasureField (L-5)

- **Origen**: `src/components/MeasureField.tsx` y los selectores `.measure-grid`, `.measure-field`, `.measure-value`, `.measure-value.dashed`, `.measure-input` y `.measure-unit`.
- **API**: `{ label, id, value: number | '', unit, step, pixelsPerStep = 3, min = 0, onChange, marginalia?, dashed? }`. Exportar también `MeasureGrid`, la fila de tres.
- La cifra se escribe sobre un filete de tinta (discontinuo si es un sangrado), en mono de 24 px. Es el único control de entrada que no va en cápsula: es una cota, no un campo.
- Hay tres formas de cambiar el valor, a propósito:
  - Escribir. No se redondea mientras se escribe.
  - Flechas, un paso; con Mayús, diez pasos.
  - Arrastrar la unidad con `setPointerCapture`.
- Todo paso se redondea a los decimales del `step` y nunca baja de `min`. `roundTo` vive en `src/engine/units.ts` de PliegoStack; cópialo como utilidad interna.
- El foco del input es un anillo de **tinta** con 3 px de separación, no de acento.

## SpecStep (L-6)

- **Origen**: `src/components/SpecSteps.tsx`, `StepOptions.tsx` y los selectores `.spec-step*` y `.step-options`.

```ts
interface SpecStepProps {
  number: number;            // se escribe con dos dígitos
  title: string;
  summary: ReactNode;        // el valor del paso cerrado, en mono-note
  onOptions?: () => void;    // el botón «···» que lleva al catálogo
  optionsLabel?: string;
  open?: boolean;            // controlado
  defaultOpen?: boolean;     // no controlado
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}
```

- El resumen va en su propia línea (`flex: 1 0 100%`) dentro del `<summary>`, y se oculta con el paso abierto.
- Valor y cuerpo sangrados `space-7`.
- Se quita el triángulo de Safari (`::-webkit-details-marker`).
- El botón de opciones mide 40 px de alto aunque el glifo sea de 12 px, y su clic no debe abrir ni cerrar el paso (`preventDefault` en el summary).

## ResultList / ResultRow / HowPanel (L-7)

- **Origen**: `src/components/ResultList.tsx`, `HowItIsCalculated.tsx` y los selectores `.result-list`, `.result-row`, `.stat-label`, `.stat-value`, `.stat-unit` y `.how-panel*`.
- **API**: `ResultList` es una `<dl>`; `ResultRow` lleva `{ label, unit?, children }` y pinta `dt` y `dd`. `HowPanel` lleva `{ title = 'Cómo se calcula', formulas: ReactNode[], children, note? }`.
- Las cifras van con `tabular-nums`; las filas, con punteado de `color-border`.
- Rótulos inequívocos: «Hojas de papel (interior)», «Pliegos de prensa por ejemplar» (Design System, README § Fundamentos de contenido).

## Notice (L-8)

- **Origen**: `.calculation-note`, `.preview-notice`, `.calculation-error` y `.config-error*`.
- **API**: `{ variant: 'note' | 'preview' | 'error' | 'config', title?, children }`. El rol es `status` en `note` y `preview`, y `alert` en `error` y `config`.
- El borde del error es hoy `rgba(244, 63, 94, 0.3)`, un literal que no sale de ningún token. Proponer un token o derivarlo de `color-danger-foreground`.
- Un error dice qué regla falla, nunca un mensaje genérico.

## ✅ Drawer (L-11)

- **Origen**: `CatalogPanel.tsx`, `.catalog-editor*` y `.catalog-*`.
- **API**: `{ open?, defaultOpen?, onOpenChange?, title, closeLabel = 'Cerrar', children }`.
- Sobre `@radix-ui/react-dialog` con `modal={false}`: **no es modal**. No atrapa el foco, no inerta la página y un clic fuera no lo cierra. Escape lo cierra, el foco entra en el panel (no en el botón de cerrar) al abrir y vuelve a donde estaba al cerrar.
- Entra y sale por el borde derecho con `transition-drawer-in` y `transition-drawer-out` (fundido al entrar, opaco al salir) y sin movimiento con `prefers-reduced-motion`.

## ✅ Toast (L-11)

- **Origen**: ninguno; PliegoStack no tiene avisos descartables.
- **API**: `ToastProvider { label = 'Avisos ({hotkey})', children }` va una vez; `Toast { open?, defaultOpen?, onOpenChange?, variant: 'note' | 'error', title?, duration?, closeLabel, action?: { label, onAction }, children }`.
- Sobre `@radix-ui/react-toast`. Una `note` se va sola a los 5 s y se anuncia con calma; un `error` no se va solo (`duration` infinita) y se anuncia al momento.
- Mismo tratamiento visual que `Notice`, sin sombra (el sistema las desactiva). No hay API imperativa.

## ✅ Amount (L-14)

- **Origen**: ninguno; el Design System no cubre cifras monetarias.
- **API**: `{ value, currency, locale?, flow?, creditLabel = 'abono', debitLabel = 'cargo', unknownLabel = 'sin dato' }`.
- El valor va en unidades mayores y la moneda es obligatoria; sin `locale` se usa el del entorno. Formatea con `Intl`; un valor que no es un número finito se escribe «sin dato» y una moneda o un idioma inválidos no lanzan.
- Mono con `tabular-nums`. Un negativo lleva el signo `−` en el texto. Con `flow`, un abono y un cargo llevan además su palabra y su color (`color-success-foreground`, azul desde L-15, y `color-danger-foreground`): el color refuerza, nunca sustituye.

## ✅ MovementsTable (L-14)

- **API**: `{ caption, movements: { id, date, description, amount }[], currency, locale?, formatDate?, labels? }`.
- `<table>` con `caption`, cabeceras con `scope` y el concepto como cabecera de fila. El contenedor es una región con nombre y enfocable, porque la tabla se desplaza de lado en pantallas estrechas. Importes a la derecha, con `Amount flow`.
- Sin movimientos dice «sin movimientos». Por omisión es solo lectura; el orden y el filtro son opt-in (ver abajo). Sin paginación ni selección.
- **Orden** (`sortable`, L-16): cada cabecera lleva un `<button>` cuyo nombre es el rótulo de la columna, y `aria-sort` en el `<th>`. El clic pasa por ascendente, descendente y el orden original. La flecha es forma (`↕ ↑ ↓`), `aria-sort` lo dice en palabras. Un valor desconocido (importe ausente o no finito, fecha vacía o inexistente como `2026-02-31`, concepto vacío) va siempre al final, en las dos direcciones; los empates conservan el orden original también en descendente; el concepto se compara con `Intl.Collator` del `locale`. `defaultSort` y `onSortChange` (`null` es el orden original).
- **Filtro** (`filterable`, L-16): un campo con la etiqueta visible «filtrar» sobre la tabla; coincide con el concepto o la fecha tal como se escribe, sin distinguir mayúsculas ni tildes y tomando el texto literalmente. Cero resultados dice «ningún movimiento coincide con «…»», distinto de «sin movimientos».
- **Anuncios**: una región `role="status"` oculta, montada desde el principio. El orden se anuncia al momento («ordenado por importe, de mayor a menor»); el conteo («3 de 12 movimientos») se ve al instante junto al campo y se anuncia 500 ms después de la última tecla.
- Sin `sortable` ni `filterable` el DOM es el de L-14. Los estilos de orden y filtro están en `MovementsTable.controls.css`.

## ✅ TrendChart (L-14)

- **API**: `{ title, points: { label, value }[], currency, locale?, labels? }`.
- Línea en SVG propio, de tinta, con `role="img"` y un nombre que incluye el rango. `color-accent` solo rellena el último punto. Un valor ausente deja un hueco; un solo punto se dibuja sin línea; sin datos dice «sin datos para graficar».
- Los mismos valores van en una tabla visible dentro de un `<details>` abierto: es lo que lee quien no ve el dibujo.

## ✅ BarChart (L-16)

- **Origen**: ninguno; el Design System no cubre series de datos ni leyendas.
- **API**: `{ title, categories: string[], series: { name, values: (number | null | undefined)[] }[], currency, locale?, labels? }`. `values[i]` pertenece a `categories[i]`.
- Barras agrupadas en SVG propio, de tinta, con `role="img"` y un nombre que incluye el título, las series y el rango. La escala siempre incluye el 0. Un valor desconocido no dibuja barra; un 0 deja una marca en la base (un `rect` de alto cero no se pinta).
- **Las series se distinguen sin color**: nombre escrito en la leyenda, posición fija en el grupo y un relleno de tinta propio (macizo, rayas, puntos, trama cruzada). Barra y muestra de la leyenda comparten el mismo patrón SVG, y el contorno de 2 px de tinta da el contraste con el papel. No hay tonos ni tokens nuevos.
- La leyenda solo aparece con dos o más series. Se dibujan como máximo cuatro; con más se escribe «se muestran 4 de N series; las demás están en la tabla» y la tabla las conserva todas.
- Un nombre repetido se desambigua (« (2)»), uno vacío se escribe «sin nombre». Una serie corta deja «sin dato»; los valores que sobran se ignoran.
- Las etiquetas del eje son HTML bajo el SVG, con `aria-hidden`. La tabla de valores (categorías por series) va visible en un `<details>` abierto: es lo que lee quien no ve el dibujo.

## ✅ Metric (L-15)

- **Origen**: ninguno; el Design System no cubre cifras clave.
- **API**: `{ label, value, previous?, currency, locale?, comparison?, labels? }`. `labels`: `up` «sube», `down` «baja», `flat` «sin cambio», `noPrevious` «sin dato anterior», `noPercent` «sin porcentaje: el valor anterior es 0», `lessThan` «menos de».
- Un grupo nombrado por su rótulo; la cifra va con `Amount` en el estilo `metric-value`, y la variación debajo, en `mono-note`: «sube $240.00 (24.0%) frente a septiembre».
- La dirección sale de la diferencia redondeada a los decimales de la moneda, no del porcentaje: de −200 a −100 «sube», y el porcentaje es sobre el valor absoluto del anterior. Con el anterior en 0 no hay porcentaje y se dice por qué; un cambio real que redondea a 0,0 % se escribe «menos de 0,1 %».
- La variación va en tinta, sin color: que suba es bueno en un saldo y malo en un gasto.
- Sin caja: un filete superior de `color-border`.

## ✅ DataPanel (L-15)

- **Origen**: la tarjeta `Panel` del Design System (título sin caja).
- **API**: `{ title, status: 'ready' | 'loading' | 'error', error?, onRetry?, retryLabel, loadingLabel, staleLabel, staleErrorLabel, loadErrorLabel, children? }`. El título es un `h2` y nombra la región.
- Los datos anteriores no se ocultan ni se atenúan: siguen legibles, con una marca escrita («datos anteriores; cargando los nuevos», «no se pudieron actualizar; estos datos son anteriores») enlazada por `aria-describedby`, y con `aria-busy` mientras cargan. Sin datos, «cargando» se escribe sin animación.
- Una región `role="status"` existe siempre y lleva la carga y las marcas. Solo el error sin datos usa `role="alert"` (un `Notice` de error).
- Un cambio de `status` no mueve el foco. Tras «reintentar», el foco pasa al panel (`tabIndex={-1}`, con el anillo de `color-accent-ink`) en vez de caer a la página, salvo que quien reintentó ya esté en otro control. Un segundo «reintentar» no llama otra vez a `onRetry` hasta que cambian `status` o `error`.
- No carga datos ni descarta respuestas tardías: muestra el `status` que recibe.

## Tooltip (pendiente)

- Solo si aparece un caso real. Con `@radix-ui/react-tooltip`.
