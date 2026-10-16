La columna de cifras: un rótulo a la izquierda, su cifra a la derecha y un punteado entre filas, como el guión que lleva de un nombre a su cifra en una ficha técnica de imprenta.

Es una lista de descripción (`<dl>`): un nombre y un valor, repetidos, de modo que un lector de pantalla se mueve entre ellos como pares. El rótulo va en `stat-label`. La cifra va en `stat-value`: monoespaciada, peso 700, con `font-variant-numeric: tabular-nums` para que los dígitos midan lo mismo y las cifras cuadren en columna. La unidad va dentro de la cifra, en `stat-unit`, más pequeña y en `color-text-muted`.

Los rótulos nombran objetos de imprenta sin ambigüedad: «hojas de papel (interior)», no «hojas»; «pliegos de prensa por ejemplar», no «pliegos por ejemplar».

**El consumidor aporta** los pares de rótulo, cifra y unidad, ya formateados y en el orden en que hay que leerlos: la cifra principal primero.
