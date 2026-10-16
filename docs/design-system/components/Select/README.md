El desplegable nativo en cápsula: sigue siendo un `<select>`, así que el teclado, los lectores de pantalla y el selector del sistema en un móvil vienen de serie.

Dibuja su propio triángulo con un SVG en `background-image` y reserva 36 px a la derecha para que el texto no lo pise. El triángulo va en `color-text-muted` (5.15:1 sobre el papel), porque una flecha de control necesita 3:1. El foco es solo el anillo de 2 px de `color-accent-ink`: el fondo no cambia.

No se reimplementa un listbox. Si algún día hace falta uno con búsqueda, va con Radix y en otro componente.

**El consumidor aporta** las opciones, el valor y la etiqueta (con `Field` o con `aria-label`).
