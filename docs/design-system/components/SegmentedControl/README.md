El selector segmentado: un rectángulo recortado de posiciones que comparten costura, con dos semánticas que se dibujan igual.

- **`kind="tabs"`** cambia lo que se mira: es un `tablist` y la selección acompaña al foco.
- **`kind="options"`** cambia un valor (formato, proporción): es un `radiogroup`.

Las dos tienen un solo punto de tabulación, flechas izquierda y derecha con vuelta, Inicio y Fin, y saltan los segmentos deshabilitados. `tabs` no pinta los paneles: los pinta el consumidor, y `id` da a cada segmento el suyo (`${id}-${valor}`) para enlazarlos.

El grupo lleva el borde de tinta y cada posición comparte su costura con la siguiente: la última no tiene `border-right`, porque el borde del grupo ya la dibuja. La posición activa se rellena de tinta con el texto en `color-bg-primary`; la apuntada que no está activa se aclara a `color-bg-card-hover`, y **nunca** la activa. Cada posición mide 40 px de alto como mínimo.

**El consumidor aporta** las etiquetas en minúsculas (las versalitas y el espaciado de 0.16 em los pone `central-tab`), cuál está activa y el manejador de cambio.
