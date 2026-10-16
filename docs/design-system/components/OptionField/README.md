Un grupo de opciones dibujadas a escala: cada tarjeta (`OptionCard`) lleva el dibujo de lo que elige —la silueta de la página en su proporción, el pliego con su pinza— y su nombre.

`OptionField` es un `Field` de grupo. Las columnas las pone el campo con `--option-columns`, porque lo que entra en una fila depende de lo ancho que sea el dibujo. Con `layout="scale"` las opciones son una sola magnitud a distintos tamaños: marcas apoyadas en un eje común, que es lo que hace comparables sus alturas.

El dibujo se pinta en `currentColor`, así que sigue a la tarjeta cuando se rellena de tinta al elegirla, y va con `aria-hidden`. La elegida se rellena de tinta con el texto en `color-bg-primary`. **El realce de puntero no se aplica a la elegida.** La deshabilitada baja su borde a `color-border`, su texto a `color-text-muted` y escribe su razón en la propia tarjeta (`disabledReason`). Cada tarjeta es un botón con `aria-pressed`.

**El consumidor aporta** las opciones con su dibujo, cuál está elegida, cuáles están deshabilitadas y por qué, y el número de columnas. `pui-option-shape` y `pui-option-mark` son dos clases de ayuda para dibujos sencillos.
