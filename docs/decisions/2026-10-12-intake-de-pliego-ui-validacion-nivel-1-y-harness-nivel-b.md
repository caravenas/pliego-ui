---
type: "decision"
date: 2026-10-12
status: "accepted"
reversibility: "easy"
confidence: "medium"
curated: false
---

# Decision: Intake de pliego-ui: validacion nivel 1 y harness nivel B

## Decision

Validacion nivel 1 (escritorio): fuentes publicas y una propuesta corta con cada afirmacion marcada como verificada, inferida o desconocida.
Harness nivel B (con contexto): AGENTS.md, un solo plan, un contrato de verificacion y la entrada estandar de tareas (brief con criterios de aceptacion).
Sin carriles ni politica de rutas todavia.

## Rationale

pliego-ui es un proyecto independiente de PliegoStack, no una parte de el.
Se tomo el sistema de diseno de PliegoStack como punto de partida para crear una libreria de componentes que sirva en cualquier proyecto (Chris, 2026-10-12).
PliegoStack es su origen, y uno de sus posibles consumidores, no su definicion.

Respuestas de la hoja:

1. Para que sirve: una libreria de componentes reutilizable, derivada del sistema de diseno de PliegoStack.
2. Quien depende de ella: hoy solo Chris, pero esta pensada para cualquier proyecto, asi que otros podrian usarla.
3. Que cuesta un error: es reversible, sin remoto y sin publicar. Cambia al publicar la 0.1.0, porque ahi aparecen consumidores y versiones.
4. Que depende de fuera del repositorio: el sistema de diseno de origen (el Design System de claude.ai y el codigo de PliegoStack, de donde se copian valores exactos) y siete decisiones abiertas del plan.
5. Tamano: semanas, catorce incrementos planeados.
6. Paralelismo: los componentes viven en directorios separados y podrian ir en paralelo, pero nadie lo necesita todavia.

El nivel 1 sale de dos incognitas, la pregunta 2 (otros podrian usarla) y la 4 (hay origenes sin verificar), y el playbook project-intake obliga a tomar al menos ese nivel cuando una de ellas es desconocida.
Chris acepto la propuesta el 2026-10-12; la propuesta decia nivel 0 o 1 y el playbook lo resuelve en 1.
Es el primer uso de project-intake: se llena con el proyecto ya scaffolded (3 commits), no antes del primer commit.

Correccion: la primera version de este registro describia la libreria como "la fuente de verdad de los componentes de PliegoStack, que la consumira".
Esa frase venia del AGENTS.md y del plan de pliego-ui, y Chris la corrigio el mismo dia: el proyecto es independiente.

## Alternatives considered

- Validacion nivel 0: descartado porque las preguntas 2 y 4 tienen incognitas y el playbook las trata como lo primero que hay que averiguar.
- Validacion nivel 2 (conversaciones): descartado por ahora. Seria el nivel si otros equipos o personas empezaran a depender de la libreria; es uno de los disparadores de abajo.
- Harness nivel A (solo AGENTS.md y contrato): descartado porque ya hay un plan de 14 incrementos y una especificacion por componente, que son el nivel B.
- Harness nivel C (carriles): descartado por ahora, por lo dicho en la pregunta 6.

## Evidence

- VERIFICADO: typecheck 4,3 s y 21 tests en 4,2 s pasan en este Mac con Node 22.22.2 (igual a .nvmrc); el arbol queda limpio.
- VERIFICADO: los origenes citados existen en book-engineering-tool (commit ac0c52b): OptionGroup.tsx y los selectores form-group, field-marginalia, calculation-error, central-tabs y option-card-notch.
- VERIFICADO: el Design System de claude.ai (artifact 81WGnnxqtHUGnc6yK9DAHe) existe, es de Chris y tiene 42 archivos; su brand book y sus notas por token no se leyeron.
- VERIFICADO: L-0 esta a medias. Las dependencias estan instaladas y la suite pasa, pero siguen 6 archivos stale-* y 61 tmp_obj en .git (git fsck sale limpio).
- VERIFICADO, RESUELTO: el plan y el AGENTS.md de pliego-ui decian que los documentos de diseno de PliegoStack (docs/UI-REDESIGN.md y docs/UX-REVIEW.md) mandan sobre el estilo y que PliegoStack consume la libreria.
  Para un proyecto independiente eso es procedencia, no autoridad, y esos dos archivos ya no estan en esa ruta: PliegoStack los movio a docs/legacy/ el 2026-10-02 (commit 92bfda7).
  Chris resolvio el 2026-10-12 que manda el COMPONENTS.md de la libreria y, sobre todo, el Design System de claude.ai.
  Los documentos de PliegoStack quedan como procedencia.
- DESCONOCIDO: si el Design System se puede re-sincronizar desde la libreria (L-13); si GitHub Packages publica bien (no hay remoto aun, asumido).
- DESCONOCIDO: si PliegoStack adoptara la libreria (L-12) y cuanto de ella reemplaza; es un consumidor posible, y su migracion no define el exito de la libreria.
- DESCONOCIDO: las siete decisiones abiertas del plan. La 1 (radiogroup o aria-pressed) bloquea L-3 y L-4; la 3 (boton en capsula o radius-md) afecta a Button ya hecho.

## Follow-ups

- Disparador para decidir otra vez: una decision abierta que bloquee un incremento; se construye algo que solo tiene sentido si alguien lo va a pagar; pasan dos semanas sin algo que una persona ajena pueda usar o juzgar; en las ultimas diez sesiones el trabajo de coordinacion supera al de producto; otro proyecto o persona empieza a depender de la libreria (sube a validacion 2); se publica la 0.1.0.
- Piloto de entrada estandar de tareas: empezar por L-2 (Field y Select), que no depende de ninguna decision abierta. L-3 y L-4 esperan la decision 1. L-3 se hace sin brief como contraste solo si esa decision se toma antes.
- Contrato de verificacion propuesto, por escribir Chris: fast con npm run typecheck; full con typecheck, test y build. El tiempo de build y de build-storybook no se midio.
- Autoridad de estilo decidida (COMPONENTS.md y, sobre todo, el Design System de claude.ai): falta actualizar la redaccion del AGENTS.md y del plan, que aun nombran los documentos de PliegoStack como los que mandan y dicen que PliegoStack consume la libreria (Chris: son archivos del proyecto).
- El Design System tiene dos puntos que se contradicen o quedan sin cubrir para L-2: el fondo de los campos (transparente segun su README, blanco segun color-bg-input) y el fondo al enfocar. Estan como preguntas abiertas en el brief de L-2.
