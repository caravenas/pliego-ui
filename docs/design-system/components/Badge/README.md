El distintivo: un texto corto que dice de dónde viene un dato o en qué estado está, y que nunca depende solo del color.

`Badge` tiene dos variantes: `outline`, una cápsula con filete (el «datos de ejemplo» de la cabecera), y `mono`, texto en monoespaciada sin caja (la ruta de un archivo). `OriginBadge` es el distintivo de origen de una entrada de catálogo: `origin` vale `factory`, `edited` o `own` y escribe «de fábrica», «editado» o «tuyo». Esas palabras salen de `ORIGIN_LABELS`.

El origen se lee como texto, nunca solo por color ni por un símbolo. Cuando la entrada es del usuario, la nota de origen se sustituye por el distintivo; nunca conviven las dos.

**El consumidor aporta** el texto del distintivo, o el origen.
