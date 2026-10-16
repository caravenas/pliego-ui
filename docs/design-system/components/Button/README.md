El botón: cuatro variantes y dos formas, con 40 px de alto mínimo (44 con puntero grueso).

- **`primary`** — relleno de tinta, con el texto en `color-bg-primary`. La acción que cierra un formulario: «guardar cambios».
- **`secondary`** — papel con filete. La alternativa: «cancelar». Es la variante por defecto.
- **`outline`** — borde de tinta sobre transparente, el lenguaje de los controles de la app.
- **`danger`** — solo texto en `color-danger-foreground`. Eliminar, volver a fábrica.

La forma `round` es un círculo de 40 px con el signo en monoespaciada, para + y −. Todas las variantes llevan un borde de 1 px, transparente donde no se ve, para que midan lo mismo. El realce de puntero solo va en `secondary` y `outline`, y nunca en un botón deshabilitado.

Por defecto es `type="button"`: dentro de un formulario no lo envía salvo que se pida.

**El consumidor aporta** el texto en minúsculas y la variante; el resto son las props nativas de `<button>`.
