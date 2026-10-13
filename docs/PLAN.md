# Plan — pliego-ui

Plan canónico de la librería. Un agente implementa **solo** el incremento marcado como siguiente en la tabla de estado y, al cerrarlo, la actualiza.

## Estado actual

- Scaffold en `main` (`9db7d12`): Vite en modo librería, TS, Storybook 8.6, Vitest 3, Changesets y el pipeline de tokens.
- Primitivos hechos: `Button` (primary, secondary, outline, danger; forma `round`), `Badge` / `OriginBadge`, `Input`, `Select`, `Field`, `SegmentedControl`, `OptionField`, `OptionCard`, `MeasureField`, `MeasureGrid` y `SpecStep`. 86 tests en verde, build y build de Storybook verificados (L-6, 2026-10-12).
- Aún sin remoto en GitHub, sin CI y sin publicar.
- L-0 está a medias (2026-10-12): las dependencias ya están instaladas en macOS y `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0. Falta limpiar los restos de git de la VM Linux (`.git/stale-*` y `tmp_obj_*`) y crear el remoto.
- L-2 cerrado: `Field` (enlaza el control por `id`, error con `role="alert"`, nota al margen y nota de origen) y `Select` (desplegable nativo en cápsula, triángulo en `color-text-muted`).
- L-3 cerrado: `SegmentedControl` con `tablist` (`tabs`) y `radiogroup` (`options`), un punto de tabulación, flechas, Inicio y Fin. Resuelve la decisión abierta 1 para este componente.
- L-4 cerrado: `OptionField` (sobre `Field` con `group`) y `OptionCard` (botón con `aria-pressed`, rejilla y escala).
- L-5 cerrado: `MeasureField` y `MeasureGrid` (escribir, flechas, arrastre con captura de puntero).
- L-6 cerrado: `SpecStep` (`<details>` numerado con valor en el estado cerrado y `open` controlado o no).
- **Siguiente: L-7.** L-1 espera al remoto de L-0.

| Id | Incremento | Estado | Commit |
| --- | --- | --- | --- |
| L-0 | Puesta en marcha local y remoto | a medias (Chris) | |
| L-1 | CI en GitHub Actions | pendiente (necesita el remoto) | |
| L-2 | `Field` y `Select` | hecho | ver `git log` (`feat: add Field and Select`) |
| L-3 | `SegmentedControl` | hecho | ver `git log` (`feat: add SegmentedControl`) |
| L-4 | `OptionField` y `OptionCard` | hecho | ver `git log` (`feat: add OptionField and OptionCard`) |
| L-5 | `MeasureField` | hecho | ver `git log` (`feat: add MeasureField`) |
| L-6 | `SpecStep` | hecho | ver `git log` (`feat: add SpecStep`) |
| L-7 | `ResultList`, `ResultRow` y `HowPanel` | **siguiente** | |
| L-8 | `Notice` | pendiente | |
| L-9 | Accesibilidad y regresión visual en CI | pendiente | |
| L-10 | Primera publicación, 0.1.0 | pendiente | |
| L-11 | Radix: `Drawer` (catálogo), `Tooltip`, `Toast` | pendiente | |
| L-12 | Migrar PliegoStack a la librería | pendiente | |
| L-13 | Re-sincronizar el Design System desde la librería | pendiente | |

Orden razonado: primero la red de seguridad (CI), luego los primitivos de formulario que todo lo demás usa (`Field`), luego los patrones propios en el orden en que aparecen en la ficha técnica, y solo entonces publicar y migrar. Radix entra cuando haga falta, no antes.

## Fuentes

Mandan sobre el estilo `docs/COMPONENTS.md` y, sobre todo, el Design System de claude.ai. Lo de PliegoStack es procedencia.

- **Design System** en claude.ai: https://claude.ai/artifact/81WGnnxqtHUGnc6yK9DAHe. Brand book, notas de uso por token y previews estáticos de los doce patrones. Es la referencia principal de estilo.
- **Especificación por componente**: `docs/COMPONENTS.md`.
- **PliegoStack** (procedencia): `../book-engineering-tool` (repo `caravenas/book-engineering-tool`). El origen de cada patrón está en `src/components/*.tsx` y `src/styles/index.css`. Busca por selector, no por número de línea, porque el archivo cambia.
- Documentos de diseño de PliegoStack, también procedencia: `UI-REDESIGN.md`, `UX-REVIEW.md` (§5 Accesibilidad y §6 Redacción) y `UI-INVENTORY.md`. Ese repositorio los archivó en `docs/legacy/` el 2026-10-02. Lo que de ellos sigue vigente está en el Design System.

---

## L-0 — Puesta en marcha local y remoto (manual)

Lo hace Chris en su Mac; ningún agente puede hacerlo por él.

1. `npm install`. Las dependencias nunca se instalaron en macOS: la sesión que creó el scaffold corría en una VM Linux.
2. Borrar `_to_delete/`, el `node_modules` de Linux de ese intento.
3. Limpiar lo que dejó git en esa VM: `rm .git/stale-*` y `find .git/objects -name 'tmp_obj_*' -delete`. Luego `git fsck` debe salir limpio.
4. `npm run dev`. Storybook debe abrir en :6006 con las 13 stories de Button, Badge e Input.
5. Crear `caravenas/pliego-ui` en GitHub (privado) y hacer `git push -u origin main`.

**Aceptación**: `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0 en macOS, y `main` está en el remoto.

## L-1 — CI en GitHub Actions

**Alcance**
- `.github/workflows/ci.yml`: en cada push y PR, Node desde `.nvmrc`, `npm ci`, typecheck, test, build y build-storybook.
- `.github/workflows/release.yml`: en push a `main`, `changesets/action` abre el PR de versión y, al mergearlo, publica en GitHub Packages con `GITHUB_TOKEN` (`packages: write`).

**No objetivos**: despliegue de Storybook (va en L-9), tests visuales.

**Aceptación**: un PR de prueba muestra el check en verde; el workflow de release corre sin publicar mientras no haya changesets.

## L-2 — `Field` y `Select`

Ver `docs/COMPONENTS.md` § Field y § Select. `Field` es la etiqueta, la nota al margen, el error y la nota inferior que hoy repiten `.form-group`, `.form-label-row`, `.form-label`, `.field-marginalia` y `.calculation-error`. `Select` es el desplegable nativo en cápsula.

**Objetivo.**
Que quien construye un formulario con pliego-ui tenga resueltos en un componente la etiqueta, la nota al margen, el error y la nota de origen de un campo, y el desplegable nativo en cápsula del sistema, sin repetir las clases ni la accesibilidad en cada proyecto.

**Alcance.**
- `Field`, con la API de `docs/COMPONENTS.md` § Field: `label`, `id`, `marginalia`, `error`, `note`, `group` y `children`. De `id` salen `${id}-label`, `${id}-error` y `${id}-note`.
- `Select`: `<select>` nativo en cápsula, como `Input`, con `forwardRef`, las props nativas intactas, el triángulo SVG en `background-image` y 36 px de margen derecho.
- Estilos con variables, clases `pui-` y BEM ligero, en `Field.css` y `Select.css`.
- Stories de `Field` (con nota al margen, con error, deshabilitado) y de `Select`, y sus tests.
- Export en `src/index.ts` con los tipos, y un changeset.

**No objetivos.**
- Un listbox propio, o búsqueda dentro del desplegable: si algún día hace falta, va con Radix y en otro componente.
- Validar datos o llevar el estado del formulario: el consumidor aporta el valor y el texto del error.
- Cambiar `Input`, `Button` o `Badge`.
- Tokens nuevos, dependencias nuevas o tema oscuro.
- El remoto y el CI (L-0 y L-1).

**Aceptación.**
1. Un test comprueba que `Field` une etiqueta y control por `id` (`getByLabelText` encuentra el control) y que, con `group`, la etiqueta es un `<span>` con `id="${id}-label"` y el grupo lleva `aria-labelledby` apuntándole.
2. Un test comprueba que `error` se pinta con `role="alert"` y el id `${id}-error`, que el control lo nombra en `aria-describedby` junto al de la nota si la hay, y que sin error ni nota el control no lleva `aria-describedby`.
3. Un test comprueba que con `marginalia={null}` no queda ningún nodo en el DOM, y que el nombre accesible de la etiqueta es el texto escrito en minúsculas: las versalitas las pone el CSS.
4. Un test comprueba que `Select` es un `<select>` nativo con la clase de cápsula, reenvía la ref y deja pasar `value`, `onChange`, `name` y `disabled`.
5. Un test lee `Field.css` y `Select.css` y comprueba que no hay colores, tamaños ni radios literales fuera de las excepciones comentadas (`9999px`, 40/44 px), y que el color del triángulo coincide con el valor de `color-text-muted` en `tokens/tokens.json`.
6. Se revisa a mano en Storybook (`npm run dev`) con teclado y con `pointer: coarse` emulado: 40/44 px de alto, el triángulo a 36 px del borde derecho, el anillo de foco de 2 px separado del borde, la nota al margen pegada a la derecha, y el error legible con palabras y no solo por color.
7. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `Field`, `Select` y sus tipos, y no hay dependencias nuevas.
8. Hay un changeset del cambio, y `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual».

**Rollback.** Revertir el único commit del incremento.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y, sobre todo, el Design System de claude.ai (Chris, 2026-10-12).
Las tres siguientes las propone el agente que escribió este brief y quedan confirmadas al aprobarlo:
- `Field` enlaza el control clonando su único hijo elemento: le añade `id`, `aria-describedby` y, si hay error, `aria-invalid`. Con `group` envuelve a los hijos en un `role="group"` con `aria-labelledby`. Si `children` no es un único elemento, no inyecta nada y el consumidor usa los ids derivados.
- El triángulo de `Select` usa `color-text-muted` y no el `#94a3b8` literal de origen: 5,15:1 frente a 2,6:1, y el Design System pide 3:1 para el dibujo de un control.
- `Select` no cambia el fondo al enfocar: el foco es solo el anillo, como dice la nota de `color-bg-input-focus` en `tokens.json`.

**Preguntas abiertas.**
Ninguna impide empezar.
- `Input` sí cambia el fondo al enfocar (`rgba(255, 255, 255, 0.5)`, literal), lo que contradice la regla de colores literales del proyecto y esa misma nota del Design System. Está fuera de L-2: ¿se corrige en un incremento propio?
- El README del Design System dice que los campos van con «fondo transparente», y `color-bg-input` (`#ffffff`) se describe como «fondo de campos». L-2 sigue a `Input` (transparente) hasta que se decida cuál manda.

## L-3 — `SegmentedControl`

Ver `docs/COMPONENTS.md` § SegmentedControl. Un solo componente con dos semánticas, porque PliegoStack usa el mismo dibujo para dos cosas distintas.
Origen: `.central-tabs` y `.central-tab` en `src/styles/index.css` y `CentralViewTabs` en `src/components/CentralView.tsx`. Allí el selector de vista es hoy un grupo de botones con `aria-pressed`, porque el trabajo de teclado estaba congelado; esta librería lo hace una vez.

**Objetivo.**
Que quien construye una interfaz con pliego-ui tenga un selector segmentado que se maneja con el teclado como promete su semántica: cambiar de vista (`tabs`) o elegir un valor (`options`), con el dibujo del sistema.

**Alcance.**
- `SegmentedControl<V extends string>` con la API de `docs/COMPONENTS.md`: `kind`, `label`, `value`, `options` y `onChange`, más un `id` opcional que da ids estables a los segmentos (`${id}-${value}`) para que el consumidor enlace sus paneles.
- `kind="tabs"`: `role="tablist"` con `aria-label`, cada segmento `role="tab"` con `aria-selected`. Un solo punto de tabulación (tabindex móvil), flechas izquierda y derecha con vuelta, Inicio y Fin; la flecha selecciona al mover (activación automática). El componente no pinta los paneles: los pinta el consumidor.
- `kind="options"`: `role="radiogroup"` con `aria-label`, cada segmento `role="radio"` con `aria-checked`, el mismo tabindex móvil y las mismas teclas.
- Los segmentos con `disabled` se saltan al navegar y no se pueden elegir.
- Estilos en `SegmentedControl.css` solo con variables, clases `pui-` y BEM ligero, con el estilo de texto `central-tab` de los tokens (`pui-type-central-tab`).
- Stories (tabs, options, con un segmento deshabilitado, con un segmento activo largo) y tests.
- Export en `src/index.ts` con los tipos, un changeset, y actualizar en `docs/COMPONENTS.md` la línea de `options` y en «Decisiones abiertas» la decisión 1.

**No objetivos.**
- Paneles de pestañas (`tabpanel`) o cualquier contenido que cambie con la selección: lo aporta el consumidor.
- `OptionField` y `OptionCard` (L-4): allí se decide su semántica por separado, aunque reutilicen el hook de teclado.
- Selección múltiple, segmentos con icono o con contador, y orientación vertical.
- Cambiar `Button`, `Input`, `Select` o `Field`; tokens nuevos; dependencias nuevas; tema oscuro.
- Migrar `CentralViewTabs` de PliegoStack (L-12).

**Aceptación.**
1. Un test comprueba que `kind="tabs"` pinta un `tablist` con `aria-label`, un `tab` por opción con `aria-selected` solo en el actual, y que solo el actual tiene `tabindex="0"` (los demás `-1`).
2. Un test comprueba con teclado en `tabs` que ArrowRight y ArrowLeft llaman a `onChange` con el vecino y vuelven al otro extremo, que Home y End van al primero y al último, que se saltan los `disabled`, y que el foco acompaña a la selección.
3. Un test comprueba que `kind="options"` pinta un `radiogroup` con `radio` y `aria-checked`, con el mismo tabindex móvil y las mismas teclas, y que un clic o Espacio sobre un segmento llama a `onChange` con su valor.
4. Un test comprueba que un segmento `disabled` no llama a `onChange` al hacer clic, y que si el valor actual no coincide con ninguna opción, el primer segmento no deshabilitado es el punto de tabulación.
5. Un test lee `SegmentedControl.css` y comprueba que no hay colores, tamaños ni radios literales fuera de las excepciones comentadas (40/44 px y los pesos de 1 px y 2 px), y que no hay `border-right` en el último segmento.
6. Se revisa a mano en Storybook (`npm run dev`) con teclado y con `pointer: coarse` emulado: 40/44 px de alto, el segmento activo relleno de tinta, el apuntado no activo en `color-bg-card-hover` y nunca sobre el activo, las costuras compartidas con la última sin borde, el anillo de foco de 2 px de `color-accent-ink` separado del borde, y el estado legible por palabras y no solo por color.
7. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `SegmentedControl` y sus tipos, y no hay dependencias nuevas.
8. Hay un changeset del cambio, y `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual».

**Rollback.** Revertir el único commit del incremento.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y, sobre todo, el Design System de claude.ai (Chris, 2026-10-12).
Las dos siguientes las propone el agente que escribió este brief y quedan confirmadas al aprobarlo:
- Se resuelve la decisión abierta 1 para este componente a favor de la semántica real (`tablist` y `radiogroup` con tabindex móvil) y no de `aria-pressed`. Un grupo de botones pulsados no promete flechas, pero una librería se escribe una vez y la usan todos, y `tabs` ya era un `tablist` en `COMPONENTS.md`. Costo: más teclado que probar, y la migración de PliegoStack cambia el marcado de `CentralViewTabs`.
- `tabs` activa al mover el foco (activación automática), porque los tres paneles de PliegoStack son baratos de pintar y es lo que promete «las flechas mueven la selección».

**Preguntas abiertas.**
Ninguna impide empezar.
- El estilo `central-tab` pide mayúsculas con 0,16 em de tracking: ¿se aplica también en `options` (formato, proporción) o allí el texto va con el estilo de `form-input`? L-3 usa `central-tab` en ambos hasta que se decida.
- ¿`OptionCard` (L-4) mantiene `aria-pressed` o pasa a `radio`? Se decide en su brief.

## L-4 — `OptionField` y `OptionCard`

Ver `docs/COMPONENTS.md` § OptionCard. Origen: `src/components/OptionGroup.tsx` y los selectores `.option-*` y `.grammage-notch` de PliegoStack.

**Objetivo.**
Que quien construye un formulario con pliego-ui tenga opciones dibujadas a escala, en rejilla de tarjetas o en una escala de marcas, con la misma API que ya usa PliegoStack para que migrar sea un cambio de import.

**Alcance.**
- `OptionField`, compuesto sobre `Field` con `group`: `label`, `id`, `marginalia`, `columns` (3 por defecto), `layout` (`grid` o `scale`), `fromCatalog`, `error`, `note` y `children`. `--option-columns` decide las columnas.
- `OptionCard`: `name`, `detail`, `figure`, `selected`, `disabledReason`, `onSelect`, `row`, `ariaLabel` y `variant` (`card` o `notch`), con `forwardRef` y las props nativas del botón (`id`, `title`…) intactas.
- Estados: elegida en tinta con el texto en `color-bg-primary`; apuntada en `color-bg-card-hover` y nunca sobre la elegida; deshabilitada con filete `color-border`, texto en muted y la razón escrita en la tarjeta.
- Dos clases de ayuda para figuras sin dibujo propio: `pui-option-shape` (caja en `currentColor`) y `pui-option-mark` (la marca de la escala, que se rellena al elegirla).
- Estilos con variables y clases `pui-` en `OptionCard.css` y `OptionField.css`; stories (rejilla, razón de deshabilitada, error, escala) y tests; export con tipos y un changeset.

**No objetivos.**
- Teclado propio del grupo (flechas, un solo punto de tabulación) o `role="radio"`: ver la decisión abierta 1.
- Figuras concretas de PliegoStack (siluetas de página, muestras de papel): son del consumidor.
- Cambiar `Field`, `SegmentedControl`, `Button`, `Input` o `Select`.
- Tokens nuevos, dependencias nuevas o tema oscuro.

**Aceptación.**
1. Un test comprueba que `OptionCard` es un `<button type="button">` con `aria-pressed` que llama a `onSelect`, con su clase de elegida cuando `selected`.
2. Un test comprueba que `disabledReason` deshabilita la tarjeta, escribe la razón en ella y no llama a `onSelect` al hacer clic.
3. Un test comprueba que `figure` va con `aria-hidden`, que `ariaLabel` sustituye al nombre anunciado y que la ref y las props nativas pasan.
4. Un test comprueba que `OptionField` se compone sobre `Field` con `group` (etiqueta `<span id="${id}-label">`, grupo nombrado), que `columns` fija `--option-columns`, que `layout="scale"` y `fromCatalog` ponen sus clases, y que el error y la nota se enlazan al grupo.
5. Un test lee `OptionCard.css` y `OptionField.css` y comprueba que no hay colores, tamaños ni radios literales fuera de las excepciones comentadas, y que el realce de puntero excluye a la elegida.
6. Se revisa a mano en Storybook (`npm run dev`) con teclado y `pointer: coarse` emulado: rejilla y escala, elegida en tinta, apuntada que aclara y nunca sobre la elegida, deshabilitada con su razón, anillo de foco de 2 px y estados legibles por palabras.
7. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `OptionField`, `OptionCard` y sus tipos, y no hay dependencias nuevas.
8. Hay un changeset del cambio, y `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual».

**Rollback.** Revertir el único commit del incremento.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai (Chris, 2026-10-12).
La siguiente la toma el agente al ejecutar el objetivo de completar el plan, y queda registrada en «Decisiones abiertas» para que Chris la confirme o la cambie:
- `OptionCard` mantiene `aria-pressed` y no pasa a `radio`: la API es la de PliegoStack, no promete flechas, y cada opción se alcanza con Tab. Pasar a `radiogroup` es compatible hacia delante si se decide, porque el teclado ya existe en `SegmentedControl`.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-5 — `MeasureField`

Ver `docs/COMPONENTS.md` § MeasureField. Origen: `src/components/MeasureField.tsx` y los selectores `.measure-*` de PliegoStack; `roundTo` viene de su `src/engine/units.ts`. Es el componente con más comportamiento: escribir, flechas (más Mayús para diez pasos) y arrastrar la unidad con captura de puntero.

**Objetivo.**
Que quien construye un formulario con medidas (formato, lomo, sangrado) tenga una cota escrita como en un plano, que se cambia escribiendo, con flechas o arrastrando la unidad, sin reimplementar el redondeo ni el arrastre.

**Alcance.**
- `MeasureField`, con la API de `docs/COMPONENTS.md`: `label`, `id`, `value` (`number | ''`), `unit`, `step`, `pixelsPerStep` (3), `min` (0), `onChange`, `marginalia` y `dashed`; `forwardRef` al input.
- `MeasureGrid`, la fila de tres.
- Escribir no redondea; Mayús + flecha da diez pasos; una flecha sola se deja al input nativo; el arrastre usa `setPointerCapture` y sobrevive a que el puntero salga del tirador. Todo paso se redondea a los decimales de `step` y nunca baja de `min`.
- `roundTo` y `decimalsOf` como utilidad interna (`src/utils/roundTo.ts`), con sus tests.
- Foco: anillo de **tinta** de 2 px con 3 px de separación, no de acento. La marginalia va bajo el valor, enlazada con `aria-describedby`.
- Stories (por defecto, sangrado discontinuo, fila de tres), tests, export con tipos y un changeset.

**No objetivos.**
- Un tirador alcanzable por teclado: las flechas sobre la cifra hacen lo mismo.
- Conversión entre unidades o validación de rangos: el consumidor aporta el valor ya en la unidad mostrada.
- Cambiar `Field`, `Input` y los demás componentes; tokens o dependencias nuevas; tema oscuro.

**Aceptación.**
1. Un test comprueba que la etiqueta y la cifra se unen por `id` y que es un `<input type="number">` con su `step` y su `min`.
2. Un test comprueba que escribir llama a `onChange` sin redondear, y que Mayús + flecha da diez pasos redondeados a la rejilla del paso (`0.125`), con el valor final `2.25` y el mínimo `0`.
3. Un test comprueba que una flecha sola no se intercepta (`defaultPrevented` falso).
4. Un test simula eventos de puntero y comprueba que arrastrar la unidad cambia el valor por muescas de `pixelsPerStep`, que se captura el puntero, que soltar o cancelar lo libera y que después no se cambia nada.
5. Un test comprueba que ni flechas ni arrastre bajan de `min`, y que con `value=""` ninguno de los dos actúa.
6. Un test comprueba `dashed`, que la marginalia se enlaza con `aria-describedby` y que `marginalia={null}` no deja nodo, la ref y `MeasureGrid`.
7. Un test lee `MeasureField.css` y comprueba que no hay colores, tamaños ni radios literales fuera de las excepciones comentadas, y que el foco es de tinta y nunca de acento.
8. Se revisa a mano en Storybook (`npm run dev`) con teclado y `pointer: coarse` emulado: la cifra sobre su filete (discontinuo en el sangrado), 40/44 px de alto, el anillo de tinta de 2 px con 3 px de separación y el arrastre real con el ratón.
9. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `MeasureField`, `MeasureGrid` y sus tipos, y no hay dependencias nuevas.
10. Hay un changeset del cambio, y `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual».

**Rollback.** Revertir el único commit del incremento.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai (Chris, 2026-10-12).
Las dos siguientes las toma el agente al ejecutar el objetivo de completar el plan, y quedan en «Decisiones abiertas» para que Chris las confirme:
- El anillo de foco es de tinta con 3 px de separación, como pide `COMPONENTS.md`, aunque la regla general del sistema sea el anillo de `color-accent-ink`: la cifra es una cota y el acento no marca nada en ella.
- El valor tiene 40 px de alto mínimo (44 con puntero grueso) y alinea sus elementos al centro, no por la línea base como el origen, para cumplir el área mínima de la regla del sistema.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-6 — `SpecStep`

Ver `docs/COMPONENTS.md` § SpecStep. Origen: `src/components/SpecSteps.tsx`, `StepOptions.tsx` y los selectores `.spec-step*` y `.step-options` de PliegoStack.

**Objetivo.**
Que quien construye una ficha técnica por pasos tenga un paso numerado que, cerrado, sigue diciendo el valor que tiene, para que la ficha entera se lea de un vistazo y solo se abra donde hay algo que cambiar.

**Alcance.**
- `SpecStep` con la API de `docs/COMPONENTS.md`: `number`, `title`, `summary`, `onOptions`, `optionsLabel`, `open`, `defaultOpen`, `onOpenChange` y `children`; `forwardRef` al `<details>`.
- `<details>` con el estado llevado por el componente: `open` controlado y `defaultOpen` no controlado, y un clic solo pide el cambio.
- El resumen va dentro del `<summary>`, en su línea (`flex: 1 0 100%`), y se oculta con el paso abierto. Valor y cuerpo sangrados `space-7`.
- El triángulo de Safari se quita; el botón «···» mide 40 px de alto (44 con puntero grueso) y su clic no abre ni cierra el paso.
- Estilos con variables y clases `pui-`, stories (cerrado, abierto, título largo, controlado), tests, export con tipos y un changeset.

**No objetivos.**
- Qué contiene cada paso, el catálogo al que lleva «···» o el estado de apertura de la ficha entera: lo decide el consumidor.
- Un acordeón exclusivo (abrir uno no cierra los demás).
- Nivel de encabezado configurable: el título es un `h2`, como en PliegoStack.
- Cambiar los demás componentes; tokens o dependencias nuevas; tema oscuro.

**Aceptación.**
1. Un test comprueba que `SpecStep` es un `<details>` con el número a dos dígitos, el título como `h2`, el resumen dentro del `<summary>` y el cuerpo, y que arranca cerrado salvo `defaultOpen`.
2. Un test comprueba el modo no controlado: un clic en el `<summary>` alterna `open` y llama a `onOpenChange` con el valor nuevo.
3. Un test comprueba el modo controlado: sigue a `open`, un clic solo llama a `onOpenChange` y el DOM cambia cuando cambia la prop.
4. Un test comprueba que el botón de opciones llama a `onOptions`, tiene el nombre «Opciones de …» (con `optionsLabel` o con el título) y no abre ni cierra el paso, y que sin `onOptions` no hay botón.
5. Un test lee `SpecStep.css` y comprueba que no hay colores, tamaños ni radios literales fuera de las excepciones comentadas, que el valor se oculta con el paso abierto, que valor y cuerpo se sangran con `space-7` y que se quita el triángulo de Safari.
6. Se revisa a mano en Storybook (`npm run dev`) con teclado y `pointer: coarse` emulado: el valor y el cuerpo se alinean bajo el título, el valor desaparece con el paso abierto, el resumen mide 40/44 px, «···» no pliega el paso y el anillo de foco de 2 px es visible en el resumen y en el botón.
7. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `SpecStep` y su tipo, y no hay dependencias nuevas.
8. Hay un changeset del cambio, y `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual».

**Rollback.** Revertir el único commit del incremento.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai (Chris, 2026-10-12).
La siguiente la toma el agente al ejecutar el objetivo de completar el plan, y queda en «Decisiones abiertas»:
- El componente lleva el estado de apertura y evita el cambio nativo del `<details>` (`preventDefault` en el `<summary>`), en vez de escuchar `toggle`: así `open` controla de verdad. El teclado y el estado expandido que anuncia el `<details>` se conservan.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-7 — `ResultList`, `ResultRow` y `HowPanel`

Ver § ResultList. **Es una `<dl>`**, como en PliegoStack, no una `<ul>`: los previews del Design System la dibujan como `<ul>` y hay que corregirlos en L-13.

**Aceptación**: lista de pares `dt`/`dd`, cifras con `tabular-nums`, unidad en `stat-unit` y punteado entre filas.

## L-8 — `Notice`

Ver § Notice. Variantes `note`, `preview`, `error` y `config`, con su rol: `status` por defecto y `alert` en `error` y `config`.

## L-9 — Accesibilidad y regresión visual en CI

- Tests de Storybook (`@storybook/test-runner`, o el addon de tests si se sube de versión) con axe en cada story, y fallo ante una violación.
- Capturas por story con Playwright, comparadas contra una referencia.
- Storybook publicado en GitHub Pages.

Requiere aprobación de Chris por las dependencias nuevas.

## L-10 — Primera publicación, 0.1.0

Changeset `minor` con todo lo anterior, PR de versión y publicación. Verificar la instalación desde un proyecto vacío con `@caravenas:registry` en su `.npmrc`.

## L-11 — Radix: `Drawer`, `Tooltip`, `Toast`

- `Drawer` sobre `@radix-ui/react-dialog`, para el panel de catálogo, con las animaciones de `catalog-editor-in` y `catalog-editor-out`. **Atención**: PliegoStack decidió que el catálogo **no es modal** y no atrapa el foco (UX-REVIEW §5). Hay que decidir si el `Drawer` es no modal (`modal={false}`) antes de empezar.
- `Toast` para los avisos descartables de persistencia y de huérfanos.
- `Tooltip` solo si aparece un caso real.

## L-12 — Migrar PliegoStack

Se hace **en el repo de PliegoStack**, siguiendo su `AGENTS.md` y su `docs/PLAN.md`; aquí solo se deja el orden.

1. Instalar `@caravenas/pliego-ui` e importar `styles.css` y `fonts.css`. Eliminar el bloque `:root` de `src/styles/index.css`: los nombres de variable son los mismos. Comprobar que la app se ve idéntica (Playwright `e2e/`).
2. Un commit por componente sustituido, empezando por los botones del catálogo, y borrando cada vez las reglas CSS que dejan de usarse.
3. Eliminar el `<link>` de Google Fonts de `index.html` si se adopta `fonts.css`.

## L-13 — Re-sincronizar el Design System

Desde la librería, ya no desde la app.
- `tokens/tokens.json` se sube tal cual: tiene el mismo formato.
- Los previews pasan de estáticos a **vivos**. Se construye un `bundle.js` IIFE que lee `window.React` y `window.ReactDOM` y asigna `window.PliegoUI`, y se publica junto a `styles.css` como `components/bundle.css`.
- Los READMEs de componente salen de `docs/COMPONENTS.md`.
- Se corrige `ResultList` a `<dl>`.

Se puede hacer desde Cowork («re-sincroniza el Design System desde pliego-ui») o con el skill `appifacts-design-system-from-code` en Claude Code, si está instalado.

---

## Decisiones abiertas

1. **Radiogroup frente a `aria-pressed`.** Resuelta para `SegmentedControl` en L-3 (2026-10-12, Chris): `tablist` y `radiogroup` con tabindex móvil. En `OptionCard` (L-4) se mantuvo `aria-pressed`; ver la 14.
2. **Colores de estado sin token.** `.catalog-persistence` pinta su punto con `#15803D` (guardado) y `#B45309` (solo sesión), literales. Propuesta: `color-success` y `color-warning` en `tokens.json`, con su contraste medido.
3. **Botón en cápsula o con `radius-md`.** El rediseño dice que «todo control de entrada» va en cápsula, pero los botones del catálogo usan `radius-md`. La librería sigue el código (`radius-md`); confirmar que es intencional.
4. **Tema oscuro.** No existe. El formato lo admite (`color.themes`); decidir si se quiere antes de 1.0.
5. **Versiones.** Se fijaron las combinaciones probadas en PliegoStack (Vite 6, React 18 en desarrollo, TS 5.6, Storybook 8.6), más Vitest 3. Ya hay versiones mayores (Vite 8, Storybook 10, TS 7). Subir en un incremento propio, no mezclado.
6. **React 19.** `peerDependencies` lo admite, pero los tests corren en 18. Añadir una matriz 18/19 en CI cuando haya consumidor en 19.
7. **El `Drawer` modal o no** (ver L-11).
8. **Tratamiento del error de `Field` (L-2).** El origen pintaba el error con un borde `rgba(244, 63, 94, 0.3)`, literal que el proyecto prohíbe. Chris aprobó (2026-10-12) texto y filete izquierdo de 2 px en `color-danger-foreground`, sin tokens nuevos. Falta contrastarlo con la nota de uso de ese token en el Design System.
9. **Margen derecho de `Select` (L-2).** Los 36 px salen de `calc(var(--space-3) + var(--space-6))` y la posición del triángulo de `var(--space-3)`, para no dejar literales. Los pesos de 1 px (borde) y 2 px (anillo y filete) se aceptan como literales, igual que en `Input`. Si el sistema prefiere un token de «margen de control», se añade en un incremento propio.
10. **`pointer: coarse` sin emulación (L-2).** La verificación manual midió 40 px de alto, 36 px de padding, foco de 2 px con 2 px de separación y la marginalia pegada a la derecha. Los 44 px con `pointer: coarse` solo están en el CSS: no se pudo emular en el navegador.
11. **Estilo de texto de `options` (L-3).** `SegmentedControl` usa `central-tab` (mayúsculas, 0,16 em) también en `kind="options"`. Confirmar si formato y proporción deben llevar ese estilo o el de `form-input`.
12. **Teclas verticales (L-3).** `options` responde a izquierda y derecha, Inicio y Fin, como pedía el brief; un `radiogroup` nativo también responde a arriba y abajo. Añadirlas si se quiere paridad con el nativo.
13. **`pointer: coarse` sin emulación (L-3).** Igual que en L-2: los 44 px solo están en el CSS y no se midieron en el navegador.
14. **`OptionCard` con `aria-pressed` (L-4).** Decidido por el agente al ejecutar el objetivo de completar el plan, sin confirmación de Chris: mantiene la API y la semántica de PliegoStack. Confirmar o pasar a `radio` con el teclado de `SegmentedControl`. Los 44 px con `pointer: coarse` solo están en el CSS (no se emuló).
15. **Excepciones de tamaño de `OptionCard` (L-4).** La caja del dibujo (34px) y el paso fino del texto (2px) siguen literales y comentados, como en PliegoStack: la escala no tiene equivalente.
16. **Foco de `MeasureField` (L-5).** Anillo de tinta de 2 px con 3 px de separación, según `COMPONENTS.md`, frente a la regla general del anillo de `color-accent-ink`. Confirmar que la cota es la excepción.
17. **Alineación de `MeasureField` (L-5).** El valor se alinea al centro dentro de 40 px de alto mínimo, no por la línea base como en PliegoStack: puede moverse unos píxeles la cifra respecto al origen. Comparar con el original y ajustar si molesta.
18. **Estado de `SpecStep` (L-6).** El componente lleva el estado y evita el cambio nativo del `<details>` para que `open` controle de verdad. Si se prefiere el comportamiento nativo con `onToggle`, el control deja de ser estricto. El resumen tiene el área de puntero de 40/44 px; los 44 px solo están en el CSS.
19. **Alineación de `SpecStep` (L-6).** Con `space-7` (28 px) el valor y el cuerpo quedan a 1,6 px a la derecha del título medido en Storybook (el número de dos dígitos en mono de 12 px más el hueco de 12 px suman 26,4 px). Es el valor de PliegoStack; si se quiere alineación exacta, la sangría debería salir del ancho del número y no de un paso de la escala.
