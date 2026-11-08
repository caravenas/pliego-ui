---
'@caravenas/pliego-ui': minor
---

Add `BarChart`: grouped bars for several series in plain SVG, with a text legend, an ink fill pattern per series (solid, stripes, dots, cross) so no series depends on colour, and a visible table with every value. `MovementsTable` can now sort by date, concept or amount (`sortable`) and filter by concept or date (`filterable`); both are off by default, so existing tables render exactly as before. Unknown values always sort last, ties keep their original order, and the order and the number of visible rows are announced through a status region.
