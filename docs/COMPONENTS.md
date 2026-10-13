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
- `tabs`: `role="tablist"`, un solo punto de tabulación, flechas izquierda y derecha con vuelta, Inicio y Fin; la flecha selecciona al mover. No pinta los paneles.
- `options`: `role="radiogroup"` con `role="radio"` y `aria-checked`, con el mismo teclado.
- `id` opcional: da a cada segmento el id `${id}-${value}`. Los segmentos `disabled` se saltan al navegar.

## OptionField / OptionCard (L-4)

- **Origen**: `src/components/OptionGroup.tsx` (léelo entero: sus comentarios explican cada decisión) y los selectores `.option-group`, `.option-group-scale`, `.option-card`, `.option-card-row`, `.option-card-notch`, `.option-figure`, `.option-name`, `.option-detail`, `.option-reason` y `.grammage-notch`.
- **API**: la misma de PliegoStack.
  - `OptionField`: `{ label, id, marginalia?, columns = 3, layout: 'grid' | 'scale', fromCatalog?, error?, note?, children }`. Debería componerse sobre `Field` con `group`.
  - `OptionCard`: `{ name, detail?, figure?, selected, disabledReason?, onSelect, id?, row?, ariaLabel?, title?, variant: 'card' | 'notch' }`.
- `--option-columns` decide las columnas.
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

## Drawer / Toast / Tooltip (L-11)

- **Origen**: `CatalogPanel.tsx`, `.catalog-editor*` y `.catalog-*`, y los avisos descartables de persistencia y de huérfanos.
- Con Radix. Ver la decisión de modalidad en el plan.
