# pliego-ui — instrucciones para agentes

`@caravenas/pliego-ui` es una librería de componentes independiente, para usar en cualquier proyecto: React 18/19, TypeScript, Vite en modo librería, CSS plano con custom properties, Storybook 8, Vitest 3 y Changesets.
Nació del sistema de diseño de PliegoStack, que es su origen y uno de sus posibles consumidores, no su definición.

## Qué manda sobre el estilo

Manda `docs/COMPONENTS.md` y, sobre todo, el Design System de claude.ai (https://claude.ai/artifact/81WGnnxqtHUGnc6yK9DAHe).
Si los dos se contradicen, no elijas en silencio: anótalo en «Decisiones» de `docs/PLAN.md` y avisa a Chris.
El código y los documentos de PliegoStack son procedencia: sirven para copiar valores exactos, no para decidir cómo debe verse la librería.

## Por dónde empezar

1. Lee `docs/PLAN.md`. Es el plan canónico: dice qué incrementos están cerrados y cuál es el siguiente.
2. Implementa solo el incremento que el plan marca como siguiente, respetando su alcance, sus no objetivos y sus criterios de aceptación.
3. Para un componente que se porta desde PliegoStack, lee primero su origen en `../book-engineering-tool` (las rutas están en el plan). Los valores se copian exactos: 5px sigue siendo 5px. Es procedencia, no autoridad: ante una duda de estilo, vuelve a la sección anterior.
4. Antes de tocar la API de un componente, lee su especificación en `docs/COMPONENTS.md`.

## Comandos

- Node 22 (`.nvmrc`).
- `npm run dev` abre Storybook en :6006.
- `npm test` corre Vitest. `npm run typecheck` corre tsc.
- `npm run build` hace tokens, typecheck y el build de librería en `dist/`.
- `npm run build-storybook` compila Storybook; úsalo para verificar que las stories cargan.
- `npm run test:a11y` corre axe sobre cada story del Storybook compilado. `npm run test:touch` mide en el navegador que todo control tenga 40 px de alto como mínimo, y 44 px con puntero grueso emulado. `npm run test:visual` compara una captura por story con su referencia (`e2e/visual.spec.ts-snapshots`, de macOS); `npm run test:visual:update` las regenera tras un cambio visual intencionado y hay que revisar el diff de las imágenes. Las dos necesitan `npx playwright install chromium` una vez.
- `npm run ds:build` produce en `design-system/` (ignorada por git) el árbol del Design System de claude.ai a partir de la librería. `npm run ds:check` lo construye y abre cada tarjeta como la abre el artifact, sin errores y con axe. Publicar en el artifact es un paso aparte, con confirmación de Chris (ver L-13 en `docs/PLAN.md`).
- Todos regeneran los tokens antes de correr (`pre*`).

## Reglas del proyecto

- **Tokens**: se editan solo en `tokens/tokens.json` y `tokens/motion.json`. `src/styles/tokens.css` y `src/tokens.ts` son generados e ignorados por git; nunca se editan a mano.
- `tokens.json` mantiene el formato del Design System de claude.ai: familias como listas `{name, value, usage}`, nombres únicos, sin `var()` ni colores con nombre. Todo token nuevo lleva su `usage`.
- **Nada de colores, tamaños ni radios literales** en el CSS de un componente: todo sale de una variable. La única excepción es un valor que el sistema define como literal (la cápsula `9999px`, los 40/44 px de área mínima), comentado.
- Clases con prefijo `pui-` y BEM ligero (`pui-button--primary`). Nada global salvo las variables en `:root`.
- Cada componente vive en `src/components/<Nombre>/` con `<Nombre>.tsx`, `.css`, `.stories.tsx` y `.test.tsx`, y se exporta en `src/index.ts`, con sus tipos.
- `forwardRef` en todo componente que pinte un elemento nativo, con las props nativas pasando intactas. Por defecto, `type="button"`.
- Reglas del sistema que no se negocian:
  - 40 px de alto mínimo, 44 px con `pointer: coarse`.
  - Foco: anillo de 2 px de `color-accent-ink`, separado del borde y solo en `:focus-visible`.
  - `color-accent` nunca va en texto ni en bordes con significado.
  - El realce de puntero nunca se aplica al estado elegido.
  - Los estados se leen en palabras, no solo por color.
  - Las etiquetas van en minúsculas en el JSX; las versalitas las pone CSS.
- Los comentarios del CSS explican el porqué de una decisión, no el qué, igual que en PliegoStack.
- Radix entra solo para primitivos con comportamiento difícil (Dialog, Popover, Tooltip), un paquete `@radix-ui/react-*` por primitivo. **No añadas ninguna otra dependencia sin aprobación de Chris.**
- Los mensajes de commit van en inglés, con prefijo convencional (`feat:`, `fix:`, `docs:`, `test:`, `chore:`), y sin coautores de agentes.

## Cómo se escribe un incremento

- Un incremento nuevo parte de un brief en `docs/PLAN.md`: Objetivo, Alcance, No objetivos, Aceptación numerada y Rollback. El formato está en `~/.agents/docs/formato-de-brief.md`.
- Compruébalo con `node ~/.agents/workflows/scripts/task-brief.mjs check docs/PLAN.md --heading "L-2"`. Cada criterio de Aceptación dice cómo se comprueba: un comando, un test, una prueba o una revisión manual.
- Lo propone el agente y lo aprueba Chris antes de construir. Nadie construye desde un brief sin aprobar.
- El contrato de verificación (`.verify.conf`) y su política (`.agents/policy.json`) los edita solo Chris.

## Al cerrar un incremento

- Un único commit reversible con el componente, su story y sus tests.
- Si cambia algo publicable, añade un changeset (`npm run changeset`).
- Confirma con la salida real de `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` antes de declararlo terminado.
- Actualiza en `docs/PLAN.md` la tabla de estado (incremento, commit) y la sección «Estado actual».
- Registra en «Decisiones» de `docs/PLAN.md` cualquier supuesto que haya que confirmar.
