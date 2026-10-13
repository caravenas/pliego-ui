# @caravenas/pliego-ui

Una librería de componentes para usar en cualquier proyecto: los tokens del sistema, los primitivos y, más adelante, los patrones propios de la ingeniería editorial (medidas, opciones dibujadas, ficha técnica, resultados).
Nació del sistema de diseño de PliegoStack, pero es un proyecto independiente.

El estilo lo fijan `docs/COMPONENTS.md` y, sobre todo, el Design System de claude.ai (artifact PliegoStack): la librería lo implementa.
Cuando la librería cambia, el artifact se re-sincroniza desde aquí (L-13).
PliegoStack es el origen de los patrones y uno de los proyectos que pueden consumir el paquete (L-12); no lo define.

```
tokens/tokens.json ──► src/styles/tokens.css + src/tokens.ts ──► dist/ (npm)
                                                                  ├─► cualquier proyecto (p. ej. PliegoStack)
                                                                  └─► Design System (re-sync)
```

## Uso

```bash
npm install @caravenas/pliego-ui
```

```tsx
import '@caravenas/pliego-ui/styles.css'; // tokens + estilos de los componentes
import '@caravenas/pliego-ui/fonts.css';  // opcional: Inter, Outfit y JetBrains Mono desde Google Fonts
import { Button, Input, OriginBadge } from '@caravenas/pliego-ui';

<Button variant="primary">Guardar cambios</Button>
<OriginBadge origin="own" />  // «tuyo»
```

Los tokens conservan los nombres de PliegoStack (`--color-text-primary`, `--space-4`, `--radius-md`…). El CSS actual de la app funciona sobre `styles.css` sin renombrar nada, así que la migración puede hacerse componente a componente.

Para leer un token desde TypeScript con el nombre comprobado, usa `cssVar('color-accent-ink')`, que devuelve `'var(--color-accent-ink)'`.

## Desarrollo

Node 22 (`.nvmrc`).

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Genera los tokens y abre Storybook en :6006 |
| `npm test` | Vitest 3 + Testing Library en jsdom |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Tokens, typecheck y build de librería: `dist/pliego-ui.js`, `dist/styles.css`, `dist/fonts.css`, `.d.ts` |
| `npm run tokens` | Solo regenera `src/styles/tokens.css` y `src/tokens.ts` |
| `npm run changeset` | Registra un cambio publicable |

### Tokens

Se editan **solo** en `tokens/tokens.json` y `tokens/motion.json`. `src/styles/tokens.css` y `src/tokens.ts` se generan (y están en `.gitignore`): `dev`, `storybook`, `test`, `typecheck` y `build` los regeneran antes de correr.

`tokens.json` tiene el mismo formato que el Design System de claude.ai: cada familia es una lista de `{name, value, usage}`. Así el mismo archivo sirve para volver a sincronizar el artifact. El movimiento vive aparte porque ese formato no lo admite.

Cambios respecto del CSS de PliegoStack, registrados en `tokens.json → meta.changes`:

- `space-7` (1.75rem) añadido. La app lo usaba sin declararlo, así que la sangría de la ficha técnica no se aplicaba.
- `glass-bg`, `glass-border` y `glass-blur` eliminados: eran restos sin uso de una paleta anterior.
- JetBrains Mono ahora se carga, en `fonts.css`. La app no la cargaba en ningún sitio.

### Convenciones

- Clases con prefijo `pui-` y BEM ligero (`pui-button--primary`). Nada global salvo las variables en `:root`.
- Cada componente vive en `src/components/<Nombre>/` con su `.tsx`, `.css`, `.stories.tsx` y `.test.tsx`.
- `forwardRef` en todo componente que pinte un elemento nativo; las props nativas pasan intactas.
- Las reglas del sistema son ley: 40 px de alto mínimo (44 con puntero táctil), foco con anillo de 2 px de `color-accent-ink` separado del borde, `color-accent` nunca en texto, y estados que se leen en palabras y no solo por color.
- Radix entra solo para los primitivos con comportamiento difícil (Dialog, Popover, Tooltip, Select), un paquete por primitivo, cuando se construya el primero.

## Publicación (GitHub Packages)

1. Crea el repo `caravenas/pliego-ui` en GitHub y haz push.
2. Autentícate con un token clásico con `write:packages`: `npm login --scope=@caravenas --registry=https://npm.pkg.github.com`.
3. `npm run changeset`, luego `npx changeset version` y después `npm run release`.

En la app consumidora basta con añadir `@caravenas:registry=https://npm.pkg.github.com` a su `.npmrc`.

## Estado

| Capa | Componentes |
| --- | --- |
| Primitivos | Button, Badge / OriginBadge, Input |
| Siguiente | Field y Select (L-2), SegmentedControl, y los patrones: OptionCard, MeasureField, SpecStep, ResultList, Notice |
| Después | Drawer del catálogo y Toast (con Radix) |
