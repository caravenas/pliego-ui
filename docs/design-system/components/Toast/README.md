Un aviso descartable que no interrumpe lo que se está haciendo.

Una nota informa, se anuncia con calma y se va sola a los 5 segundos; un error dice qué falla, se anuncia al momento y **no se va solo**: un mensaje que desaparece a los 5 segundos no lo lee quien tarda más, y es justo el que hay que leer. `duration` lo cambia. Se descarta con el botón o con el dedo, y la acción opcional (`action`) lleva a lo que lo resuelve.

Tiene el mismo tratamiento visual que `Notice` —borde de tinta, y el del error derivado de `color-danger-foreground`— y ninguna sombra: este sistema separa con filetes. Los avisos se apilan en una región con nombre en la esquina inferior derecha, que `ToastProvider` lleva una sola vez cerca de la raíz.

**El consumidor aporta** el texto, el título opcional y el estado de apertura (`open` o `defaultOpen`); no hay una API imperativa. Va sobre Radix Toast.
