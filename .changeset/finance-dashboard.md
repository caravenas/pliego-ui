---
'@caravenas/pliego-ui': minor
---

Add the pieces to compose a finance dashboard. `usePanelData(key, load)` loads one panel per key (the period), derives `loading` in the very render the key changes, discards late responses from an older key and keeps the previous data with the key it belongs to. `DashboardStatus` announces once for the whole screen (loading, and errors grouped in one alert) so several panels do not speak at once. `DashboardGrid` and `DashboardCell` lay panels out in 3, 2 or 1 columns with the DOM order equal to the visual order. `DataPanel` gains `announce`, on by default, so a panel inside a dashboard can stay silent; nothing changes unless it is turned off.
