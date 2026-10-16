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
- L-9 cerrado en local: axe sobre las 48 stories (`npm run test:a11y`) y capturas comparadas (`npm run test:visual`). En CI solo corre axe; `pages.yml` está escrito y sin ejecutar.
- L-1 cerrado (2026-10-13): con los dos permisos activados, el release abrió el PR de versión y, al mergearlo, publicó `@caravenas/pliego-ui@0.1.0` en GitHub Packages con `GITHUB_TOKEN` y creó el tag `v0.1.0`. Storybook se publica en https://caravenas.github.io/pliego-ui/.
- L-10 cerrado (`e10826c`, 2026-10-13): `@caravenas/pliego-ui@0.1.0` se instala desde un proyecto vacío con `@caravenas:registry` en su `.npmrc`, trae `@radix-ui/react-dialog` y `react-toast` como dependencias, exporta los 18 componentes y `./styles.css` y `./tokens.json` resuelven.
- L-13 cerrado (2026-10-16, `50d65e0`): `npm run ds:build` produce el árbol y `npm run ds:check` (33 pruebas) lo comprueba. Chris confirmó la publicación y se publicó en el artifact: 14 tarjetas vivas con `bundle.js` (`window.PliegoUI`), `bundle.css`, tokens de la librería (con `space-7`) y el README de marca al día; se sustituyeron `FormField`, `OptionGroup`, `CentralTabs` y `Notices`; `AppHeader`, `CatalogBoard`, `CatalogPanel`, `Panel` y la cubierta se conservaron. Las huellas de `bundle.js`, `bundle.css`, `tokens.json` y de un preview coinciden con lo generado, y las tarjetas se ven vivas en el artifact abierto. La copia de seguridad previa está en `design-system/backup-2026-10-15/` (local, ignorada por git).
- Decisiones cerradas (2026-10-16): las 38 abiertas se resolvieron (ver «Decisiones»), con tres cambios de código: teclas arriba y abajo en `options`, `min-height: 40px` en `OptionCard` y una espera correcta en las pruebas de navegador, que además miden ahora las áreas de puntero en las 48 stories.
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

---

## Decisiones

Las tomó el agente el 2026-10-16, por encargo de Chris («toma tú las decisiones de las preguntas abiertas»). Están **cerradas** salvo las marcadas como **aplazadas**, que dicen qué las reabriría. Chris puede cambiar cualquiera.

1. **Radiogroup frente a `aria-pressed`.** Cerrada: `SegmentedControl` es `tablist` y `radiogroup` con tabindex móvil (Chris, 2026-10-12); `OptionCard` mantiene `aria-pressed` (14).
2. **Colores de estado sin token.** Aplazada: no se añaden `color-success` ni `color-warning`. El punto de `.catalog-persistence` es de la app, no de la librería. Se reabre si un componente de la librería los necesita.
3. **Botón en cápsula o con `radius-md`.** Cerrada: `radius-md`, como en el código. Un botón no es un control de entrada, que es lo que el sistema dice que va en cápsula.
4. **Tema oscuro.** Cerrada: no hay. No está en el plan ni lo pide ningún consumidor. Se reabre si lo pide uno.
5. **Versiones.** Aplazada: no se suben las versiones mayores (Vite, Storybook, TS) sin un motivo. Los 28 avisos de `npm audit` son de herramientas de desarrollo. Se hace en un incremento propio cuando una dependencia lo exija.
6. **React 19.** Aplazada, con un riesgo que hay que decir: `peerDependencies` admite React 19 y los tests corren solo en 18, así que esa compatibilidad **no está comprobada**. Se añade una matriz 18/19 en CI cuando haya un consumidor en 19 o antes de una versión 1.0.
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
