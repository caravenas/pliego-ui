---
'@caravenas/pliego-ui': patch
---

`MovementsTable` sorting now puts a date-time that is not valid ISO (such as `2026-10-01T25:00`) at the end, like any other invalid date, instead of sorting it as the day it starts with. `BarChart` no longer says only "sin datos para graficar" when the series it does not draw (past the fourth) have values: it also says how many series are shown, and the table keeps them all.
