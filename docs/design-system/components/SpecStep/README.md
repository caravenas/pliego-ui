Un paso de la ficha técnica: un `<details>` numerado que cerrado dice su respuesta en una línea y abierto muestra sus controles.

El resumen es una fila que se envuelve: número, título y, en una línea propia por debajo, el valor. Un paso abierto se guarda su valor, porque los campos de abajo dicen lo mismo. El cuerpo y el valor van sangrados `space-7` para alinearse bajo el título, pasada la columna del número.

El componente lleva el estado de apertura: `open` controla de verdad y `defaultOpen` lo deja sin controlar. «···» es la llamada al catálogo del paso, en el margen derecho de su título, con 40 px de área aunque el glifo sea pequeño; no está dentro del `<summary>`, porque un control dentro de otro no se anuncia de forma fiable, y su clic no pliega el paso.

**El consumidor aporta** el número, el título, el resumen ya formateado —en `mono-note`, del estilo `140 × 210 · 2:3`— y los controles del cuerpo. Que solo haya un paso abierto a la vez es una decisión del contenedor.
