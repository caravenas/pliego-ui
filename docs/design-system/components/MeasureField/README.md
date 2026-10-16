Una medida escrita sobre su filete, como se acota en un plano: la cifra en monoespaciada de 24 px, la unidad pequeña al lado y una línea de tinta debajo.

Es el único control de entrada que **no** va en cápsula: no es un campo de formulario, es una cota. El filete se dibuja discontinuo cuando la medida es un sangrado (`dashed`), porque ahí cae el corte y no termina el papel.

Hay tres formas de cambiar el valor, a propósito. **Escribir** fija una medida que ya se sabe y no se redondea mientras se escribe. **Las flechas** ajustan una que se está decidiendo: un paso, diez con Mayús. **Arrastrar la unidad** sirve para buscarla, porque es la única que redibuja de forma continua; usa captura de puntero, así que el arrastre sobrevive a que el puntero salga del tirador. Todo paso se redondea a los decimales de `step` y nunca baja de `min`.

El foco es un anillo de **tinta** con 3 px de separación, no el de acento: el control ya está sobre una línea de tinta. La nota al margen baja bajo la cifra. Tres medidas en fila entran en `MeasureGrid`.

**El consumidor aporta** la etiqueta, el valor (`''` si no es finito), la unidad, el paso y el manejador de cambio.
