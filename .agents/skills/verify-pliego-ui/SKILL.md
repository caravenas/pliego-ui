---
name: verify-pliego-ui
description: Verify in a real browser the Storybook stories a pliego-ui change touches, and leave evidence a person can open (screenshots at 375, 768 and 1024 px, keyboard walk, accessible state, axe and pointer-target results). Use after changing a component, token or style in this repository, before opening a PR, or when asked to show that a UI change works.
---

# Verificar un cambio de pliego-ui

Esta skill maneja el Storybook compilado del repositorio con un navegador real y deja la evidencia en `.verification/<sha>/`.
Es la etapa A de `~/.agents/plans/plan-pr-autonomos.md`; su brief es L-19 en `docs/PLAN.md`.

## Comando

Desde la raíz del repositorio:

```
npx tsx .agents/skills/verify-pliego-ui/verify.ts
```

Elige las stories que el diff toca: lo commiteado contra `origin/main` (`--base <ref>` cambia la base), lo modificado y lo nuevo.
Otras formas de elegir:

- `--feature "Tabla de movimientos"`: una funcionalidad del mapa (`features.ts`), sin mirar el diff.
- `--stories id,id`: ids exactos de stories.
- `--no-build`: no reconstruye Storybook y usa el que haya. Es para pruebas de la propia skill; para evidencia de un cambio, no.

Termina con 0 solo si todo lo elegido se abrió sin la pantalla de error de Storybook y pasaron axe y las áreas de puntero.
Con 1 hay fallos (están en `report.json`); con 2 la skill no pudo empezar (puerto ocupado, Storybook sin compilar) y no deja informe.

## Qué hace, en orden

1. Comprueba que el puerto 6007 está libre. Si no, se detiene y lo nombra: la skill lanza su propio servidor ahí.
2. Reconstruye Storybook (`npm run build-storybook`), siempre, para no dar evidencia de un `storybook-static` viejo.
3. Lanza `scripts/serve-static.mjs` y espera a que `/index.json` responda.
4. Elige las stories. Un cambio en `src/components/<X>/` elige las de la carpeta `<X>`. Un cambio en `tokens/`, `src/styles/`, `src/hooks/`, `src/utils/`, `src/test/`, `.storybook/` o `e2e/stories.ts` elige todas, y el informe dice por qué. Un archivo sin story se anota como tal.
5. Por cada story: la abre con `openStory` (una story rota falla nombrando su id), la captura a 375, 768 y 1024 px, recorre el foco con Tab y guarda el estado accesible.
6. Corre `e2e/a11y.spec.ts` y `e2e/touch-targets.spec.ts` filtrados a esas stories y guarda su JSON.
7. Para el servidor y escribe `report.json`.

## La evidencia

Todo en `.verification/<sha-corto>/` (con `-dirty` si hay cambios sin commitear). La carpeta está en `.gitignore` y sobrevive a la limpieza.

- `report.json`: SHA, base, stories elegidas y por qué, fallos, avisos y el resumen de los specs. `status` es `ok` o `failed`.
- `<id-de-story>/375.png`, `768.png`, `1024.png`.
- `<id-de-story>/keyboard.json`: cada parada del foco (etiqueta, rol, nombre aproximado, si el anillo se ve), si hubo trampa de foco, y las teclas propias de la funcionalidad con dónde queda el foco.
- `<id-de-story>/aria.yml`: el árbol accesible de la página (`ariaSnapshot`).
- `specs.json`: el resultado de axe y de las áreas de puntero.

El informe se ordena por SHA para que la etapa B del plan pueda exigir la evidencia del mismo commit que se revisa.

## Lo que la evidencia no demuestra

- **No compara con una referencia.** Las capturas son para mirarlas. La comparación contra las 96 referencias es `npm run test:visual`, y esta skill no la sustituye.
- **Los anchos son otros.** `test:visual` mide a 640 px; esta skill, a 375, 768 y 1024.
- **El nombre accesible del recorrido con teclado es una aproximación** (`aria-label`, etiqueta, texto). El estado exacto está en `aria.yml`.
- **El cruce es por carpeta.** Un componente que otra story compone (Metric dentro de Dashboard) no elige esa otra story. Si cambia un componente compartido, usa `--feature` para la que lo compone o `--stories`.
- **No prueba flujos.** Recorre el foco y unas teclas por funcionalidad; no rellena formularios ni sigue un caso de uso.
- **Solo Chromium, solo esta máquina.**

## Mantener el mapa

`features.ts` agrupa los títulos de las stories en funcionalidades y dice qué teclas recorrer.
`features.test.ts` falla si una story nueva no está en el mapa o si el mapa nombra una que no existe: al añadir una story, añádela ahí.
