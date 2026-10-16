El aviso, en cuatro tonos y con el rol de lectura de pantalla que le corresponde: lo que informa se anuncia con calma y lo que impide o corrige, al momento.

- **`note`** — la salvedad de un cálculo, en `color-text-secondary` (`role="status"`).
- **`preview`** — lo que un dibujo no está mostrando (`role="status"`).
- **`error`** — la entrada que impide calcular: texto en `color-danger-foreground`, borde derivado de ese mismo color y radio `radius-md` (`role="alert"`). **Dice qué regla falla** —el múltiplo, el rango de páginas del método—, no un mensaje genérico.
- **`config`** — el error de una configuración que impide montar la app; es la pantalla entera, con el archivo, la ruta del campo y el motivo (`role="alert"`).

El color nunca va solo: el error se entiende leyéndolo. El título opcional no es un encabezado.

**El consumidor aporta** el texto y, si hace falta, el título. No pongas un botón aquí salvo que resuelva el aviso y lleve al paso que lo desbloquea.
