PliegoStack es una herramienta de ingeniería editorial para imprentas y editoriales de libros álbum: calcula aprovechamiento del pliego, lomo, peso e imposición por firmas. Su interfaz se lee como un plano de taller, no como un panel de control. Todo lo que sigue es obligatorio salvo donde diga lo contrario.

## Fundamentos de contenido

Escribe en español, en tercera persona y sin dirigirte al usuario. La interfaz nombra objetos de imprenta, no acciones genéricas: «Lomo estimado», «Pliegos de prensa por ejemplar», «Hojas de papel (interior)».

Nombra cada objeto una sola vez y siempre igual. «Pliego» designa dos cosas distintas en este oficio —el pliego de prensa y el pliego plegado de 4 páginas—, así que cada cifra que dependa de uno de ellos dice cuál: «pliego de prensa» en Imposición, «grupo de 4 páginas ya plegado» en el corrimiento.

Cuando un cálculo no se puede hacer, explica qué regla falla —el múltiplo, el rango de páginas del método, el esquema que no cabe en el pliego— en vez de mostrar un mensaje genérico o una cifra mal. Un panel sin solución dice por qué y ofrece el control que la desbloquea.

Las etiquetas en versalitas se consiguen con `text-transform: uppercase` en el estilo `form-label`, nunca escribiendo el texto en mayúsculas en el JSX: el nombre accesible viaja tal cual y algunos lectores de pantalla lo deletrean.

El origen de un dato se escribe en dos líneas cortas: la ruta del archivo en `mono-note` y el texto de origen debajo. No lleva el prefijo «Fuente:» —la posición ya lo dice— y no se acorta ni se oculta. Cuando la entrada es del usuario, la nota se sustituye por el distintivo de origen; nunca conviven los dos.

Sin emoji. Sin signos de exclamación. Sin texto de relleno.

## Fundamentos visuales

**Color.** El fondo es papel: `color-bg-primary` para la página, `color-bg-secondary` para las superficies asentadas. La tinta es `color-text-primary`, y es también el color de todo borde de control y el relleno de todo estado elegido. El cian `color-accent` rellena los dibujos —pliegos, páginas, lomos— y nada más: sobre papel llega a 2.59:1, así que cualquier cosa que haya que leer usa `color-accent-ink`, que llega a 6.43:1. Reserva `color-danger-foreground` para el error que impide un cálculo, y acompáñalo siempre de palabras.

**Tipografía.** `heading` (Outfit) para el nombre de la herramienta y los títulos de paso; `body` (Inter) para etiquetas, texto y controles; `mono` (JetBrains Mono) para toda medida, cifra, resumen y ruta de archivo. La regla es simple: si es un número que el usuario va a comparar, va en `mono`. Las listas de cifras llevan además `font-variant-numeric: tabular-nums`.

**Espaciado y radios.** La escala es de 4 px, de `space-1` a `space-16`. Los radios de la escala (`radius-md`, `radius-lg`) son para tarjetas y contenedores de dibujo; **todo control de entrada va en cápsula completa** —campo, desplegable, segmento, ficha de gramaje, botón de opciones—, que es la firma visual de la app.

**Separación.** Este sistema separa con filetes, no con sombras. `color-border` para el filete que divide pasos y paneles; punteado para la fila de resultado, como el guión que lleva de un nombre a su cifra en una ficha técnica; discontinuo para todo lo que marque un sangrado, porque ahí cae el corte y no termina el papel.

**Estados.** El elegido se rellena de tinta y su texto pasa a `color-bg-primary`; el apuntado se aclara a `color-bg-card-hover` y **solo si no está elegido** —aplicado al elegido lo repinta de blanco y desaparece bajo el puntero—. El deshabilitado baja su borde a `color-border` y su texto a `color-text-muted`. El foco de teclado es un anillo de 2 px de `color-accent-ink` con 2 px de separación, sobre `:focus-visible`, separado del borde para que se lea como señal propia.

**Área táctil.** Ningún control mide menos de 40 px de alto en escritorio ni de 44 px en móvil. Cuando el dibujo del botón es más pequeño que eso, se agranda el área con un pseudo-elemento invisible, sesgado hacia el lado libre para no invadir al vecino.

**Movimiento.** Cinco curvas, declaradas en la hoja de estilos. `--transition-fast` es para el fondo de una tarjeta al apuntarla; `--transition-normal`, para la entrada y la salida de un aviso (`Toast`); `--transition-drawer-in` y `--transition-drawer-out`, para el panel lateral (`Drawer`), que entra con un fundido y sale opaco para descubrir la vista que tapaba. `--transition-slow` está declarada y sin uso. Con `prefers-reduced-motion` nada se desplaza ni se funde. Nada más se anima.

## Disposición

Una sola pantalla, no un documento. A partir de 1024 px: ficha técnica de 404 px a la izquierda, con los cinco pasos numerados en acordeón; el resto del ancho para la vista central, que muestra los dibujos, los resultados o el catálogo según el conmutador de la cabecera. La página no se desplaza; se desplaza cada columna.

El ancho de 404 px está medido, no elegido: es lo que pide el título más largo de los cinco pasos, «Páginas y encuadernación». Un paso cerrado muestra su resumen en `mono-note` —`140 × 210 · 2:3`— para que la ficha entera se lea sin abrir nada.

Por debajo de 1024 px todo pasa a una columna, con una barra de resultados pegajosa arriba. Todo contenedor usa `minmax(0, 1fr)` y ancho relativo; nada mide en píxeles fijos por debajo del punto de quiebre.

## Accesibilidad

Todo control lleva etiqueta programática. Los avisos no urgentes usan el rol de estado; el error que bloquea un cálculo usa el rol de alerta. Al cambiar de vista, el foco se mueve al encabezado de la vista nueva, y el orden de tabulación sigue el orden visual.

Un distintivo de origen se lee como texto —«de fábrica», «editado», «tuyo»—, nunca solo por color ni por un símbolo.

## Iconografía

No hay sistema de iconos. Lo que en otra app sería un icono, aquí es un dibujo a escala del objeto: la silueta de la página en su proporción, el pliego con su pinza, el lomo con su cartón. Los dibujos se hacen en SVG dentro del componente, pintados con `currentColor` para que sigan a la tarjeta cuando se rellena de tinta, y con `color-accent` cuando son el relleno de un diagrama grande.

Cuando algo tenga que ser un icono de verdad, dibújalo en la misma clave: trazo de 1.5 px, geometría de la escala de espaciado, sin relleno.

## Marca

El logotipo es un pliego de tres capas en isométrica, con las dos inferiores en tinta al 40 % y al 80 % y la superior en `color-accent`, cortada por una cruz enmascarada que marca el registro. Sus tintas están fijadas en el propio archivo: no hereda el color del contenedor, así que no lo pongas sobre un fondo oscuro sin pedir una versión nueva.

El nombre se escribe «PliegoStack», en una palabra y con la S interior en mayúscula, y en la cabecera va en versalitas con el estilo `app-logo`.

## No sincronizado

Este sistema se produce desde la librería `@caravenas/pliego-ui` (repositorio `caravenas/pliego-ui`, `npm run ds:build`), no desde la app.

- **Fuentes.** Inter, Outfit y JetBrains Mono se cargan desde Google Fonts (`fonts.css` del paquete y el `<link>` de Storybook); no hay archivos de fuente en el repositorio, así que `type.fonts` va vacío y las familias se nombran en `type.families`.
- **Movimiento.** Las duraciones y curvas no caben en el formato de tokens: viven en `tokens/motion.json` de la librería y llegan al artifact dentro de `components/bundle.css`, junto a la hoja de la librería.
- **Componentes.** Catorce tarjetas con `components/bundle.js`: `Button`, `Badge`, `Input`, `Select`, `Field`, `SegmentedControl`, `OptionField`, `MeasureField`, `SpecStep`, `ResultList`, `HowPanel`, `Notice`, `Drawer` y `Toast`, vivos. `AppHeader`, `CatalogBoard`, `CatalogPanel` y `Panel` son vistas de PliegoStack que la librería no tiene: siguen como previews estáticos con la hoja de estilos de la app, que `components/bundle.css` conserva detrás de la de la librería, y la cubierta es la de siempre.
