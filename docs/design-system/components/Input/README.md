El campo en cápsula, la firma visual de PliegoStack: borde de tinta, fondo transparente y `border-radius: 9999px`.

Todo control de entrada —campo de texto o numérico, desplegable, segmento— va en cápsula completa, no con un radio de la escala. Mide 40 px de alto como mínimo (44 con puntero grueso). El foco de teclado es un anillo de 2 px de `color-accent-ink` con 2 px de separación, solo con `:focus-visible`, y no cambia el fondo. Un campo deshabilitado baja su borde a `color-border` y su texto a `color-text-muted`.

No trae etiqueta: la pone `Field` o el consumidor, unida con `id` o con `aria-label`.

**El consumidor aporta** el valor y la etiqueta; el resto son las props nativas de `<input>`, con `type="text"` por defecto.
