Un panel lateral que entra por el borde derecho sobre lo que se está mirando, sin taparlo ni bloquearlo.

**No es modal**: no atrapa el foco, no inerta el resto de la página y un clic fuera no lo cierra. La lámina de cristal sobre toda la herramienta tapaba la vista desde la que se había pulsado «editar»; el panel es la otra mitad de esa vista. Lo que un modal daba gratis y un panel necesita que se le diga, lo hace el componente: Escape lo cierra, el foco entra en el panel (no en el botón de cerrar) y vuelve a donde estaba al cerrar.

Entra con un fundido y sale opaco, porque debajo ya hay una vista y un panel que se desvaneciera mostraría las dos encima. Con `prefers-reduced-motion` simplemente cambia de sitio. El botón de cerrar mide 40 px (44 con puntero grueso).

**El consumidor aporta** el título, el contenido y el estado de apertura (`open` o `defaultOpen`). Va sobre Radix Dialog.
