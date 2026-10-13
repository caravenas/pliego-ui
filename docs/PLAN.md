# Plan — pliego-ui

Plan canónico de la librería. Un agente implementa **solo** el incremento marcado como siguiente en la tabla de estado y, al cerrarlo, la actualiza.

## Estado actual

- Scaffold en `main` (`9db7d12`): Vite en modo librería, TS, Storybook 8.6, Vitest 3, Changesets y el pipeline de tokens.
- Primitivos hechos: `Button` (primary, secondary, outline, danger; forma `round`), `Badge` / `OriginBadge` e `Input`. 21 tests en verde, build y build de Storybook verificados.
- Aún sin remoto en GitHub, sin CI y sin publicar.
- L-0 está a medias (2026-10-12): las dependencias ya están instaladas en macOS y `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` terminan en 0. Falta limpiar los restos de git de la VM Linux (`.git/stale-*` y `tmp_obj_*`) y crear el remoto.
- **Siguiente: L-2**, que no necesita el remoto y es el piloto de la entrada estándar de tareas. L-1 espera al remoto de L-0.

| Id | Incremento | Estado | Commit |
| --- | --- | --- | --- |
| L-0 | Puesta en marcha local y remoto | a medias (Chris) | |
| L-1 | CI en GitHub Actions | pendiente (necesita el remoto) | |
| L-2 | `Field` y `Select` | **siguiente** | |
| L-3 | `SegmentedControl` | pendiente | |
| L-4 | `OptionField` y `OptionCard` | pendiente | |
| L-5 | `MeasureField` | pendiente | |
| L-6 | `SpecStep` | pendiente | |
| L-7 | `ResultList`, `ResultRow` y `HowPanel` | pendiente | |
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

Ver § SegmentedControl. Un solo componente con dos semánticas, porque PliegoStack usa el mismo dibujo para dos cosas distintas:
- `kind="tabs"`: cambia lo que se mira (`.central-tabs`, `.central-tab`). Es un `tablist` con flechas.
- `kind="options"`: cambia un valor (formato, proporción). Son botones con `aria-pressed`, como hoy.

**Aceptación**: las flechas mueven la selección en `tabs`; la activa se rellena de tinta; la apuntada que no está activa se aclara; las costuras se comparten y la última no tiene borde derecho.

## L-4 — `OptionField` y `OptionCard`

Ver § OptionCard. Origen: `src/components/OptionGroup.tsx` y los selectores `.option-*` y `.option-card-notch`.

**Aceptación**:
- API compatible con la de PliegoStack (mismos nombres de props), para que la migración sea un cambio de import.
- `disabledReason` deshabilita la tarjeta y escribe la razón en ella.
- El dibujo va con `aria-hidden` y en `currentColor`.
- Variantes `card`, `notch` y `row`; `layout` `grid` y `scale`.
- Tests: `aria-pressed`, deshabilitado con razón visible y `onSelect`.

## L-5 — `MeasureField`

Ver § MeasureField. Origen: `src/components/MeasureField.tsx`. Es el componente con más comportamiento: escribir, flechas (más Mayús para 10 pasos) y arrastrar la unidad con captura de puntero.

**Aceptación**:
- Los tres modos de entrada funcionan y redondean al grid del paso (`decimalsOf`).
- El arrastre sobrevive a que el puntero salga del tirador.
- Nunca baja de `min`.
- Variante `dashed` para el sangrado.
- Tests de teclado y de arrastre simulando eventos de puntero.

## L-6 — `SpecStep`

Ver § SpecStep. Un `<details>` numerado con título, botón de opciones (`···`) y resumen.

**Aceptación**:
- La sangría usa `space-7`, que ahora existe; comprobar en Storybook que el valor y el cuerpo se alinean bajo el título.
- El valor se oculta con el paso abierto.
- `open` funciona controlado y no controlado.

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

1. **Radiogroup frente a `aria-pressed`.** PliegoStack usa botones con `aria-pressed` en `OptionCard` y en los segmentos, porque un `radiogroup` promete un solo punto de tabulación y flechas, y ese trabajo de accesibilidad estaba congelado. En una librería ese trabajo se hace una vez y sirve a todos. ¿Implementar `radiogroup` con tabindex móvil en L-3/L-4, o mantener `aria-pressed` por compatibilidad?
2. **Colores de estado sin token.** `.catalog-persistence` pinta su punto con `#15803D` (guardado) y `#B45309` (solo sesión), literales. Propuesta: `color-success` y `color-warning` en `tokens.json`, con su contraste medido.
3. **Botón en cápsula o con `radius-md`.** El rediseño dice que «todo control de entrada» va en cápsula, pero los botones del catálogo usan `radius-md`. La librería sigue el código (`radius-md`); confirmar que es intencional.
4. **Tema oscuro.** No existe. El formato lo admite (`color.themes`); decidir si se quiere antes de 1.0.
5. **Versiones.** Se fijaron las combinaciones probadas en PliegoStack (Vite 6, React 18 en desarrollo, TS 5.6, Storybook 8.6), más Vitest 3. Ya hay versiones mayores (Vite 8, Storybook 10, TS 7). Subir en un incremento propio, no mezclado.
6. **React 19.** `peerDependencies` lo admite, pero los tests corren en 18. Añadir una matriz 18/19 en CI cuando haya consumidor en 19.
7. **El `Drawer` modal o no** (ver L-11).
