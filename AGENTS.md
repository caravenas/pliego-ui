# pliego-ui — instrucciones para agentes

`@caravenas/pliego-ui` es la librería de componentes de PliegoStack: React 18/19, TypeScript, Vite en modo librería, CSS plano con custom properties, Storybook 8, Vitest 3 y Changesets.
Es la **fuente de verdad** del sistema: PliegoStack la consume, y el Design System de claude.ai se re-sincroniza desde aquí.

## Por dónde empezar

1. Lee `docs/PLAN.md`. Es el plan canónico: dice qué incrementos están cerrados y cuál es el siguiente.
2. Implementa solo el incremento que el plan marca como siguiente, respetando su alcance, sus no objetivos y sus criterios de aceptación.
3. Para un componente que se porta desde PliegoStack, lee primero su origen en `../book-engineering-tool` (las rutas están en el plan). Los valores se copian exactos: 5px sigue siendo 5px.
4. Antes de tocar la API de un componente, lee su especificación en `docs/COMPONENTS.md`.

## Comandos

- Node 22 (`.nvmrc`).
- `npm run dev` abre Storybook en :6006.
- `npm test` corre Vitest. `npm run typecheck` corre tsc.
- `npm run build` hace tokens, typecheck y el build de librería en `dist/`.
- `npm run build-storybook` compila Storybook; úsalo para verificar que las stories cargan.
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

## Al cerrar un incremento

- Un único commit reversible con el componente, su story y sus tests.
- Si cambia algo publicable, añade un changeset (`npm run changeset`).
- Confirma con la salida real de `npm test`, `npm run typecheck`, `npm run build` y `npm run build-storybook` antes de declararlo terminado.
- Actualiza en `docs/PLAN.md` la tabla de estado (incremento, commit) y la sección «Estado actual».
- Registra en «Decisiones abiertas» cualquier supuesto que haya que confirmar.
