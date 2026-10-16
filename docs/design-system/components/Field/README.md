El campo de formulario: una etiqueta, a veces una nota al margen, el control, y debajo el error y la nota de origen.

`Field` une la etiqueta al control por `id` clonando su único hijo, al que le añade `id`, `aria-describedby` y, si hay error, `aria-invalid`. Con `group` el control es un grupo: la etiqueta pasa a ser un `<span>` y el grupo lleva `aria-labelledby`. De `id` salen `${id}-label`, `${id}-error` y `${id}-note`. Si `children` no es un único elemento, no inyecta nada y el consumidor usa esos ids.

La etiqueta va en `form-label`: 12 px, peso 500, versalitas por `text-transform`. **Escribe el texto en minúsculas**: el nombre accesible viaja tal cual y algunos lectores de pantalla deletrean las mayúsculas.

La nota al margen (`marginalia`) dice de dónde sale el valor o qué otro control lo decide. Va en cursiva y en `color-text-muted`, empujada al margen derecho con `margin-left: auto`; con `null` no queda ningún nodo.

El error (`error`) se anuncia con `role="alert"` y se lee por sus palabras: el rojo y el filete lo refuerzan, no lo sustituyen. Dice qué regla falla, no un mensaje genérico. La nota de origen (`note`) va en dos líneas cortas: el archivo en monoespaciada y el texto de origen debajo, **sin** el prefijo «Fuente:».

**El consumidor aporta** la etiqueta, el `id`, el control, la marginalia, el texto del error y la nota.
