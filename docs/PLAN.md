# Plan — pliego-ui

Plan canónico de la librería. Un agente implementa **solo** el incremento marcado como siguiente en la tabla de estado y, al cerrarlo, la actualiza.

## Estado actual

- Scaffold en `main` (`9db7d12`): Vite en modo librería, TS, Storybook 8.6, Vitest 3, Changesets y el pipeline de tokens.
- Primitivos hechos: `Button` (primary, secondary, outline, danger; forma `round`), `Badge` / `OriginBadge`, `Input`, `Select`, `Field`, `SegmentedControl`, `OptionField`, `OptionCard`, `MeasureField`, `MeasureGrid`, `SpecStep`, `ResultList`, `ResultRow`, `HowPanel`, `Notice`, `Drawer` y `Toast`. 125 tests en verde, 48 stories sin violaciones de axe y 48 capturas de referencia (L-9, 2026-10-13).
- Aún sin remoto en GitHub, sin CI y sin publicar.
- L-0 está a medias (2026-10-12): las dependencias ya están instaladas en macOS y `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0. Falta limpiar los restos de git de la VM Linux (`.git/stale-*` y `tmp_obj_*`) y crear el remoto.
- L-2 cerrado: `Field` (enlaza el control por `id`, error con `role="alert"`, nota al margen y nota de origen) y `Select` (desplegable nativo en cápsula, triángulo en `color-text-muted`).
- L-3 cerrado: `SegmentedControl` con `tablist` (`tabs`) y `radiogroup` (`options`), un punto de tabulación, flechas, Inicio y Fin. Resuelve la decisión abierta 1 para este componente.
- L-4 cerrado: `OptionField` (sobre `Field` con `group`) y `OptionCard` (botón con `aria-pressed`, rejilla y escala).
- L-5 cerrado: `MeasureField` y `MeasureGrid` (escribir, flechas, arrastre con captura de puntero).
- L-6 cerrado: `SpecStep` (`<details>` numerado con valor en el estado cerrado y `open` controlado o no).
- L-7 cerrado: `ResultList` y `ResultRow` (`<dl>` con `tabular-nums`) y `HowPanel`.
- L-8 cerrado: `Notice` (note, preview, error, config) con rol según la variante. Con él están todos los componentes de la fase de diseño; lo que queda necesita a Chris o dependencias nuevas (ver L-9 en adelante).
- L-0 hecho: el remoto es `git@github.com:caravenas/pliego-ui.git` y `main` está publicado (2026-10-13).
- L-1, primera ejecución real (2026-10-13): **CI en verde** en Linux (typecheck, tests, build, build de Storybook y axe en las 48 stories). **Release** versiona y sube `changeset-release/main`, pero falla al abrir el PR porque «GitHub Actions is not permitted to create or approve pull requests»: hay que activarlo en Settings → Actions → General → Workflow permissions. **Storybook (Pages)** falla porque Pages no está habilitado en el repositorio (Settings → Pages → Source: GitHub Actions).
- L-11, parcial: `Drawer` no modal sobre Radix Dialog y `Toast` sobre Radix Toast (dependencias autorizadas por Chris el 2026-10-13). Falta `Tooltip`, que solo se hace si aparece un caso real.
- L-9 cerrado en local: axe sobre las 48 stories (`npm run test:a11y`) y capturas comparadas (`npm run test:visual`). En CI corren axe y la medición de áreas de puntero (`npm run test:touch`), no las capturas, cuyas referencias son de macOS. `pages.yml` despliega Storybook en Pages (verificado el 2026-10-13).
- L-1 cerrado (2026-10-13): con los dos permisos activados, el release abrió el PR de versión y, al mergearlo, publicó `@caravenas/pliego-ui@0.1.0` en GitHub Packages con `GITHUB_TOKEN` y creó el tag `v0.1.0`. Storybook se publica en https://caravenas.github.io/pliego-ui/.
- L-10 cerrado (`e10826c`, 2026-10-13): `@caravenas/pliego-ui@0.1.0` se instala desde un proyecto vacío con `@caravenas:registry` en su `.npmrc`, trae `@radix-ui/react-dialog` y `react-toast` como dependencias, exporta los 18 componentes y `./styles.css` y `./tokens.json` resuelven.
- L-13 cerrado (2026-10-16, `50d65e0`): `npm run ds:build` produce el árbol y `npm run ds:check` (33 pruebas) lo comprueba. Chris confirmó la publicación y se publicó en el artifact: 14 tarjetas vivas con `bundle.js` (`window.PliegoUI`), `bundle.css`, tokens de la librería (con `space-7`) y el README de marca al día; se sustituyeron `FormField`, `OptionGroup`, `CentralTabs` y `Notices`; `AppHeader`, `CatalogBoard`, `CatalogPanel`, `Panel` y la cubierta se conservaron. Las huellas de `bundle.js`, `bundle.css`, `tokens.json` y de un preview coinciden con lo generado, y las tarjetas se ven vivas en el artifact abierto. La copia de seguridad previa está en `design-system/backup-2026-10-15/` (local, ignorada por git).
- Decisiones cerradas (2026-10-16): las 38 abiertas se resolvieron (ver «Decisiones»), con tres cambios de código: teclas arriba y abajo en `options`, `min-height: 40px` en `OptionCard` y una espera correcta en las pruebas de navegador, que además miden ahora las áreas de puntero en las 48 stories.
- L-14 cerrado (2026-10-19): `Amount`, `MovementsTable` y `TrendChart` (SVG propio) con el token `color-success-foreground`; 163 tests, 61 stories sin violaciones de axe, áreas de puntero medidas y 61 capturas. Quedan pendientes los incrementos siguientes del dashboard (ver «Pendiente» de L-14) y republicar el Design System, que no incluye aún las tarjetas ni el token nuevos.
- L-15 cerrado (2026-10-20): `Metric` (cifra clave con variación escrita), `DataPanel` (carga, error y datos anteriores, con anuncios y foco) y el selector de periodo como `SegmentedControl` endurecido; el abono pasa a azul y hay un estilo de texto `metric-value`. 218 tests, 77 stories sin violaciones de axe, áreas de puntero medidas y 77 capturas. Queda pendiente la revisión manual de Chris y republicar el Design System, que no incluye L-14 ni L-15.
- L-16 cerrado (2026-10-20): `BarChart` (barras agrupadas en SVG propio; cuatro series distinguibles sin color por nombre, posición y relleno de tinta) y orden y filtro opt-in en `MovementsTable`. 270 tests, 89 stories sin violaciones de axe, áreas de puntero medidas y 89 capturas; las 77 anteriores sin tocar. Queda pendiente la revisión manual de Chris y republicar el Design System, que no incluye L-14, L-15 ni L-16.
- L-17 cerrado (2026-10-21): el dashboard de finanzas compuesto. `usePanelData` (carga por periodo; descarta lo tardío y deriva `loading` en el mismo render), `DashboardStatus` (un solo anunciador: «cargando N paneles» una vez y los errores juntos), `DashboardGrid` y `DashboardCell` (3, 2 y 1 columnas con el orden del DOM igual al visual), `announce` en `DataPanel` y la story `Finanzas/Dashboard`. Queda pendiente la revisión manual de Chris y republicar el Design System, que no incluye L-14 a L-17. Con esto no queda nada del dashboard de finanzas en el «Pendiente».
- L-18 cerrado (2026-11-06): `ci.yml` corre typecheck, tests, build, Storybook, axe y áreas de puntero en React 18 y en React 19, y comprueba que la versión instalada es la de la celda. Ejecución real en verde en las dos celdas (PR #3, ejecución 42150949599). Con React 19 solo falló el typecheck de una story (`useRef<T>()` sin argumento en `DataPanel.stories.tsx`), ya arreglada; los 338 tests y las 288 pruebas de navegador (96 stories) pasan en las dos versiones. El brief decía 89 stories: son 96 desde L-17. La compatibilidad con React 19 queda comprobada solo hasta donde llegan esas pruebas; no hay un consumidor real en 19.
- **Siguiente:** no queda ningún incremento abierto salvo `Tooltip`, que solo se hace si aparece un caso real. L-12 (migrar PliegoStack) se descartó: es trabajo de ese proyecto.

| Id | Incremento | Estado | Commit |
| --- | --- | --- | --- |
| L-0 | Puesta en marcha local y remoto | hecho (Chris, 2026-10-13: remoto creado y `main` publicado) | |
| L-1 | CI en GitHub Actions | hecho (CI y release verificados el 2026-10-13) | ver `git log` (`ci: add CI and release workflows`) |
| L-2 | `Field` y `Select` | hecho | ver `git log` (`feat: add Field and Select`) |
| L-3 | `SegmentedControl` | hecho | ver `git log` (`feat: add SegmentedControl`) |
| L-4 | `OptionField` y `OptionCard` | hecho | ver `git log` (`feat: add OptionField and OptionCard`) |
| L-5 | `MeasureField` | hecho | ver `git log` (`feat: add MeasureField`) |
| L-6 | `SpecStep` | hecho | ver `git log` (`feat: add SpecStep`) |
| L-7 | `ResultList`, `ResultRow` y `HowPanel` | hecho | ver `git log` (`feat: add ResultList and HowPanel`) |
| L-8 | `Notice` | hecho | ver `git log` (`feat: add Notice`) |
| L-9 | Accesibilidad y regresión visual en CI | hecho en local (CI y Pages sin ejecutar) | ver `git log` (`test: add accessibility and visual regression checks`) |
| L-10 | Primera publicación, 0.1.0 | hecho (publicado e instalado desde un proyecto vacío, 2026-10-13) | `e10826c`, tag `v0.1.0` |
| L-11 | Radix: `Drawer` (catálogo), `Tooltip`, `Toast` | parcial: `Drawer` y `Toast` hechos; `Tooltip` pendiente (solo con un caso real) | ver `git log` (`feat: add Drawer`, `feat: add Toast`) |
| L-12 | Migrar PliegoStack a la librería | descartado (Chris, 2026-10-13): es trabajo del proyecto PliegoStack | |
| L-14 | `Amount`, `MovementsTable` y `TrendChart` | hecho, con la revisión manual de Chris pendiente | ver `git log` (`feat: add Amount, MovementsTable and TrendChart`) |
| L-15 | `Metric`, `DataPanel` y el selector de periodo | hecho, con la revisión manual de Chris pendiente | ver `git log` (`feat: add Metric and DataPanel`) |
| L-16 | `BarChart` y orden y filtro de `MovementsTable` | hecho, con la revisión manual de Chris pendiente | ver `git log` (`feat: add BarChart and sort and filter for MovementsTable`) |
| L-17 | El dashboard de finanzas compuesto | hecho, con la revisión manual de Chris pendiente | ver `git log` (`feat: add the composed finance dashboard`) |
| L-18 | Matriz React 18/19 en CI | hecho (CI en verde en las dos celdas, PR #3, ejecución 42150949599) | `f2ae025` |
| L-19 | La verificación de `pliego-ui` como skill | propuesto (brief sin aprobar) | |
| L-13 | Re-sincronizar el Design System desde la librería | hecho (publicado en el artifact el 2026-10-16, versión 14) | `50d65e0` |

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
- Export en `src/index.ts` con los tipos, un changeset, y actualizar en `docs/COMPONENTS.md` la línea de `options` y en «Decisiones» la decisión 1.

**No objetivos.**
- Paneles de pestañas (`tabpanel`) o cualquier contenido que cambie con la selección: lo aporta el consumidor.
- `OptionField` y `OptionCard` (L-4): allí se decide su semántica por separado, aunque reutilicen el hook de teclado.
- Selección múltiple, segmentos con icono o con contador, y orientación vertical.
- Cambiar `Button`, `Input`, `Select` o `Field`; tokens nuevos; dependencias nuevas; tema oscuro.
- Migrar `CentralViewTabs` de PliegoStack: es trabajo de ese proyecto.

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
La siguiente la toma el agente al ejecutar el objetivo de completar el plan, y queda registrada en «Decisiones» para que Chris la confirme o la cambie:
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
Las dos siguientes las toma el agente al ejecutar el objetivo de completar el plan, y quedan en «Decisiones» para que Chris las confirme:
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
La siguiente la toma el agente al ejecutar el objetivo de completar el plan, y queda en «Decisiones»:
- El componente lleva el estado de apertura y evita el cambio nativo del `<details>` (`preventDefault` en el `<summary>`), en vez de escuchar `toggle`: así `open` controla de verdad. El teclado y el estado expandido que anuncia el `<details>` se conservan.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-7 — `ResultList`, `ResultRow` y `HowPanel`

Ver `docs/COMPONENTS.md` § ResultList. **Es una `<dl>`**, como en PliegoStack, no una `<ul>`: los previews del Design System la dibujan como `<ul>` y hay que corregirlos en L-13. Origen: `src/components/ResultList.tsx`, `HowItIsCalculated.tsx` y los selectores `.result-*`, `.stat-*` y `.how-panel*`.

**Objetivo.**
Que quien muestra resultados calculados tenga una lista de cifras con su nombre y su unidad, alineables en columna, y el panel que dice de qué están hechas, sin repetir el marcado ni las clases en cada proyecto.

**Alcance.**
- `ResultList` (`<dl>`) y `ResultRow` (`label`, `unit?`, `children`; `<div>` con `dt` y `dd`), con `forwardRef` y las props nativas.
- Cifras con `tabular-nums` y sin salto de línea, unidad en `stat-unit` junto al número, filas con punteado de `color-border`.
- `HowPanel` con `title` («Cómo se calcula» por defecto), `formulas: ReactNode[]` (una por línea), `children` (texto explicativo) y `note`. No pinta nada si no hay fórmulas ni texto.
- Estilos con variables y clases `pui-`, y los estilos de texto `stat-label`, `stat-value`, `stat-unit` y `mono-note` de los tokens.
- Stories, tests, export con tipos y un changeset.

**No objetivos.**
- Calcular los resultados, formatear cifras o conocer sus unidades: el consumidor aporta el texto.
- Una nota por defecto en `HowPanel` («valores preliminares…»): es copia de PliegoStack y el consumidor la pasa por `note`.
- Un plegable para `HowPanel`: va abierto, como en el Design System.
- Cambiar los demás componentes; tokens o dependencias nuevas; tema oscuro.

**Aceptación.**
1. Un test comprueba que `ResultList` es una `<dl>` cuyas filas son `div` con un `dt` y un `dd`, con los roles `term` y `definition`.
2. Un test comprueba que la unidad va en el `dd`, junto a la cifra, y que sin unidad no queda nodo.
3. Un test comprueba que la ref y las props nativas pasan en `ResultList`, `ResultRow` y `HowPanel`.
4. Un test comprueba que `HowPanel` es una región con el título por defecto y un `h3`, que cada fórmula va en su línea, que pinta `children` y la nota, y que sin fórmulas ni texto no pinta nada, ni siquiera la nota.
5. Un test lee `ResultList.css` y `HowPanel.css` y comprueba que no hay colores, tamaños ni radios literales, y que hay `tabular-nums`, `nowrap` y el punteado de `color-border`.
6. Se revisa a mano en Storybook (`npm run dev`): las cifras se alinean a la derecha en columna, la unidad se ve pequeña y en muted, el punteado entre filas y el filete de tinta del panel.
7. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `ResultList`, `ResultRow`, `HowPanel` y sus tipos, y no hay dependencias nuevas.
8. Hay un changeset del cambio, y `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual».

**Rollback.** Revertir el único commit del incremento.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai (Chris, 2026-10-12).
La siguiente la toma el agente al ejecutar el objetivo de completar el plan, y queda en «Decisiones»:
- `HowPanel` devuelve `null` también cuando solo tiene nota, como `HowItIsCalculated` cuando no hay nada que explicar: una nota sin nada que calificar no se pinta.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-8 — `Notice`

Ver `docs/COMPONENTS.md` § Notice. Origen: `.calculation-note`, `.preview-notice`, `.calculation-error` y `.config-error*` de PliegoStack.

**Objetivo.**
Que quien construye una interfaz tenga un aviso con cuatro tonos (nota, vista previa, error y error de configuración), con el rol de lectura de pantalla que le corresponde, sin repetir las clases ni decidir en cada sitio si se anuncia con calma o al momento.

**Alcance.**
- `Notice` con `variant` (`note`, `preview`, `error`, `config`), `title?` y `children`; `forwardRef` y las props nativas.
- El rol sale de la variante: `status` en `note` y `preview`, `alert` en `error` y `config`.
- El error pinta su borde derivado de `color-danger-foreground` (`color-mix`) en vez del `rgba(244, 63, 94, 0.3)` de origen, sin tokens nuevos.
- Estilos con variables y clases `pui-`, stories de las cuatro variantes, tests, export con tipos y un changeset.

**No objetivos.**
- Avisos descartables o con acción (`Toast`, L-11) ni foco gestionado.
- Redactar los mensajes: un error dice qué regla falla, y eso lo escribe el consumidor.
- Márgenes exteriores: los pone quien coloca el aviso.
- Cambiar los demás componentes; tokens o dependencias nuevas; tema oscuro.

**Aceptación.**
1. Un test comprueba el rol de cada variante (`status` en `note` y `preview`, `alert` en `error` y `config`) y su clase.
2. Un test comprueba que el título es una línea antes del texto y no un encabezado, y que sin título no hay nodo.
3. Un test comprueba que la ref y las props nativas pasan, incluso un `role` distinto.
4. Un test lee `Notice.css` y comprueba que no hay colores, tamaños ni radios literales, y que el borde del error se deriva de `color-danger-foreground`.
5. Se revisa a mano en Storybook (`npm run dev`): las cuatro variantes se leen por sus palabras y no solo por el color, y el error mantiene contraste suficiente de su texto.
6. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `Notice` y sus tipos, y no hay dependencias nuevas.
7. Hay un changeset del cambio, y `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual».

**Rollback.** Revertir el único commit del incremento.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai (Chris, 2026-10-12).
La siguiente la toma el agente al ejecutar el objetivo de completar el plan, y queda en «Decisiones»:
- El borde del error es `color-mix(in srgb, var(--color-danger-foreground) 30%, transparent)`: deriva del token, como pide `COMPONENTS.md`, y conserva el 30% de origen. Difiere del filete izquierdo que Chris aprobó para el error de `Field`: ahí es una línea bajo un control, aquí un aviso con caja.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-9 — Accesibilidad y regresión visual en CI

Cada story del Storybook compilado se somete a axe y a una captura comparada contra su referencia, con Playwright. Origen: ninguno; es infraestructura de la librería.

**Objetivo.**
Que una violación de accesibilidad o un cambio visual no intencionado en cualquier story se detecte al abrir un PR y no cuando alguien lo ve en producción.

**Alcance.**
- `e2e/a11y.spec.ts`: una prueba por story que corre axe (WCAG 2.1 A y AA) sobre la story abierta en `iframe.html` y falla ante cualquier violación, con la regla y el selector en el mensaje.
- `e2e/visual.spec.ts`: una captura por story comparada con su referencia versionada.
- `playwright.config.ts`, un servidor estático propio (`scripts/serve-static.mjs`, solo Node) y los scripts `test:a11y`, `test:visual` y `test:visual:update`, que compilan Storybook antes.
- Las fuentes de Google se bloquean en las pruebas: con red cargarían Inter y sin red la pila de respaldo, y una comparación necesita lo mismo las dos veces.
- Las dependencias de desarrollo `@playwright/test` y `@axe-core/playwright`, autorizadas por Chris el 2026-10-13.
- El paso de a11y en `ci.yml` y `.github/workflows/pages.yml`, que publica `storybook-static` en GitHub Pages.
- Arreglar lo que axe encuentre en las stories actuales.

**No objetivos.**
- Ejecutar las capturas en CI: sus referencias son de macOS y una captura de otro sistema no es comparable. Hace falta generar referencias de Linux (en CI o con Docker) antes.
- `@storybook/test-runner` (el plan lo nombraba): necesita `jest-image-snapshot` para las capturas, una tercera dependencia que Chris no aprobó, mientras que Playwright Test las trae.
- Pruebas de interacción por story (`play`) o de varios navegadores o tamaños.
- Cambiar los componentes más allá de lo que axe pida.

**Aceptación.**
1. `npm run test:a11y` termina en 0 con las 48 stories actuales, en tres ejecuciones seguidas, y una violación introducida a propósito (el `nested-interactive` que axe encontró en `SpecStep`) la hace fallar.
2. `npm run test:visual` termina en 0 con las referencias generadas, en tres ejecuciones seguidas, y un cambio de estilo introducido a propósito falla en la story afectada y solo en ella.
3. `npm test` no recoge las pruebas de `e2e/` y sigue en verde, y `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0.
4. Un test de Vitest comprueba el comportamiento de `SpecStep` tras mover el botón de opciones fuera del `<summary>`: no está dentro de él ni del `<details>`, y su clic no abre ni cierra el paso.
5. `ci.yml` ejecuta axe tras compilar Storybook, y `pages.yml` está escrito: revisión manual de ambos archivos, porque no se ejecutarán hasta que exista el remoto.
6. Hay un changeset del cambio (el de `SpecStep`) y `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual».

**Rollback.** Revertir el único commit del incremento y desinstalar `@playwright/test` y `@axe-core/playwright`.

**Decisiones ya tomadas.**
Chris autorizó las dependencias de L-9 (2026-10-13).
Las siguientes las toma el agente al ejecutar el objetivo de completar el plan, y quedan en «Decisiones»: Playwright Test y `@axe-core/playwright` en lugar de `@storybook/test-runner`; las capturas solo en local; y mover el botón «···» de `SpecStep` fuera del `<summary>` para cumplir axe.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-10 — Primera publicación, 0.1.0

Changeset `minor` con todo lo anterior, PR de versión y publicación. Verificar la instalación desde un proyecto vacío con `@caravenas:registry` en su `.npmrc`.

## L-11 — Radix: `Drawer`, `Toast`, `Tooltip`

Se hace por partes. **Entregado: `Drawer` y `Toast`**; `Tooltip` sigue pendiente porque solo se hace si aparece un caso real. Origen del `Drawer`: `CatalogPanel.tsx`, `.catalog-editor*` y `.catalog-*` de PliegoStack; el `Toast` no tiene origen, porque PliegoStack no tiene avisos descartables.

**Objetivo.**
Que quien construye una herramienta con una vista principal tenga un panel lateral que entra sobre ella sin taparla ni bloquearla, y avisos que se descartan sin interrumpir lo que se está haciendo, con el teclado y los lectores de pantalla resueltos.

**Alcance.**
- `Drawer` sobre `@radix-ui/react-dialog` con `modal={false}`: `open`, `defaultOpen`, `onOpenChange`, `title`, `closeLabel` («Cerrar» por defecto) y `children`.
- Lo que un modal daba gratis y un panel necesita que se le diga: Escape lo cierra, el foco entra en el panel (no en el botón de cerrar) al abrir y vuelve a donde estaba al cerrar, y un clic fuera no lo cierra.
- El `Drawer` entra y sale por el borde derecho con `catalog-editor-in` y `-out` como animaciones, con sus duraciones y curvas en dos tokens de movimiento nuevos (`transition-drawer-in` y `transition-drawer-out`, con su `usage`), opaco en la salida y sin movimiento con `prefers-reduced-motion`.
- `ToastProvider` (lleva la región de avisos, con nombre «Avisos (F8)») y `Toast` sobre `@radix-ui/react-toast`: `open`, `defaultOpen`, `onOpenChange`, `variant` (`note` o `error`), `title`, `duration`, `closeLabel`, `action` y `children`.
- Una `note` del `Toast` se va sola a los 5 s y se anuncia con calma; un `error` no se va solo (`Infinity`) y se anuncia al momento; `duration` lo sustituye. Se descarta con el botón o con el dedo, y la acción opcional llama a `onAction`.
- El `Toast` tiene el tratamiento visual de `Notice` (borde de tinta; el del error, derivado de `color-danger-foreground`), sin sombra porque el sistema las desactiva, y entra y sale con `transition-normal`, que estaba declarado sin uso.
- Las dependencias `@radix-ui/react-dialog` y `@radix-ui/react-toast`, externas en el build de la librería, dos changesets, stories y tests.

**No objetivos.**
- `Tooltip`: solo si aparece un caso real, como dice el plan.
- Modalidad o lado configurables del `Drawer`, o un `Drawer` en el flujo del documento como el `catalog-editor` de PliegoStack.
- Pie, descripción o contenido del `Drawer`, y el estado de persistencia de la cabecera del catálogo: los pone el consumidor.
- Una API imperativa de avisos (`toast(...)`, una cola global), posición configurable o apilado con límite.
- Redactar los mensajes de los avisos.

**Aceptación.**
1. Un test comprueba que el `Drawer` cerrado no pinta nada y que abierto es un `dialog` nombrado por su título, sin `aria-modal`.
2. Un test comprueba que en el `Drawer` Escape y el botón de cerrar llaman a `onOpenChange(false)` y que `closeLabel` cambia el nombre del botón.
3. Un test comprueba que el `Drawer` no es modal (un clic en otro control no lo cierra y la página no se oculta con `aria-hidden`) y que el foco entra en el panel al abrir y vuelve al control que lo abrió.
4. Un test comprueba que la región de avisos tiene nombre, que el `Toast` muestra título y texto, que descartarlo pide cerrar y lo quita, que `closeLabel` cambia su nombre y que la acción llama a `onAction`.
5. Un test comprueba que el `Toast` controlado sigue a `open`, que una nota se va sola pasado su `duration` y que un error sigue abierto 60 s después.
6. Un test lee `Drawer.css` y `Toast.css` y comprueba que no hay colores, tamaños, radios ni duraciones literales fuera de las excepciones comentadas, que el movimiento sale de los tokens y que `prefers-reduced-motion` lo desactiva.
7. Se revisa a mano en Storybook (`npm run dev`) con teclado y `pointer: coarse` emulado: el `Drawer` entra y sale por la derecha y la vista de abajo sigue manejable, el `Toast` entra por abajo a la derecha, el error se lee por sus palabras y sigue abierto, los botones miden 40/44 px y el anillo de foco de 2 px es visible.
8. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `Drawer`, `Toast`, `ToastProvider` y sus tipos, y las únicas dependencias nuevas son `@radix-ui/react-dialog` y `@radix-ui/react-toast`, externas en `dist`.
9. Hay un changeset por entrega, y `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual».

**Rollback.** Revertir los commits del `Drawer` y del `Toast` y desinstalar `@radix-ui/react-dialog` y `@radix-ui/react-toast`.

**Decisiones ya tomadas.**
Chris autorizó la instalación de `@radix-ui/react-dialog` (2026-10-13), y aprobó `@radix-ui/react-toast` el mismo día.
Las siguientes las toma el agente al ejecutar el objetivo de completar el plan, y quedan en «Decisiones» para que Chris las confirme:
- El `Drawer` es **no modal**, con la evidencia del origen: PliegoStack pasó su catálogo de diálogo modal a panel (R-24) al ver que la lámina de cristal tapaba la vista desde la que se pulsó «editar», y su `UX-REVIEW` no atrapa el foco en el interruptor de vistas.
- Un `Toast` de error no se va solo, porque un mensaje que desaparece a los 5 s no lo lee quien tarda más; y el `Toast` no tiene API imperativa.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-13 — Re-sincronizar el Design System

Se publica **en el artifact de claude.ai** (https://claude.ai/artifact/81WGnnxqtHUGnc6yK9DAHe), que es la referencia principal de estilo; desde ahora lo produce la librería y no la app. El artifact se leyó el 2026-10-15: es de tipo «Design System», tiene 42 archivos, doce tarjetas de componente con previews estáticos sobre una copia de la hoja de estilos de PliegoStack (`components/bundle.css`), sin `bundle.js`, y su `tokens.json` es de la sincronización del 2026-09-23 (`master@5b1354e`).

**Objetivo.**
Que el Design System de claude.ai describa y muestre la librería que existe, con previews vivos de sus componentes reales, para que lo que Chris ve en el artifact y lo que instala el paquete `0.1.0` sean lo mismo.

**Alcance.**
- Un productor reproducible dentro de la librería: `scripts/build-design-system.ts` y `npm run ds:build`, que escriben la carpeta `design-system/` (ignorada por git) con el árbol `project/` que pide el tipo. Las fuentes de las tarjetas viven en el repositorio: `docs/design-system/` (el README de marca y un README por componente) y `scripts/design-system/` (los previews y la hoja heredada).
- `components/bundle.js`: un IIFE clásico que lee `window.React` y `window.ReactDOM` y asigna `window.PliegoUI`, con el jsx runtime sustituido por una capa sobre `createElement`, con su cabecera `@ds-bundle` y dentro del tope de 6 MB. Se construye con el `vite build` de la librería, sin dependencias nuevas.
- `components/bundle.css`: la hoja de estilos de la librería (`dist/styles.css`, con los tokens) seguida de la hoja actual del artifact sin tocar, para que las tarjetas que se conservan mantengan su aspecto.
- Una tarjeta nueva por componente de la librería, con `README.md` y `preview.html` vivo: `Button`, `Badge`, `Input`, `Select`, `Field`, `SegmentedControl`, `OptionField`, `MeasureField`, `SpecStep`, `ResultList`, `HowPanel`, `Notice`, `Drawer` y `Toast`. Los READMEs parten de los que ya tenía el artifact, con su voz, puestos al día con la API de la librería (los de `Button`, `Badge`, `Input`, `Select`, `Drawer` y `Toast` son nuevos). `ResultList` pasa a `<dl>`.
- `tokens.json` de la librería, tal cual, y `components/index.d.ts` con los tipos.
- Actualizar `project/README.md` donde ya es falso (el escalón `space-7` ya existe, hay `bundle.js`, el movimiento ya se usa en `Drawer` y `Toast`) y su sección «No sincronizado»; conservar el resto de la prosa. Índice con `namespace` `PliegoUI`, `libraries` de React 18 y `lastChange` con `via` «GitHub · caravenas/pliego-ui@<sha>».
- Una copia de seguridad local de los 42 archivos actuales antes de publicar.
- Una comprobación con Playwright (`npm run ds:check`) que abre cada preview en un navegador con React 18 y exige que se pinte sin errores de consola y sin violaciones de axe.

**No objetivos.**
- Tocar el repositorio de PliegoStack o migrar nada de él (L-12 está descartado).
- Tocar las tarjetas `AppHeader`, `CatalogBoard`, `CatalogPanel` y `Panel`, ni la cubierta, que se conservan tal cual.
- Borrar archivos del artifact sin tu confirmación, o reescribir la prosa de marca del `README.md` más allá de lo que ya es falso.
- Publicar los previews como sitio propio; es el artifact quien los sirve.
- Un tema oscuro o tokens nuevos.
- Subir fuentes: Inter, Outfit y JetBrains Mono se siguen cargando desde Google Fonts.

**Aceptación.**
1. `npm run ds:build` termina en 0 y la salida cumple el formato del tipo: `components/bundle.js` empieza por su cabecera `@ds-bundle`, es un script clásico sin `</script` ni `<!--` y pesa menos de 6 MB, y cada tarjeta tiene su `README.md` y su `preview.html` con la línea `@dsCard`.
2. `npm run ds:check` termina en 0: cada preview se pinta con `window.PliegoUI` y React 18 sin errores de consola, y pasa axe sin violaciones.
3. `npm run ds:check` comprueba que `window.PliegoUI` exporta todo lo que exporta `src/index.ts`, que `tokens.json` de la salida es idéntico al de `tokens/tokens.json` y que `bundle.js` cumple el formato (cabecera `@ds-bundle` en la línea 1, sin `import` ni `</script`, menos de 6 MB).
4. Tras publicar, una lectura de vuelta del artifact muestra los archivos cambiados con el contenido de `design-system/` y la versión anterior intacta en la copia de seguridad.
5. Se revisa a mano en el artifact abierto en el navegador: las tarjetas muestran los componentes vivos, `ResultList` es una `<dl>` y la cubierta se mantiene.
6. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, y no hay dependencias nuevas.
7. `docs/PLAN.md` actualiza la tabla de estado y la sección «Estado actual», y hay un único commit con el productor.

**Rollback.** Revertir el commit del productor, y republicar en el artifact la copia de seguridad de `design-system/backup-2026-10-15/`.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai (Chris, 2026-10-12). Chris pidió continuar con L-13 el 2026-10-15.
Las siguientes las propone el agente que escribió este brief y quedan confirmadas al aprobarlo:
- El `namespace` del bundle es `PliegoUI`, como decía el plan, y no el actual `PliegoStack`.
- Se usa el `vite build` de la librería (formato IIFE) y no `esbuild` ni `bun`, que no son dependencias declaradas.
- Las tarjetas de vistas de la app (`AppHeader`, `CatalogBoard`, `CatalogPanel`, `Panel`) se dejan como están, estáticas (Chris, 2026-10-15).
- Las cuatro tarjetas que la librería reemplaza con otro nombre se sustituyen: se borran `FormField`, `OptionGroup`, `CentralTabs` y `Notices`, y se crean `Field`, `OptionField`, `SegmentedControl` y `Notice`; la copia de seguridad conserva las antiguas (Chris, 2026-10-15). `HowPanel`, `MeasureField`, `ResultList` y `SpecStep` conservan su nombre y se sobrescriben.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-14 — Cifras de finanzas: `Amount`, `MovementsTable` y `TrendChart`

Primer incremento de un dashboard de finanzas. Sin origen en PliegoStack: es trabajo nuevo, y el Design System de claude.ai **no cubre** cifras monetarias, tablas de movimientos ni gráficas; las decisiones de abajo llenan ese vacío y las confirmó Chris.

**Objetivo.**
Que quien construye un dashboard de finanzas pueda mostrar un importe, una lista de movimientos y la evolución de una serie con el mismo lenguaje que el resto de la librería, de modo que una persona lo lea y lo recorra con el teclado sin depender del color.

**Alcance.**
- `Amount`: un importe en `mono` con `tabular-nums`, formateado con `Intl.NumberFormat` a partir de `value`, `currency` (código ISO 4217) y `locale`. Un negativo lleva su signo en el texto; un valor ausente o no numérico se escribe «sin dato», nunca `0` ni `NaN`.
- `MovementsTable`: una `<table>` con `<caption>`, `<th scope>` y columnas fecha, concepto e importe (con `Amount`, alineado a la derecha). Sin movimientos muestra una fila con «sin movimientos». Es solo lectura: sin orden, paginación ni selección.
- `TrendChart`: gráfica de línea en SVG propio con `role="img"`, nombre accesible y una tabla de los mismos valores disponible en el DOM, que es el equivalente textual. Sin puntos muestra «sin datos para graficar»; con un solo punto dibuja un punto marcado y su valor escrito, sin línea.
- Stories de los tres (por defecto, vacío, un solo punto, negativos, valor desconocido), tests, exportaciones con tipos y un changeset `minor`.
- El resto del dashboard queda anotado como pendiente en este plan (ver «Pendiente») y no se construye.

**No objetivos.**
- Barras, tarta, apiladas, varias series o leyendas: pendiente.
- Tarjeta de saldo o KPI con variación, selector de periodo, filtros y orden de la tabla: pendiente.
- Conversión entre monedas, cálculo de totales o saldos: el consumidor aporta los valores ya calculados.
- Dependencias nuevas, tema oscuro y más tokens que `color-success-foreground`.
- Interacción con puntero en la gráfica (tooltip, cursor): la lectura es por la tabla.

**Aceptación.**
1. Un test comprueba que `Amount` formatea con la moneda y el `locale` recibidos (`USD` con `en-US` y `CLP` con `es-CL` dan cada uno su forma) y que sin `locale` usa el `Intl` del entorno sin lanzar.
2. Un test comprueba que `Amount` con `undefined`, `null`, `NaN`, `Infinity` y una cadena no numérica escribe «sin dato», que un negativo lleva signo en el texto, y que una moneda inválida no lanza un error.
3. Un test lee `Amount.css` y comprueba que usa `mono` y `tabular-nums`, que un abono y un cargo llevan color (`color-success-foreground`, `color-danger-foreground`) y además signo y palabra, y que ambos colores cumplen 4,5:1 sobre `color-bg-primary`.
4. Un test comprueba que `MovementsTable` tiene `caption`, cabeceras con `scope`, importes alineados a la derecha, y que sin filas muestra «sin movimientos» y no una tabla vacía muda.
5. Un test comprueba que `TrendChart` es `role="img"` con nombre accesible, que expone una tabla con todos los valores, y que `sin datos`, un punto y una serie con huecos (`null`) dan cada uno su texto y no una línea rota ni `NaN` en el SVG.
6. Un test comprueba que `TrendChart` no usa `color-accent` en texto ni en bordes con significado (solo rellena el punto final), que la tabla de valores es visible en un `<details>` y que sus trazos salen de variables, no de literales.
7. Un test lee los `.css` de los tres y comprueba que no hay colores, tamaños ni radios literales fuera de las excepciones comentadas.
8. `npm run test:a11y` y `npm run test:touch` terminan en 0 con las stories nuevas, y `npm run test:visual:update` genera sus capturas, que Chris revisa.
9. Se revisa a mano en Storybook (`npm run dev`) con teclado y `pointer: coarse` emulado: los importes se alinean por la cifra, la tabla se recorre con el teclado en orden lógico, la gráfica se entiende sin color y el foco de 2 px es visible.
10. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta los tres componentes y sus tipos, y `package.json` no gana dependencias.
11. Hay un changeset, `docs/PLAN.md` actualiza la tabla de estado y «Estado actual», y la verificación del repositorio (`.verify.conf`) pasa.

**Pendiente (incrementos siguientes, sin construir).**
Tarjeta de saldo / KPI con variación; barras y varias series con leyenda; selector de periodo; orden y filtros en la tabla; estado de carga y de error de un panel; el dashboard compuesto.

**Rollback.** Revertir el único commit del incremento y el changeset.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai. Respuestas de Chris, 2026-10-19:
- La gráfica es **SVG propio**, solo línea; sin dependencias. Se reabre si hacen falta tres o más tipos.
- `locale` es **opcional**: sin él se usa el del consumidor (`Intl` con `undefined`). La moneda es obligatoria y no hay una por defecto.
- Las cifras llevan **color de estado**. Se añade un token `color-success-foreground` (con su `usage`) y se usa el `color-danger-foreground` que ya existe; ambos con contraste de texto sobre `color-bg-primary` verificado en un test. Reabre la decisión 2 («aplazada»). El color **nunca va solo**: signo y palabra («abono», «cargo») siguen escritos.
- `color-accent` solo rellena el punto final de la gráfica; la línea es de tinta. Nunca texto ni bordes con significado.
- La tabla de valores de `TrendChart` es **visible**, en un `<details>`.
Propuestas del agente que quedan confirmadas al aprobar el brief:
- `Amount` recibe el valor en unidades mayores como `number` (12,50, no centavos).
- Un negativo lleva el signo escrito (U+2212) además del color.
- Las fechas entran como `string` ISO y no se reformatean salvo que el consumidor pase un `formatDate`.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-15 — Estados del dashboard: `Metric`, `DataPanel` y el selector de periodo

Segundo incremento del dashboard de finanzas, acotado a tres piezas del «Pendiente» de L-14: la cifra clave con su variación, el estado de carga y de error de un panel, y el selector de periodo.
Sin origen en PliegoStack, y el Design System de claude.ai no cubre cifras clave, variaciones ni estados de carga: lo que falta va en «Preguntas abiertas» con una propuesta.
Valen las decisiones de L-14 y la 41 de «Decisiones».

**Objetivo.**
Que quien construye un dashboard de finanzas pueda mostrar una cifra clave con cuánto cambió, elegir el periodo que se mira y decir en palabras si un panel está cargando, falló o muestra datos anteriores, de modo que nadie, con o sin lector de pantalla, tome una cifra vieja por vigente ni pierda el foco cuando el panel cambia.

**Alcance.**
- `Metric`: una cifra clave (saldo, gasto del mes) con su rótulo y, si se le da el valor anterior, su variación escrita.
  API propuesta: `label` (en minúsculas), `value`, `previous?`, `currency`, `locale?`, `comparison?` (el texto del periodo de comparación, «frente a septiembre») y `labels?` (`up` «sube», `down` «baja», `flat` «sin cambio», `noPrevious` «sin dato anterior», `noPercent` «sin porcentaje: el valor anterior es 0», `lessThan` «menos de»).
  La cifra va con `Amount` neutro; la diferencia, con `formatAmount`.
- `formatChange` en `src/utils/formatChange.ts`, interna y con sus tests, junto a `formatAmount`: de un valor y un anterior da la dirección (`up`, `down`, `flat`), la diferencia escrita y el porcentaje escrito o su ausencia.
  Reglas:
  - La dirección sale de la diferencia ya redondeada a los decimales de la moneda, como el signo de `Amount`: `0.1 + 0.2 - 0.3` es «sin cambio».
  - El porcentaje es la diferencia sobre el valor absoluto del anterior, con un decimal y sin signo propio, porque la palabra ya dice hacia dónde.
  - Con una base negativa la dirección sigue a la diferencia: de −200 a −100 «sube 100,00 US$ (50,0 %)».
  - Con el anterior en 0 se escribe la diferencia sin porcentaje y la razón; nunca «Infinity» ni «NaN %».
  - Con el anterior ausente, `null`, `NaN` o no finito, o con el valor actual desconocido, no hay variación: se escribe «sin dato anterior» (o la cifra dice «sin dato», como en `Amount`).
  - Un porcentaje que redondea a 0,0 con una diferencia que no es cero se escribe «menos de 0,1 %», no «0,0 %»; con la diferencia en cero, «sin cambio» y nada más.
  - Un porcentaje que no sale finito (un anterior diminuto) se omite como el de base 0.
- `DataPanel`: el panel del Design System (título sin caja, con el estilo `panel-title`) con un `status` controlado por el consumidor: `ready`, `loading` o `error`.
  API propuesta: `title`, `status`, `error?` (el texto de qué falló, lo escribe el consumidor), `onRetry?`, `retryLabel` («reintentar»), `loadingLabel` («cargando»), `staleLabel` («datos anteriores; cargando los nuevos»), `staleErrorLabel` («no se pudieron actualizar; estos datos son anteriores») y `children` (los datos).
  Qué muestra cada estado:
  - `ready`: los datos, sin ninguna marca.
  - `loading` sin datos (`children` vacío): solo la línea «cargando», escrita y sin animación, porque el sistema dice que nada más se anima.
  - `loading` con datos: los datos siguen visibles, con `aria-busy="true"` en su contenedor y, encima, la línea escrita «datos anteriores; cargando los nuevos», enlazada al contenedor con `aria-describedby`. No se atenúan: bajar el contraste de una cifra la vuelve ilegible y no dice nada a quien no la ve.
  - `error` sin datos: un `Notice` de error con el texto del consumidor y el botón «reintentar» si hay `onRetry`.
  - `error` con datos: los datos siguen visibles, con la marca escrita «no se pudieron actualizar; estos datos son anteriores», el texto del error y el botón.
  Qué se anuncia:
  - Una región `role="status"` que existe siempre, vacía en `ready`, y lleva la línea de carga o de datos anteriores; montada desde el principio, porque una región viva que aparece con su texto no siempre se lee.
  - `role="alert"` solo para el error sin datos, que deja el panel sin nada que leer. El error con datos anteriores va por la región de estado, porque se puede seguir leyendo.
  - Al volver a `ready` desde `loading` la región de estado se vacía y no anuncia nada (ver «Preguntas abiertas»).
  Dónde queda el foco:
  - El panel no mueve el foco cuando el cambio viene de fuera, por ejemplo de un selector de periodo: el foco sigue en el selector.
  - Al activar «reintentar», el botón desaparece con el error; el foco pasa al contenedor del panel (`tabIndex={-1}`), que se nombra con su título, y no cae a `<body>`.
  - Un segundo «reintentar» seguido no llama otra vez a `onRetry`: el panel lo ignora hasta que `status` cambie.
- Selector de periodo: **no es un componente nuevo**. Es `SegmentedControl` con `kind="options"`, que ya es un `radiogroup` con un punto de tabulación y flechas; un `PeriodSelector` encima solo cambiaría el nombre.
  Se endurece `SegmentedControl` para los casos que un periodo hace probables, con tests:
  - Sin opciones no pinta nada (un `radiogroup` sin `radio` no es válido) y no lanza.
  - Con una sola opción pinta un único segmento elegido, que se alcanza con Tab.
  - Con valores repetidos se queda con la primera aparición y avisa en consola en desarrollo, en vez de dejar dos segmentos con la misma clave y la misma ref.
  - Si el valor elegido ya no está entre las opciones, ninguno se marca elegido (no se finge una selección) y el primero que se pueda elegir es el punto de tabulación, como ya hace; el componente no llama a `onChange` por su cuenta.
  - Si `value` cambia desde fuera mientras el foco está en el grupo, el foco no salta y no se llama a `onChange`.
  Una story `SegmentedControl · Periodo` (7 días, 30 días, 12 meses, año) y una nota en `docs/COMPONENTS.md`.
- Una story `DataPanel · Con periodo` que compone `SegmentedControl`, `DataPanel`, `Metric` y `TrendChart` con una carga simulada, para revisar a mano el flujo de anuncios y foco. Es una story, no el dashboard compuesto.
- El color de una cifra que suma pasa de verde a azul (Chris, 2026-10-20): `color-success-foreground` cambia de `#166534` a `#1d4ed8` (6,36:1 sobre `color-bg-secondary`) en `tokens/tokens.json`, con su `usage` al día. Cambia el aspecto de los abonos de `Amount` y `MovementsTable` de L-14.
- Un estilo de texto nuevo `metric-value` en `tokens/tokens.json`, con los valores de `measure-input` y su `usage`.
- Estilos con variables y clases `pui-` en `Metric.css` y `DataPanel.css`; stories de cada estado y de cada caso de la variación; tests; exportaciones de `Metric`, `DataPanel` y sus tipos; secciones en `docs/COMPONENTS.md`; y un changeset `minor`.

**No objetivos.**
- Barras, varias series con leyenda, orden y filtros en la tabla y el dashboard compuesto: siguen en el «Pendiente» de L-14.
- Cargar datos, cancelar peticiones o descartar una respuesta que llega tarde: `DataPanel` muestra el `status` que recibe y el consumidor decide cuál es la última petición.
- Un periodo a medida (desde, hasta) o un calendario.
- Colorear la variación como buena o mala: que un gasto suba es malo y que un saldo suba es bueno, y eso lo sabe el consumidor (ver «Preguntas abiertas»).
- Esqueletos, spinners o cualquier animación de carga.
- Dependencias nuevas, tema oscuro y más tokens que `metric-value` y el valor nuevo de `color-success-foreground`.
- Renombrar `color-success-foreground`: el nombre dice para qué sirve, no de qué color es.

**Aceptación.**
1. Un test de `formatChange` comprueba: anterior 0 (diferencia sin porcentaje y con su razón), anterior negativo (de −200 a −100 «sube» y 50,0 %), anterior `undefined`, `null`, `NaN` e `Infinity` (sin variación), valor actual desconocido (sin variación), diferencia que redondea a cero (`0.1 + 0.2 - 0.3`, «sin cambio» y sin porcentaje), porcentaje bajo 0,05 % con diferencia no nula («menos de 0,1 %»), y que ninguna salida contiene `Infinity`, `NaN` ni `−0`.
2. Un test comprueba que `Metric` escribe el rótulo, la cifra con `Amount` y la variación con su palabra, la diferencia, el porcentaje y `comparison`, que sin `previous` escribe «sin dato anterior», y que el nombre accesible del grupo es el rótulo en minúsculas.
3. Un test comprueba los tres estados de `DataPanel` sin datos y con datos: qué texto se ve, que los datos con `loading` llevan `aria-busy` y la marca enlazada por `aria-describedby`, que con `error` y datos siguen visibles con su marca, y que en `ready` no queda ninguna marca.
4. Un test comprueba los anuncios de `DataPanel`: la región `role="status"` existe desde el primer render y en todos los estados, lleva «cargando» y la marca de datos anteriores, y `role="alert"` aparece solo en el error sin datos.
5. Un test comprueba el foco de `DataPanel`: un cambio de `status` desde fuera no mueve el foco del control que lo tenía, y activar «reintentar» deja el foco en el contenedor del panel, no en `<body>`.
6. Un test comprueba que dos activaciones seguidas de «reintentar» llaman a `onRetry` una sola vez, y que tras un nuevo `error` el botón vuelve a funcionar.
7. Un test comprueba `SegmentedControl` sin opciones (no pinta nada y no lanza), con una sola, con valores repetidos (un segmento por valor y un aviso en consola), con un valor que no está entre las opciones (ninguno elegido, primer segmento en el orden de tabulación, `onChange` sin llamar) y con `value` cambiado desde fuera con el foco dentro (el foco no se mueve).
8. Un test lee `Metric.css` y `DataPanel.css` y comprueba que no hay colores, tamaños ni radios literales fuera de las excepciones comentadas, que no hay `animation` ni `opacity` en los estados, y que no se usa `color-accent`.
9. `npm run test:a11y` y `npm run test:touch` terminan en 0 con las stories nuevas, y `npm run test:visual:update` genera sus capturas, que Chris revisa.
10. Se revisa a mano en Storybook (`npm run dev`) con teclado, `pointer: coarse` emulado y VoiceOver: el selector de periodo con flechas, la línea «cargando» que se oye una vez, el error que se oye al momento, el foco en el panel tras «reintentar», la marca de datos anteriores legible, y el anillo de foco de 2 px.
11. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `Metric`, `DataPanel` y sus tipos, y `package.json` no gana dependencias.
12. Un test comprueba que `color-success-foreground` es azul (tono entre 200° y 250°), que se distingue de `color-accent-ink` en al menos 15° de tono, y que cumple 4,5:1 sobre `color-bg-primary` y `color-bg-secondary`; las capturas de los abonos de `Amount` y `MovementsTable` se regeneran con `npm run test:visual:update` y Chris las revisa.
13. Hay un changeset, `docs/COMPONENTS.md` documenta `Metric`, `DataPanel` y el uso de `SegmentedControl` como periodo, `docs/PLAN.md` actualiza la tabla de estado y «Estado actual», y la verificación del repositorio (`.verify.conf`) pasa.

**Rollback.** Revertir el único commit del incremento y su changeset.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai; valen las decisiones de L-14 (Chris, 2026-10-19).
Chris pidió el 2026-10-20 acotar el incremento a dos o tres piezas del «Pendiente».
Propuestas del agente que quedan confirmadas al aprobar el brief:
- El selector de periodo es `SegmentedControl` con `kind="options"` y no un componente nuevo.
- La dirección de una variación sale de la diferencia redondeada y no del porcentaje; con base negativa, el porcentaje es sobre su valor absoluto.
- Los datos anteriores se dejan visibles y marcados en palabras, sin atenuar, en vez de ocultarse.
- `role="alert"` solo en el error sin datos; todo lo demás va por una región `role="status"` que existe siempre.
- Tras «reintentar» el foco va al contenedor del panel; los cambios que vienen de fuera no mueven el foco.

Respuestas de Chris al brief, 2026-10-20:
- La variación no lleva color: va en tinta con su palabra. Una prop `goodWhen` queda para otro incremento.
- La cifra de `Metric` usa un estilo de texto nuevo, `metric-value`, con los valores de `measure-input`.
- `Metric` va sin caja, con un filete superior de `color-border`.
- No se anuncia «actualizado» al terminar una carga.
- El título de `DataPanel` es un `h2` fijo.
- El abono pasa de verde a azul. El agente eligió `#1d4ed8`: 6,36:1 sobre el papel, casi el contraste del verde (6,7:1), y un tono (unos 224°) que se separa del de `color-accent-ink` (unos 197°), el del anillo de foco y los enlaces. Además, azul frente a rojo se distingue mejor que verde frente a rojo con daltonismo rojo-verde.

**Preguntas abiertas.**
Ninguna.

**Pendiente (incrementos siguientes, sin construir).**
Barras y varias series con leyenda; orden y filtros en la tabla; el dashboard compuesto; y, si Chris lo pide, `goodWhen` en `Metric` y un `readyLabel` en `DataPanel`.

## L-16 — Barras con varias series y orden y filtro de `MovementsTable`

Tercer incremento del dashboard de finanzas, acotado a dos piezas del «Pendiente» de L-15: un gráfico de barras con varias series y leyenda, y el orden y el filtro de la tabla de movimientos.
El dashboard compuesto queda para el incremento siguiente.
Sin origen en PliegoStack, y el Design System de claude.ai no cubre series de datos, leyendas ni tablas ordenables: lo que falta va en «Preguntas abiertas» con una propuesta.
Valen las decisiones de L-14 y L-15 y las entradas 41 y 42 de «Decisiones».

**Objetivo.**
Que quien construye un dashboard de finanzas pueda comparar varias series por categoría (ingresos y gastos por mes) y encontrar un movimiento ordenando o filtrando la tabla, de modo que cada serie se distinga sin depender del color y que quien usa teclado o lector de pantalla sepa en todo momento qué orden y qué filtro tiene la tabla.

**Alcance.**
- `BarChart`: barras agrupadas en SVG propio, con `role="img"` y nombre accesible, que reutiliza `Amount`, `formatSigned` y el patrón de `TrendChart` (resumen escrito, tabla de valores visible en un `<details>`).
  API propuesta: `title`, `categories: string[]` (las etiquetas del eje), `series: { name: string; values: (number | null | undefined)[] }[]` (cada `values[i]` pertenece a `categories[i]`), `currency`, `locale?` y `labels?` (`empty` «sin datos para graficar», `values` «valores», `category` «categoría», `legend` «series», `moreSeries` «se muestran {shown} de {total} series; las demás están en la tabla», `min` «mínimo», `max` «máximo»).
  - **Cómo se distinguen las series (pregunta 1).** Cada serie lleva un nombre escrito en la leyenda y un tratamiento de relleno propio, siempre de tinta: macizo, rayas diagonales, puntos y trama cruzada. Barra y muestra de la leyenda usan el mismo patrón SVG, y dentro de cada grupo las barras van en el orden de la leyenda. Todas llevan contorno de tinta de 2 px, que da el contraste de 3:1 del dibujo sobre el papel sin depender del relleno. Son cuatro tratamientos y no hay tonos nuevos: ni tokens ni dependencias.
  - **Leyenda.** Una lista (`<ul>`) con la muestra (aria-hidden) y el nombre en texto. Solo aparece con dos o más series: con una, el título ya la nombra y la tabla tiene su columna.
  - **Escala.** Siempre incluye el 0, porque una barra que no parte de cero miente. Con todo en 0 la escala usa un rango de 1 y no divide por cero. Un valor 0 deja una marca de tinta en la base (un `rect` de alto cero no se pinta, lo dice SVG) y un valor desconocido no dibuja nada; la tabla dice «sin dato».
  - **Etiquetas del eje.** Una fila HTML bajo el SVG, con `aria-hidden` porque la tabla ya las tiene, para que el texto no se escale con el `viewBox`. Una etiqueta larga parte la línea en vez de desbordar.
  - **Series irregulares.** Una serie más corta que `categories` deja las categorías que le faltan como «sin dato». Los valores que sobran no tienen categoría que los nombre: no se dibujan ni entran en la tabla.
  - **Nombres repetidos.** Se conservan todas las series y se desambigua el nombre repetido con « (2)», « (3)», para que ninguna deje de leerse.
  - **Más de cuatro series (pregunta 2).** Se dibujan las cuatro primeras, se escribe la frase `moreSeries` y la tabla conserva todas.
  - Sin categorías, sin series o sin ningún valor conocido: «sin datos para graficar» y ningún SVG.
- `MovementsTable` gana orden y filtro, ambos **opt-in** y apagados por omisión, de modo que un uso actual no cambia ni en el DOM ni en el aspecto.
  - Nuevas props: `sortable?: boolean`, `defaultSort?: { column: 'date' | 'description' | 'amount'; direction: 'ascending' | 'descending' }`, `onSortChange?`, `filterable?: boolean` y, en `labels`, `filter` («filtrar»), `sortedBy` («ordenado por {column}, {direction}»), `ascending` («de menor a mayor»), `descending` («de mayor a menor»), `unsorted` («sin orden»), `noMatches` («ningún movimiento coincide con «{query}»»), `count` («{shown} de {total} movimientos»).
  - **Orden.** Con `sortable`, cada cabecera es un `<th scope="col" aria-sort>` con un `<button>` dentro cuyo nombre es el rótulo de la columna («importe»). El clic pasa por ascendente, descendente y el orden original (pregunta 3). Solo una columna tiene `aria-sort` distinto de `none`, y el botón enseña una flecha (forma, no color) del estado que `aria-sort` dice en palabras.
  - **Reglas del orden.** Un valor desconocido va **siempre al final**, en ascendente y en descendente: el importe ausente o no finito, la fecha vacía o que no es una fecha ISO válida (`2026-02-31`), y el concepto vacío. Los empates conservan el orden original también en descendente. Los importes negativos ordenan por su valor (−600 antes que 32). El concepto se compara con `Intl.Collator` del `locale` recibido (tildes y números razonables), con respaldo si el `locale` es inválido. El orden no modifica `movements`.
  - **Filtro.** Con `filterable`, un campo de texto con etiqueta visible «filtrar» sobre la tabla. Coincide si el texto buscado aparece en el concepto o en la fecha tal como se escribe (después de `formatDate`), sin distinguir mayúsculas ni tildes, ignorando espacios en los extremos y tomando los caracteres especiales literalmente. Un texto vacío o solo de espacios no filtra (pregunta 4).
  - **Cero resultados.** La fila dice «ningún movimiento coincide con «xyz»», distinta de «sin movimientos», que queda para cuando `movements` viene vacío.
  - **Anuncios.** Una región `role="status"`, montada desde el primer render y visualmente oculta, dentro de la región de la tabla. Al ordenar anuncia «ordenado por importe, de mayor a menor» en el momento. El conteo de filas («3 de 12 movimientos») se ve al instante junto al campo y se anuncia en esa región 500 ms después de la última tecla, para no leer una cifra por pulsación (pregunta 5).
  - Orden y filtro se componen: el filtro actúa y luego se ordena lo que queda, y cambiar uno no borra el otro.
  - Sin `sortable` ni `filterable` la salida es la de L-14, sin región de estado, sin botones y sin campo.
- Stories de `BarChart` (por defecto con dos series, una serie, cuatro series, más de cuatro, negativos, ceros, valores desconocidos, series de distinta longitud, vacío) y de `MovementsTable` (con orden, con filtro, con ambos, sin resultados, con importes desconocidos).
- Estilos con variables y clases `pui-` en `BarChart.css` y en `MovementsTable.css`; utilidades internas con sus tests en `src/utils/`; exportaciones de `BarChart` y sus tipos; secciones en `docs/COMPONENTS.md`; y un changeset `minor`.
- `BarChart` es un componente nuevo y no una opción de `TrendChart`: la forma de los datos es otra (una matriz de categorías por series, no una lista de puntos), y `TrendChart` queda sin tocar. Reutiliza `Amount`, `formatSigned` y el mismo patrón de resumen y tabla.

**No objetivos.**
- Tonos de color para las series, tokens nuevos o dependencias: el sistema no los tiene, y proponer otra cosa es una pregunta.
- Barras apiladas, horizontales, tarta, ejes con marcas numéricas, líneas de cuadrícula y varias series en `TrendChart`.
- Interacción con puntero en las barras (tooltip, resaltado, clic en la leyenda para ocultar una serie): la lectura es por la tabla.
- Orden o filtro por importe o por rango de fechas, orden por varias columnas, paginación y selección de filas.
- Orden y filtro controlados desde fuera (`sort`, `filter` como props controladas): `defaultSort` y `onSortChange` bastan hasta que un consumidor lo pida.
- El dashboard compuesto, `goodWhen` en `Metric` y `readyLabel` en `DataPanel`.
- Resolver la entrada 43 de «Decisiones» (la comparación visual no ve un cambio de color en texto pequeño): este incremento no cambia ningún color existente, y las pruebas de `BarChart` comprueban los patrones en el DOM, no solo en una captura (ver «Preguntas abiertas»).

**Aceptación.**
1. Un test de la utilidad de orden (`src/utils/sortMovements.test.ts`) comprueba: importes en ascendente y descendente con negativos y ceros; importe `undefined`, `null`, `NaN` e `Infinity` al final en las dos direcciones; fecha vacía y fecha inválida (`2026-02-31`, `hoy`) al final; empates en el orden original también en descendente; concepto con tildes y números («cuota 2» antes de «cuota 10»); concepto vacío al final; el arreglo de entrada sin modificar; y orden «ninguno» devuelve el original.
2. Un test de la utilidad de filtro (`src/utils/filterMovements.test.ts`) comprueba: mayúsculas y tildes («cafe» encuentra «Café»), espacios en los extremos, texto solo de espacios que no filtra, caracteres de expresión regular (`(`, `.*`) tomados literalmente, coincidencia por la fecha tal como se escribe tras `formatDate`, y cero resultados.
3. Un test comprueba que `MovementsTable` sin `sortable` ni `filterable` produce el mismo DOM que en L-14: la raíz es la región, no hay `button`, `input` ni `role="status"`. Además `git diff -U0 -- src/components/MovementsTable/MovementsTable.test.tsx | grep '^-[^-]'` no imprime nada (solo se añaden tests) y `git status --short e2e/visual.spec.ts-snapshots` no muestra ninguna captura existente modificada ni borrada antes de generar las nuevas.
4. Un test del orden en `MovementsTable` comprueba: cada cabecera es un botón con el rótulo como nombre accesible; `aria-sort` es `none` en todas al inicio, `ascending`/`descending` solo en la columna activa y vuelve a `none` en el tercer clic; las filas cambian de orden; Enter y Espacio funcionan; cambiar de columna deja a la anterior en `none`; `defaultSort` y `onSortChange` se respetan; y la región de estado dice «ordenado por importe, de mayor a menor».
5. Un test del filtro en `MovementsTable` comprueba, escribiendo con `userEvent` letra a letra: el campo tiene etiqueta visible; las filas se reducen a cada pulsación; el conteo visible cambia al instante; el texto del anuncio cambia solo tras 500 ms de la última tecla (con temporizadores simulados) y no se repite por pulsación; cero resultados dice «ningún movimiento coincide con «…»» y no deja la tabla muda; con `movements` vacío sigue diciendo «sin movimientos»; y filtro y orden se componen.
6. Un test de datos de `BarChart` comprueba, sin `NaN`, `Infinity` ni `undefined` en el SVG: sin series, sin categorías y una serie sin valores («sin datos para graficar», sin SVG); un solo punto; series de distinta longitud (la corta con «sin dato», los sobrantes ignorados); un negativo y un 0 entre positivos (la base en 0, el 0 con su marca en la base); `null`, `NaN` e `Infinity` (sin barra y «sin dato» en la tabla); todo en 0 (escala sin división por cero); dos series con el mismo nombre (ambas conservadas y desambiguadas); más de cuatro series (cuatro dibujadas, la frase de aviso, todas en la tabla).
7. Un test de accesibilidad de `BarChart` comprueba: `role="img"` con nombre que incluye el título, las series y el rango; leyenda solo con dos o más series y con cada nombre en texto; la muestra de cada serie y todas sus barras usan el mismo patrón y dos series nunca comparten patrón; el orden de las barras dentro de un grupo es el de la leyenda; la tabla visible dentro de un `<details>` abierto lista todas las categorías por todas las series; y las etiquetas del eje son `aria-hidden`.
8. Un test lee `BarChart.css` y `MovementsTable.controls.css` (los estilos de orden y filtro, en un archivo aparte para que `MovementsTable.css` y su test de L-14, que solo admite 1 px y 2 px, no cambien) y comprueba que no hay colores, tamaños ni radios literales fuera de 1 px, 2 px y los 40/44 px de área mínima, comentados; que `color-accent` no es color de texto ni de trazo; y que no hay `animation`.
9. `npm run test:a11y` y `npm run test:touch` terminan en 0 con las stories nuevas; `npm run test:visual` pasa **antes** de regenerar, con las 77 capturas existentes sin tocar; y `npm run test:visual:update` solo añade las capturas de las stories nuevas, que Chris revisa.
10. Se revisa a mano en Storybook (`npm run dev`) con teclado, `pointer: coarse` emulado y VoiceOver: las series se distinguen en una captura en escala de grises y con un simulador de daltonismo; la leyenda coincide con las barras sin color; Tab llega a cada botón de orden y al campo con el anillo de 2 px; VoiceOver dice la columna y su orden al ordenar y el conteo con calma al filtrar; y la tabla de valores del gráfico se recorre en orden lógico.
11. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0, `src/index.ts` exporta `BarChart` y sus tipos (y los tipos nuevos de `MovementsTable`), y `package.json` no gana dependencias.
12. Hay un changeset, `docs/COMPONENTS.md` documenta `BarChart` y el orden y el filtro de `MovementsTable` (y quita de esa sección «sin orden, filtros ni paginación»), `docs/PLAN.md` actualiza la tabla de estado y «Estado actual», y la verificación del repositorio (`.verify.conf`) pasa.

**Rollback.** Revertir el único commit del incremento y su changeset. Como orden y filtro son opt-in, ningún consumidor de `MovementsTable` depende de ellos hasta que los active.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai; valen las decisiones de L-14 y L-15.
Chris pidió el 2026-10-20 acotar este incremento a dos o tres piezas del «Pendiente» y propuso la combinación de barras con leyenda y orden y filtro, dejando el dashboard compuesto para el siguiente.
Propuestas del agente que quedan confirmadas al aprobar el brief:
- `BarChart` es un componente nuevo, en SVG propio y sin dependencias.
- `MovementsTable` gana orden y filtro como props opt-in, apagadas por omisión; no se crea una tabla nueva.
- Un valor desconocido va siempre al final del orden, en las dos direcciones, y los empates conservan el orden original.
- El conteo de filas se ve al instante y se anuncia con retraso; el orden se anuncia al momento.
- La gráfica sigue sin interacción con puntero: la lectura es por la tabla.

**Preguntas abiertas.**
Ninguna impide empezar, y todas traen la propuesta que se construye si Chris no dice otra cosa.
1. **¿Cómo se distinguen las series sin color, y de dónde salen los tonos?** Propuesta: cuatro tratamientos de relleno de tinta (macizo, rayas, puntos, trama cruzada), con nombre en la leyenda y posición fija. Sin token ni dependencia nueva. Alternativa: una paleta de matices, que pide tokens nuevos con su `usage`, contraste de 3:1 de cada uno sobre el papel y una comprobación con daltonismo, y que aun así necesitaría el patrón para no depender del color. Si Chris la quiere, es otro brief.
2. **¿Cuántas series admite?** Propuesta: cuatro, con la frase de aviso y la tabla completa para las demás. Alternativa: repetir los patrones a partir de la quinta, que haría dos series indistinguibles y por eso no se propone.
3. **¿El clic de ordenar tiene tres estados?** Propuesta: ascendente, descendente y el orden original, porque en un extracto el orden de llegada es información. Alternativa: dos estados, sin vuelta al original.
4. **¿Qué busca el filtro?** Propuesta: concepto y fecha escrita, sin el importe. Buscar «600» en importes pide decidir cómo se comparan cifras con formato, y puede ser un incremento propio.
5. **¿Qué retraso tiene el anuncio del conteo?** Propuesta: 500 ms tras la última tecla. Se afina con VoiceOver en la revisión manual.
6. **Entrada 43 (abierta).** No se resuelve aquí. Este incremento no cambia el color de nada existente, así que no la agrava; pero un patrón de `BarChart` podría cambiar de densidad sin que la captura lo note, y por eso el criterio 7 lo comprueba en el DOM. Decidir cómo se vigilan los colores sigue siendo de Chris.

**Pendiente (incrementos siguientes, sin construir).**
El dashboard compuesto; y, si Chris lo pide, `goodWhen` en `Metric`, `readyLabel` en `DataPanel`, una paleta de matices para series, orden y filtro controlados y barras apiladas.

## L-17 — El dashboard de finanzas compuesto

Cuarto y último incremento del dashboard de finanzas: reunir `Metric`, `DataPanel`, `TrendChart`, `BarChart`, `MovementsTable` y el selector de periodo en una pantalla.
Casi no hay primitivos nuevos; el trabajo es de composición, y el brief dice qué se construye y qué no.
El Design System de claude.ai no cubre composición de pantallas ni finanzas: lo que falta va en «Preguntas abiertas» con una propuesta.
Valen las decisiones de L-14, L-15 y L-16 y las entradas 41 a 44 de «Decisiones».

**Objetivo.**
Que quien monta un dashboard de finanzas con estas piezas obtenga una pantalla en la que cambiar el periodo carga cada panel por su cuenta, un panel que falla no tumba a los demás, ninguna cifra anterior pasa por vigente, un lector de pantalla oye un aviso por cambio y no uno por panel, y el teclado recorre la pantalla en el orden en que se ve, desde 375 hasta 1024 px.

**Alcance.**
- `usePanelData(key, load)` en `src/hooks/usePanelData.ts`, exportada. Es la pieza que hace segura la composición: sin ella cada consumidor reescribe, sin pruebas, la lógica que descarta respuestas tardías (ver «Preguntas abiertas», 1).
  - `load(key, signal)` devuelve una promesa; `key` es lo que identifica la petición (el periodo, o `undefined` para un panel que no depende de él).
  - Devuelve `{ status, data, dataKey, error, retry }`. `data` es el último dato que llegó y `dataKey`, la clave a la que pertenece: así el consumidor escribe «datos de 30 días» y no «datos anteriores» a secas.
  - **El estado se deriva en el mismo render en que cambia `key`**, no en un efecto posterior: no existe un fotograma con el periodo nuevo, `ready` y los datos viejos. Es el hueco por el que una cifra vieja pasaría por vigente.
  - Una respuesta, buena o mala, de una clave que ya no es la actual se descarta, y su `AbortSignal` se aborta al cambiar de clave y al desmontar. Cambiar dos veces seguidas deja solo la última.
  - Un error conserva `data` y `dataKey` (datos anteriores, marcados por `DataPanel`) y nunca los borra. Un `load` que lanza sin ser asíncrono se trata como un error, no como una excepción de render.
  - `retry` vuelve a pedir la clave actual una sola vez, aunque se llame dos veces seguidas.
  - No cachea: volver a un periodo ya visto lo vuelve a pedir. Un caché pide una regla de caducidad que nadie ha pedido.
- `DataPanel` gana `announce?: boolean`, **opt-in a la baja**: por omisión es `true` y el panel es exactamente el de L-15. Con `false` la región de estado deja de ser viva (`aria-live="off"`) y el `Notice` de error pierde el rol `alert`; el texto sigue visible y navegable. Es el único cambio a una pieza anterior, y es aditivo.
- `DashboardStatus`: **el único anunciador de la pantalla**. Recibe `panels: { title: string; status: DataPanelStatus }[]` y `labels?` y pinta dos regiones visualmente ocultas y montadas desde el primer render: una `role="status"` y una `role="alert"`.
  - **Carga.** Cuando alguno pasa a `loading`, y tras una espera de 250 ms para juntar los que cambian a la vez, la región de estado dice una vez «cargando 4 paneles». Que los demás terminen no reescribe el texto, y un segundo cambio de periodo con paneles aún cargando no lo repite.
  - **Error.** Los paneles que pasan a `error` se juntan en la misma espera de 250 ms y la región `alert` dice, una vez y en el orden visual, «no se pudieron cargar: saldo, movimientos». Con todos fallando es un solo aviso, no cinco.
  - **Éxito.** No se anuncia nada al terminar, como pide la entrada 42 («actualizado» no se anuncia).
  - Los paneles de la pantalla pasan `announce={false}`; su marca escrita sigue a la vista. Un panel quitado de la lista no deja nada colgado, y una lista vacía pinta las regiones vacías sin lanzar.
- `DashboardGrid` y `DashboardCell`, estructura sin comportamiento. No se hace una sección con encabezado: `DataPanel` ya es una sección nombrada con su `h2` fijo (entrada 42), y una sección con otro encabezado obligaría a que el panel fuera `h3` o dejaría dos niveles iguales.
  - `DashboardGrid` es un `div` con rejilla CSS `repeat(auto-fit, minmax(min(100%, 18rem), 1fr))` y separación de `space-6`. A 1024 px caben 3 columnas, a 768 px 2 y a 375 px 1. `DashboardCell` con `wide` ocupa la fila entera (`grid-column: 1 / -1`) y siempre lleva `min-width: 0`, para que una gráfica o una tabla no ensanchen la página: la tabla se desplaza dentro de su propia región.
  - **El orden del DOM es el orden visual.** Ni `order`, ni `grid-auto-flow: dense`, ni posiciones de rejilla explícitas; un test lo lee en el CSS y otro lo mide en el navegador.
  - `main`, el `h1` y el nombre de la página son del consumidor, no de la librería: la rejilla no impone un punto de referencia ni un encabezado.
- La story `Finanzas/Dashboard` con datos de ejemplo, que es lo que se prueba de punta a punta. Un componente de ejemplo único, usado por todas las stories y por los tests, con cinco paneles: «saldo» (tres `Metric`, USD), «evolución del saldo» (`TrendChart`), «ingresos y gastos» (`BarChart`), «movimientos» (`MovementsTable` con orden y filtro) y «cuenta en pesos» (un `Metric` en CLP, **que no depende del periodo**). Stories: `Default`, `Cargando`, `Todos fallan`, `Uno falla con datos anteriores`, `Con periodo` (carga simulada, con un panel lento y otro que falla la primera vez) y `Un panel menos`.
- Rendimiento: cada panel es su propio componente con `memo` y recibe props estables (datos en el estado del hook, no recreados en cada render). Cambiar el periodo vuelve a pedir y a pintar solo los paneles que dependen de él; «cuenta en pesos», no. No se añade `useMemo` dentro de las piezas de L-14 a L-16.
- Documentación en `docs/COMPONENTS.md` (sección «Dashboard compuesto», con la receta de anuncios, foco y orden), exportaciones en `src/index.ts`, un changeset `minor`, y las secciones nuevas de este brief.

**No objetivos.**
- Cargar datos reales, caché, reintentos automáticos, sondeo o cancelación más allá del `AbortSignal`.
- Sumar, convertir o comparar monedas: la librería no calcula totales entre monedas ni conoce tipos de cambio. Cada panel lleva una moneda y la dice.
- Un periodo a medida, `goodWhen`, `readyLabel`, barras apiladas, orden y filtro controlados o una paleta de matices.
- Tema oscuro, tokens nuevos y dependencias nuevas.
- Cambiar el comportamiento, el DOM por omisión o el aspecto de cualquier pieza de L-14 a L-16, salvo el `announce` opt-in de `DataPanel`.
- Resolver la entrada 43 de «Decisiones».
- Capturas de la story a tres anchos en la comparación visual (ver «Preguntas abiertas», 6).

**Aceptación.**
1. `src/hooks/usePanelData.test.tsx` comprueba, con promesas controladas: los tres estados; que en el render en que cambia `key` el estado ya es `loading` (se registra cada render y ninguno junta `key` nueva, `ready` y `dataKey` distinto); que una respuesta tardía de una clave anterior, buena o mala, no pisa a la actual; A→B→C seguidos dejan solo C y abortan las señales de A y B; que repintar con la misma clave no vuelve a pedir; que un error conserva `data` y `dataKey`; que un `load` que lanza síncrono da error; que `retry` dos veces seguidas pide una sola vez; que desmontar aborta y no escribe estado; y una clave que no existe (el `load` la rechaza) da error con los datos anteriores marcados. `npx vitest run src/hooks` en verde.
2. Un test de `DataPanel` comprueba que con `announce` omitido el DOM y los roles son los de L-15, y con `announce={false}` la región de estado tiene `aria-live="off"`, el `Notice` de error no es `alert`, el texto sigue visible y el foco tras «reintentar» sigue llegando al panel. `git diff -U0 -- src/components/DataPanel/DataPanel.test.tsx | grep '^-[^-]'` no imprime nada.
3. `DashboardStatus.test.tsx`, con temporizadores simulados y un `MutationObserver` que cuenta cuántas veces cambia el texto de cada región: todos cargando dan un solo cambio, «cargando N paneles»; que los paneles terminen no lo reescribe; un segundo cambio de periodo durante la carga no lo repite; todos fallando dan un solo aviso en la región `alert` con los títulos en orden; uno que falla con los demás listos nombra solo ese; terminar bien no anuncia nada; un panel quitado y una lista vacía no lanzan; y dos cambios dentro de la espera de 250 ms dan un único aviso.
4. `DashboardGrid.test.tsx` comprueba que el orden del DOM es el de los hijos, que `wide` ocupa la fila, y lee `DashboardGrid.css` para comprobar que no hay `order`, `dense` ni posiciones explícitas, ni colores, tamaños o radios literales fuera de las excepciones comentadas (`18rem` del mínimo de columna, comentado), ni `animation`.
5. `Dashboard.test.tsx` renderiza la story con `composeStories` y comprueba, con la red simulada: (a) todos cargando: un único texto vivo no vacío en la pantalla (el de `DashboardStatus`) y todos los paneles con su marca escrita a la vista; (b) todos fallando: un solo `alert` y cada panel con su botón «reintentar»; (c) uno falla con datos anteriores y los demás listos: los demás intactos, el que falló con su marca «no se pudieron actualizar; estos datos son de 30 días» y sin ninguna cifra suya presentada como vigente; (d) un panel más lento que el siguiente cambio de periodo: su respuesta tardía no sustituye a la del periodo nuevo; (e) cambio de periodo mientras se carga, dos veces seguidas: gana el último, y a un periodo que no existe el selector no cambia y no se pide nada; (f) un panel sin datos junto a otro con datos: el primero dice «sin datos para graficar» y el otro no se afecta; (g) las dos monedas: ningún texto combina USD y CLP, cada cifra lleva su moneda y ningún panel muestra una suma de ambas.
6. El mismo archivo comprueba el foco: con el foco en el campo de filtro de la tabla, y luego en el selector de periodo, un cambio de periodo y la sustitución de los datos dejan `document.activeElement` donde estaba y el texto escrito en el filtro; «reintentar» deja el foco en el panel (L-15); y ningún `tabindex` positivo en toda la pantalla.
7. El mismo archivo comprueba la estructura: exactamente un `main` y un `h1`; los `h2` de los paneles siguen al `h1` sin saltos y no hay encabezados más profundos; cada región, grupo, figura y `img` tiene nombre accesible y **no hay dos con el mismo nombre**; y la misma comprobación pasa con un panel quitado (`Un panel menos`).
8. El mismo archivo comprueba el rendimiento: tras un cambio de periodo el `load` de «cuenta en pesos» se llamó una sola vez en total (la carga inicial) y su `Profiler` no registra ninguna actualización; los demás paneles se pidieron una vez por periodo.
9. `e2e/dashboard.spec.ts` abre la story a 375, 768 y 1024 px y comprueba: sin desbordamiento horizontal de la página (`scrollWidth <= clientWidth`) ni elemento fuera del ancho salvo dentro de una región que se desplaza; 1, 2 y 3 columnas de paneles; el orden de los paneles por posición (arriba, izquierda) coincide con el del DOM; y una pasada con Tab alcanza todos los controles en el orden visual, sale de la pantalla en un número acotado de pulsaciones y nunca deja el foco en el mismo elemento dos veces seguidas (sin bloqueo en una gráfica ni en una tabla).
10. `npm run test:a11y` y `npm run test:touch` terminan en 0 con las stories nuevas (el 44 px con puntero grueso incluido), `npm run test:visual` pasa **antes** de regenerar con las 89 capturas existentes sin tocar, y `npm run test:visual:update` solo añade las de las stories nuevas, que Chris revisa.
11. Los tests y las capturas de L-14 a L-16 no cambian: `git diff -U0 -- 'src/components/*/*.test.tsx' | grep '^-[^-]'` no imprime nada y `git status --short e2e/visual.spec.ts-snapshots` no muestra ninguna captura existente modificada ni borrada.
12. Revisión manual de Chris en Storybook (`npm run dev`) con teclado, `pointer: coarse` emulado y VoiceOver: cambiar de periodo se oye **una vez** («cargando N paneles»); todos fallando se oye una vez y en orden; el foco no salta al cambiar de periodo ni al llegar los datos; Tab recorre en el orden en que se ve y no se queda en una gráfica ni en la tabla; los puntos de referencia y encabezados se recorren con el rotor; y a 375, 768 y 1024 px nada se corta.
13. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0; `src/index.ts` exporta `usePanelData`, `DashboardStatus`, `DashboardGrid`, `DashboardCell` y sus tipos; `package.json` no gana dependencias.
14. Hay un changeset, `docs/COMPONENTS.md` documenta el dashboard compuesto, `docs/PLAN.md` actualiza la tabla de estado, «Estado actual» y «Decisiones», y la verificación del repositorio pasa.

**Autoexamen** (`adversarial-self-check`, una línea por pregunta; la respuesta real y la línea que falló antes irán en el reporte final).
- Pregunta 1: *Entrada desconocida*: un periodo que no existe, una clave repetida o un `load` que rechaza con algo que no es un `Error` → criterios 1 y 5e.
- Pregunta 2: *Dónde se aplica la regla*: descartar la respuesta tardía se hace en el hook, donde se escribe el estado, no en el story → criterio 1.
- Pregunta 3: *Lo mostrado frente a lo registrado*: el periodo elegido frente al `dataKey` de lo que se pinta → criterios 1 y 5c.
- Pregunta 4: *Coincidencias ambiguas*: títulos de panel repetidos y nombres de región repetidos → criterios 3 y 7.
- Pregunta 5: *Completitud*: el aviso cubre todos los paneles, también el que cambia dentro de la espera, no solo el último → criterio 3.
- Pregunta 6: *Dependencia ausente*: la red falla, el panel no tiene datos, la lista de paneles queda vacía → criterios 3, 5b y 5f.

**Rollback.** Revertir el único commit del incremento y su changeset. `announce` es opt-in y por omisión no cambia nada, y nada de L-14 a L-16 depende de lo nuevo.

**Decisiones ya tomadas.**
Mandan `docs/COMPONENTS.md` y el Design System de claude.ai; valen las decisiones de L-14, L-15 y L-16.
Chris pidió el 2026-10-20 que el último incremento componga las piezas existentes con pocas piezas nuevas y que el brief diga qué se construye y qué no.

**Preguntas abiertas.**
Ninguna impide empezar. Todas traen la propuesta que se construye si Chris no dice otra cosa.
1. **¿`usePanelData` se exporta, o la lógica vive solo en la story?** Propuesta: exportarla. Descartar la respuesta tardía es lo más fácil de hacer mal al componer, y dejarla en la story la deja sin contrato ni pruebas para el consumidor. Alternativa: que sea cosa de cada app, con una receta en `docs/COMPONENTS.md`. Cuesta una API pública más que mantener.
2. **¿`DataPanel` gana `announce`?** Propuesta: sí, opt-in a la baja, porque sin él cada panel anuncia por su cuenta y el dashboard tiene cinco voces. Alternativa: no tocar `DataPanel` y aceptar un aviso por panel, que es lo que este brief busca evitar.
3. **¿Cuándo se anuncia el error?** Propuesta: tras 250 ms de espera para juntar los que fallan a la vez, y sin esperar a que terminen los lentos, porque un error no debe quedar callado detrás de una carga de 30 s. Alternativa: esperar a que todo termine, que lo hace más corto pero más tardío.
4. **Monedas.** Propuesta: cada panel lleva una sola moneda, la dice en su título («cuenta en pesos») y la librería no suma ni convierte. `Amount` no tiene `currencyDisplay: 'code'`: si un consumidor muestra dos monedas que comparten símbolo en su `locale`, las cifras serían ambiguas. Se reporta, no se arregla aquí; la story usa `es-CL`, donde USD se escribe «US$» y CLP «$».
5. **¿El filtro y el orden de la tabla sobreviven a un cambio de periodo?** Propuesta: sí, la tabla no se remonta y conserva el texto escrito y el orden, que ya son un estado de quien lee. Alternativa: reiniciarlos, que pierde lo escrito por quien estaba filtrando.
6. **Capturas.** Propuesta: la comparación visual guarda la captura de cada story al tamaño fijo del proyecto (640 px) y los tres anchos se comprueban en el DOM (criterio 9). Tres capturas por ancho añadirían imágenes que revisar sin cubrir lo que el criterio 9 mide. La entrada 43 no se agrava: este incremento no cambia ningún color.
7. **Sin sección con encabezado.** Propuesta: no hay `DashboardSection`; los paneles son los `h2` y la página aporta el `h1`. Si Chris quiere agrupar paneles bajo un encabezado intermedio, `DataPanel` tendría que aceptar el nivel (hoy es un `h2` fijo por decisión de L-15) y eso es otro brief.

**Pendiente (incrementos siguientes, sin construir).**
Nada del dashboard de finanzas. Quedan, si Chris los pide: `goodWhen`, `readyLabel`, nivel de encabezado de `DataPanel`, una paleta de matices para series, orden y filtro controlados, barras apiladas y `currencyDisplay` en `Amount`.

## L-18 — Matriz React 18/19 en CI

`@caravenas/pliego-ui@0.1.0` está publicado con `peerDependencies` que admite React 19, pero los tests corren solo en 18 (decisión 6). Este incremento comprueba esa promesa.
Sin origen en PliegoStack ni en el Design System: es infraestructura.

**Objetivo.**
Que lo que `peerDependencies` promete (React 18 y 19) esté comprobado en cada push, y que cualquier consumidor en 19 pueda instalar la librería sin sorpresas.

**Alcance.**
- Reproducir primero lo que rompe: instalar React 19 sin guardar y correr tests, typecheck y las pruebas de navegador. Anotar los fallos antes de arreglar nada.
- Una matriz `react: [18, 19]` en `.github/workflows/ci.yml` para typecheck, tests y axe. Instala React sin tocar `package.json` ni el lockfile.
- Arreglar lo que falle en 19 con el cambio mínimo (se esperan `act`, tipos de `ref` y `forwardRef`).
- Cerrar la decisión 6 y actualizar la tabla de estado y «Estado actual».

**No objetivos.**
- Subir Vite, Storybook o TypeScript (decisión 5).
- Cambiar el React por defecto de las `devDependencies`.
- Componentes nuevos, capturas en CI, tema oscuro y dependencias nuevas.

**Aceptación.**
1. Con React 19 instalado sin guardar, `npm test` y `npm run typecheck` terminan en 0. Antes del arreglo queda registrado qué falló.
2. Con React 19, `npm run build-storybook`, `npm run test:a11y` y `npm run test:touch` terminan en 0 sobre las 89 stories.
3. `ci.yml` tiene la matriz 18/19 y ambas celdas pasan en una ejecución real (`gh run view`).
4. Un paso de la matriz comprueba que el React instalado es el de la celda (`node -e "console.log(require('react').version)"`), para que una celda 19 no corra en 18 sin avisar.
5. `package.json` no gana dependencias, `peerDependencies` queda igual y el lockfile no cambia (`git diff --stat package.json package-lock.json` no imprime nada).
6. Si cambia código publicable hay un changeset `patch`. Si un arreglo cambia la API pública, se para y se pregunta a Chris.
7. `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0 en la rama final.

**Rollback.** Revertir el único commit. La matriz es solo de CI y no afecta a lo publicado.

**Decisiones ya tomadas.**
Chris aprobó el brief el 2026-10-25.

**Preguntas abiertas.**
Ninguna impide empezar.

## L-19 — La verificación de `pliego-ui` como skill

Hoy la verificación visual y de accesibilidad de un cambio la hace una persona mirando Storybook, o corre entera (96 stories) sin saber qué toca el diff.
Este incremento la vuelve un procedimiento que un agente ejecuta sobre lo que cambió y que deja evidencia que una persona puede abrir después.
Es la etapa A de `~/.agents/plans/plan-pr-autonomos.md`; sin origen en PliegoStack ni en el Design System: es infraestructura.

**Objetivo.**
Que un agente pueda verificar en un navegador real las stories que un cambio toca y dejar, para cada una, capturas a 375, 768 y 1024 px, el recorrido con teclado y el estado accesible, en una ruta que sobrevive a la limpieza.

**Alcance.**
- Una skill del proyecto, `verify-pliego-ui`, con su `SKILL.md` y un script que la ejecuta. Vive en `.agents/skills/verify-pliego-ui/`, la carpeta `.agents` del propio repositorio, y Claude Code la lee desde ahí por un enlace relativo `.claude/skills/verify-pliego-ui` → `../../.agents/skills/verify-pliego-ui`, que se commitea (Chris, 2026-11-09).
- Lanzar: `npm run build-storybook` y `scripts/serve-static.mjs storybook-static` en el puerto 6007, el mismo que usa `playwright.config.ts`. Es lo que las pruebas de navegador ya usan; no se lanza `storybook dev`.
- Comprobar que está sano antes de manejar: el puerto estaba libre, `/index.json` responde con stories, y cada story elegida abre con `openStory` sin la pantalla de error de Storybook. Si algo falla, la skill termina con error y lo dice; nunca deja un informe en verde.
- Elegir las stories del diff: archivos cambiados contra la base (`git diff --name-only`) cruzados con `importPath` y `componentPath` de `storybook-static/index.json`. Un cambio en `src/components/<X>/` elige las stories de `<X>`. Un cambio en tokens, `src/styles/`, `src/hooks/`, `src/utils/`, `.storybook/` o `e2e/stories.ts` elige todas, y el informe dice por qué.
- Manejar y guardar como evidencia, por story: una captura a 375, 768 y 1024 px de ancho; el recorrido con Tab (rol, nombre accesible y si el foco se ve en cada parada, con tope de paradas y aviso de trampa de foco); el estado accesible como instantánea de `ariaSnapshot()`.
- Correr los specs que ya existen, `e2e/a11y.spec.ts` y `e2e/touch-targets.spec.ts`, filtrados a esas stories con `--grep`, y guardar su resultado JSON junto al resto. No se reescribe axe ni la medición de áreas.
- Reutilizar `listStories` y `openStory` de `e2e/stories.ts`. Único cambio permitido ahí: que `IndexEntry` exponga `importPath`, sin cambiar lo que los specs reciben hoy.
- Limpiar: parar el servidor que la skill lanzó, borrar lo temporal y dejar la evidencia en `.verification/<sha-corto>/` (añadida a `.gitignore`), con un `report.json` por ejecución: SHA, base, stories elegidas, por qué, qué se comprobó y qué falló.
- Un mapa de funcionalidades dentro de la skill: cada funcionalidad con los títulos de sus stories y, para las que tienen interacción propia, la tecla o gesto que vale la pena recorrer (por ejemplo, flechas en `SegmentedControl`, orden y filtro en `MovementsTable`, abrir y cerrar `Drawer`).
- Actualizar la tabla de estado y «Estado actual» al cerrar.

**No objetivos.**
- Comparar las capturas nuevas con una referencia: eso es `npm run test:visual` y sus 96 referencias de macOS, que no se tocan. La evidencia es para mirarla, no para decidir sola.
- Cambiar `playwright.config.ts`, `e2e/a11y.spec.ts`, `e2e/touch-targets.spec.ts` o `e2e/visual.spec.ts`, o los workflows de CI.
- Dependencias nuevas (Playwright, `@axe-core/playwright` y `tsx` ya están) y componentes nuevos.
- El veredicto del PR, la plantilla del PR y publicar nada: son las etapas B y C del plan de PR autónomos.
- Verificar el Design System publicado en claude.ai (`ds:check` ya lo hace) y probar en otro navegador o plataforma.

**Aceptación.**
1. Un test de Vitest sobre la función que cruza archivos cambiados con `index.json` comprueba que `src/components/Amount/Amount.tsx` elige solo las stories de `Finanzas/Amount`, que `src/components/Amount/Amount.test.tsx` también, que `src/styles/base.css` elige las 96 con la razón escrita, y que un archivo sin story (`README.md`) no elige ninguna y lo dice.
2. Sin lanzar nada, un comando de la skill con el puerto 6007 ocupado por otro proceso termina distinto de 0 y nombra el puerto; con `storybook-static/index.json` ausente, termina distinto de 0 y dice que falta compilar. En los dos casos `.verification/` no gana ningún `report.json`. Se comprueba ejecutando ambos casos.
3. Con una story rota plantada de forma temporal (no se commitea), la comprobación de salud falla nombrando el id de esa story, y el informe no queda en verde. Se comprueba con una prueba manual de ese caso: se planta la story, se corre el comando de la skill y se borra la story.
4. Sobre una funcionalidad del mapa, para cada story elegida existen tres PNG cuyos anchos, leídos con un comando (`file` o `sips`), son 375, 768 y 1024 px, un `keyboard.json` con al menos una parada y un `aria.yml` no vacío. Se comprueba con un comando que lista y mide los archivos.
5. El resultado JSON de `a11y.spec.ts` y `touch-targets.spec.ts` filtrados a esas stories queda en la evidencia con cero fallos, y `git diff --stat e2e/a11y.spec.ts e2e/touch-targets.spec.ts e2e/visual.spec.ts playwright.config.ts` no imprime nada.
6. Un test comprueba el mapa de funcionalidades contra `index.json`: todo título del mapa existe y toda story del índice pertenece a una funcionalidad, para que una story nueva no quede sin mapa sin que algo falle.
7. Ejecución de punta a punta sobre `Finanzas/MovementsTable` (la que tiene orden y filtro): el comando de la skill termina en 0; `find .verification -type f` lista la evidencia del criterio 4 antes de la limpieza y la misma lista después, `lsof -i :6007` no imprime nada, `git status --porcelain` no muestra archivos rastreados cambiados y no queda nada en un directorio temporal que la skill haya creado. La salida de los dos `find` se pega en el cierre del incremento.
8. Revisión manual de Chris, que el agente deja sin marcar: abre una captura de cada ancho y el `keyboard.json` de `MovementsTable` y confirma que sirven para juzgar el cambio sin abrir Storybook.
9. `SKILL.md` dice el comando, la ruta de la evidencia, que reconstruye Storybook en cada ejecución, y lo que la evidencia no demuestra (no compara con referencias, no sustituye a `npm run test:visual`, 640 px de las pruebas frente a 375, 768 y 1024 de la skill). Se comprueba por revisión manual de ese texto.
10. `package.json` y `package-lock.json` no cambian (`git diff --stat package.json package-lock.json` no imprime nada) y `npm test`, `npm run typecheck`, `npm run build`, `npm run build-storybook`, `npm run test:a11y` y `npm run test:touch` terminan en 0 en la rama final.
11. `.claude/skills/verify-pliego-ui` es un enlace relativo a `../../.agents/skills/verify-pliego-ui`: `readlink .claude/skills/verify-pliego-ui` lo muestra, `test -f .claude/skills/verify-pliego-ui/SKILL.md` termina en 0 y `git ls-files .claude .agents/skills` lista ambos. Que una sesión nueva de Claude Code en el repositorio muestre la skill en su lista es una comprobación manual de Chris, que el agente deja sin marcar.

**Rollback.** Borrar la carpeta de la skill y su enlace en `.claude/skills/`, la línea de `.gitignore` y revertir el cambio aditivo de `e2e/stories.ts`: nada más depende de ella. La carpeta `.verification/` es local y se puede borrar.

**Decisiones propuestas** (las confirma Chris al aprobar).
- Lo que se maneja es el Storybook compilado, no `storybook dev`: es lo que los specs y la CI ya usan, y el compilado es lo que se publica.
- Se reconstruye en cada ejecución. Es más lento (el build) pero evita verificar un `storybook-static` viejo, que es la forma más fácil de dar evidencia de otro código.
- La evidencia se guarda por SHA, para que la etapa B del plan de PR autónomos pueda exigirla sobre el mismo commit.
- La skill vive en el `.agents` del repositorio y se expone a Claude con un enlace: la carpeta es la fuente y cada CLI que la descubra lee de ahí.
- Los specs de axe y de áreas se reutilizan filtrados, no se duplican; la skill añade solo lo que no existe: capturas a tres anchos, recorrido con teclado y estado accesible.

**Preguntas abiertas.**
Ninguna bloquea el brief.
1. Retención de `.verification/`: propuesta, ninguna en este incremento; se borra a mano y se revisa tras la primera ejecución real, cuando se sepa cuánto pesa una carpeta por SHA.

**Resueltas (Chris, 2026-11-09).**
- La skill vive en `.agents/skills/verify-pliego-ui/` y Claude la lee por un enlace desde `.claude/skills/`.
- «Lo que el diff toca» se calcula contra `origin/main...HEAD`, con `--base` para cambiarla.
- El mapa de funcionalidades se escribe a mano.
- Todo sale de `main`: el cierre de L-18 se integra primero (`docs/l-18-close`) y la rama de L-19 se corta sobre `origin/main` con ese cierre; el PR de L-19 no arrastra commits de L-18.

---

## Decisiones

Las tomó el agente el 2026-10-16, por encargo de Chris («toma tú las decisiones de las preguntas abiertas»). Están **cerradas** salvo las marcadas como **aplazadas**, que dicen qué las reabriría. Chris puede cambiar cualquiera.

1. **Radiogroup frente a `aria-pressed`.** Cerrada: `SegmentedControl` es `tablist` y `radiogroup` con tabindex móvil (Chris, 2026-10-12); `OptionCard` mantiene `aria-pressed` (14).
2. **Colores de estado sin token.** Reabierta y resuelta en parte por L-14 (Chris, 2026-10-19): se añade `color-success-foreground` para los abonos y se usa `color-danger-foreground` para los cargos. No hay `color-warning`. El punto de `.catalog-persistence` sigue siendo de la app.
3. **Botón en cápsula o con `radius-md`.** Cerrada: `radius-md`, como en el código. Un botón no es un control de entrada, que es lo que el sistema dice que va en cápsula.
4. **Tema oscuro.** Cerrada: no hay. No está en el plan ni lo pide ningún consumidor. Se reabre si lo pide uno.
5. **Versiones.** Aplazada: no se suben las versiones mayores (Vite, Storybook, TS) sin un motivo. Los 28 avisos de `npm audit` son de herramientas de desarrollo. Se hace en un incremento propio cuando una dependencia lo exija.
6. **React 19.** Cerrada (2026-11-06, L-18): CI corre la suite entera en React 18 y 19 (ejecución 42150949599). El único fallo era el tipo de un `useRef` en una story, no código publicado. Lo que sigue sin comprobarse es el uso real en una aplicación en 19, porque aún no hay un consumidor.
7. **`Drawer` modal o no.** Cerrada: no modal (ver 23).
8. **Error de `Field`.** Cerrada: texto y filete de 2 px en `color-danger-foreground`. Contrastado con el Design System: su nota de uso de ese token («texto y borde de un error que bloquea un cálculo, siempre con palabras», 5,96:1) lo respalda.
9. **Margen derecho de `Select`.** Cerrada: `calc(var(--space-3) + var(--space-6))` (36 px) y los pesos de 1 px y 2 px como literales, igual que `Input`. No se crea un token de «margen de control».
10. **`pointer: coarse` en L-2.** Cerrada: medido. `e2e/touch-targets.spec.ts` mide, en las 48 stories y con un móvil emulado, que todo control tiene 44 px de alto (40 px con puntero fino).
11. **Estilo de texto de `options`.** Cerrada: `central-tab` en `tabs` y en `options`, un solo lenguaje visual para el selector segmentado.
12. **Teclas verticales.** Cerrada y hecha: `options` responde también a arriba y abajo, como un `radiogroup` nativo. `tabs` sigue con izquierda y derecha. Con tests y un changeset `patch`.
13. **`pointer: coarse` en L-3.** Cerrada: medido (ver 10).
14. **`OptionCard` con `aria-pressed`.** Cerrada: se mantiene la semántica y la API de PliegoStack, y no promete flechas. Pasar a `radio` sería un cambio de API que hoy nadie pide.
15. **Excepciones de tamaño de `OptionCard`.** Cerrada: la caja del dibujo (34 px) y el paso fino del texto (2 px) siguen literales y comentados.
16. **Foco de `MeasureField`.** Cerrada: anillo de tinta de 2 px con 3 px de separación. El propio Design System documenta esa excepción en su README de `MeasureField`.
17. **Alineación de `MeasureField`.** Cerrada: la cifra y la unidad se alinean al centro dentro de 40 px de alto, para cumplir el área mínima del sistema.
18. **Estado de `SpecStep`.** Cerrada: el componente lleva el estado y `open` controla de verdad.
19. **Alineación de `SpecStep`.** Cerrada: se acepta la diferencia de 1,6 px con `space-7`, que es el valor de PliegoStack. Una alineación exacta exigiría derivar la sangría del ancho del número.
20. **`HowPanel` sin nota por defecto.** Cerrada: la nota viaja por `note`, y solo con nota el panel no se pinta.
21. **Errores de `Field` y de `Notice`.** Cerrada: son dos tratamientos a propósito, del mismo token. En `Field`, un filete bajo un control; en `Notice`, una caja (borde al 30% de `color-danger-foreground`).
22. **Workflows de L-1.** Cerrada (2026-10-13): CI y release verificados; hubo que activar «Allow GitHub Actions to create and approve pull requests».
23. **`Drawer` no modal.** Cerrada, con la evidencia del origen: PliegoStack pasó el catálogo de modal a panel (R-24).
24. **Ancho y posición del `Drawer`.** Cerrada: capa fija en el borde derecho, de ancho `min(100%, 30rem)`, literal comentado.
25. **Auditoría de dependencias.** Cerrada: `npm audit --omit=dev` da 0 vulnerabilidades en lo que se publica.
26. **`Toast` sin API imperativa.** Cerrada: se controla con `open`. Un `toast(...)` global añade estado global que ningún consumidor pide.
27. **Errores de `Toast` persistentes.** Cerrada: no se van solos. Si apilar varios molesta, se limitará la cola.
28. **Captura de puntero en los tests.** Cerrada: `src/test/setup.ts` define sus métodos como no-ops, porque jsdom no los trae.
29. **Playwright Test en lugar de `@storybook/test-runner`.** Cerrada: una herramienta, y sin `jest-image-snapshot`.
30. **Capturas solo en local.** Cerrada: las 48 referencias son de macOS y no se ejecutan en CI. Para activarlas habría que generar las de Linux y revisarlas una vez.
31. **`SpecStep` y axe.** Cerrada: el botón «···» sale del `<summary>`, y PliegoStack, al consumir la librería, adopta ese marcado.
32. **Colisión con el addon `a11y`.** Cerrada: la prueba reintenta mientras el addon termina.
33. **`pages.yml`.** Cerrada (2026-10-13): Pages desplegando en https://caravenas.github.io/pliego-ui/.
34. **READMEs del Design System.** Cerrada: parten de los que ya tenía el artifact, adaptados, y viven en `docs/design-system/`.
35. **Hoja heredada en `bundle.css`.** Cerrada: se conserva para `AppHeader`, `CatalogBoard`, `CatalogPanel`, `Panel` y la cubierta; se borra `scripts/design-system/legacy.css` cuando esas tarjetas salgan.
36. **Previews que no se van solos.** Cerrada: los de `Toast` fijan `duration: Infinity` y el de `Drawer` sale abierto.
37. **Publicación del Design System.** Cerrada: versión 14 del artifact (2026-10-16). `tokens.json` ya no trae `glass-bg` ni `glass-border`, y su `meta.source` pasa a `library`.
38. **Mantener el artifact al día.** Cerrada: republicar es manual, con confirmación de Chris. Un CI que lo republique podría pisar ediciones hechas desde la página.
39. **Las pruebas de navegador esperaban poco (2026-10-16).** Cerrada: `sb-show-main` se pone antes de que React monte la story, así que `a11y`, `visual` y `touch` podían medir una página vacía y pasar sin comprobar nada. `openStory` espera ahora a que haya algo que medir; con eso, a11y pasa 48 de 48 y las áreas, 96 de 96, en tres ejecuciones.
40. **Marcas de escala de `OptionCard` bajo 40 px (2026-10-16).** Cerrada: la prueba de áreas encontró que `variant="notch"` medía 27–39 px con puntero fino; ahora `OptionCard` fija `min-height: 40px`, y la marca conserva su número pegado, sin crecer el texto. Cambia la captura de `OptionField · Scale`. El artifact de claude.ai se republicó con ese CSS y con las teclas verticales de `SegmentedControl` (versión 17, 2026-10-16, con la confirmación de Chris); las huellas de `bundle.js` y `bundle.css` coinciden con lo generado.
41. **Cifras de finanzas (2026-10-19, L-14).** Confirmadas por Chris: gráfica en SVG propio, `locale` opcional, color de estado con signo y palabra, tabla de valores visible. Las tomó el agente y hay que confirmar: el color solo va con `flow` (un `Amount` neutro con signo negativo no se colorea); un cero no lleva color ni palabra; el importe no numérico, incluida una cadena como `"12.5"`, se escribe «sin dato» en vez de convertirse; una moneda desconocida escribe la cifra y el código recibido en lugar de lanzar; la serie de `TrendChart` deja un hueco en un valor ausente en vez de unir los vecinos; el contenedor de `MovementsTable` es una región enfocable para poder desplazarla con el teclado.
42. **Estados del dashboard (2026-10-20, L-15).** Confirmadas por Chris al aprobar el brief: selector de periodo como `SegmentedControl`, variación en tinta y por la diferencia redondeada, datos anteriores visibles y marcados, `alert` solo sin datos, foco al panel tras reintentar, `metric-value`, `Metric` con filete, sin anuncio de «actualizado», `h2` fijo, y el abono en azul (`#1d4ed8`, elegido por el agente). Las tomó el agente al construir y hay que confirmar: el aviso de valores repetidos de `SegmentedControl` sale siempre, no solo en desarrollo, porque la librería no puede leer `process.env` sin romper el bundle del Design System; el candado de «reintentar» se abre cuando cambian `status` o `error`; tras reintentar, el foco no se mueve si quien reintentó ya está en otro control; una diferencia que no cabe en un número (`1e308` frente a `−1e308`) no escribe variación; y el error con datos se escribe en `color-danger-foreground`.
43. **La comparación visual no ve un cambio de color en texto pequeño (2026-10-20).** Abierta: al pasar el abono de verde a azul, `npm run test:visual` siguió en verde con las referencias viejas, y `test:visual:update` no las reescribió, porque la diferencia cabe en la tolerancia por defecto de Playwright. Se borraron y regeneraron a mano las de `Amount · Flow` y `MovementsTable`. Propuesta: bajar `threshold` en `toHaveScreenshot`, o comprobar los colores con un test de estilos computados; es cambio de infraestructura y lo decide Chris.
44. **Barras y orden y filtro (2026-10-20, L-16).** Confirmadas por Chris al aprobar el brief: series distinguidas con cuatro rellenos de tinta, nombre y posición (sin tonos ni tokens), máximo cuatro series, orden de tres estados, filtro por concepto y fecha escrita, anuncio del conteo 500 ms tras la última tecla y la entrada 43 sin resolver. Las tomó el agente al construir y hay que confirmar: el cero se marca con una línea en la base porque un `rect` de alto cero no se pinta; la tabla de valores de `BarChart` se desplaza dentro de una región enfocable (axe lo exigió con muchas series); los estilos de orden y filtro viven en `MovementsTable.controls.css` porque el test de L-14 de `MovementsTable.css` solo admite 1 px y 2 px y no se podía tocar; un concepto vacío se ordena como desconocido y va al final; el conteo anunciado usa el valor de cuando se dejó de escribir; la escala usa mitades para no desbordar con `Number.MAX_VALUE`; el filtro se escribe en un `<input type="search">` dentro de `Field`.
45. **Dashboard compuesto (2026-10-21, L-17).** Confirmadas por Chris al aprobar el brief: `usePanelData` exportado, `announce` en `DataPanel`, el error se anuncia tras 250 ms sin esperar a los lentos, una moneda por panel, la tabla conserva filtro y orden al cambiar de periodo, una sola captura por story y sin sección con encabezado. Las tomó el agente al construir y hay que confirmar: el mínimo de columna es `18rem` y no `20rem` como decía el brief, porque con 20rem solo caben 2 columnas a 1024 px (se midió: esperaba 3 y salieron 2) y 18rem es lo máximo que deja 3; la cuenta de «cargando N paneles» se fija al terminar la espera de 250 ms y no se actualiza; el `Notice` de un panel con `announce={false}` usa `role="none"`; `usePanelData` no cachea y dos paneles con el mismo título se tratan como dos; el panel quitado de la story no llama a su cargador; `dom-accessibility-api` no se usa en los tests (no es dependencia directa); las capturas de la story `Con periodo` usan el periodo inicial sin retraso para ser estables.
46. **Abono cian y cargo magenta (2026-10-21).** Pedido por Chris, que eligió que el abono use el mismo cian que `color-accent-ink` (`#0a6285`) y que el cargo tenga un token propio, `color-debit-foreground` (`#a21caf`, magenta, elegido por el agente), para no teñir de magenta los errores de `Field`, `Notice` y `DataPanel`. Sustituye al azul de la entrada 42. El test que separaba el abono del cian del foco en 15° de tono pasa a exigir cian y magenta. Abono y foco comparten color y se distinguen por signo, palabra y lugar; hay que revisarlo a mano.
