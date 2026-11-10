# @caravenas/pliego-ui

## 0.2.1

### Patch Changes

- 4e10477: `MovementsTable` sorting now puts a date-time that is not valid ISO (such as `2026-10-01T25:00`) at the end, like any other invalid date, instead of sorting it as the day it starts with. `BarChart` no longer says only "sin datos para graficar" when the series it does not draw (past the fourth) have values: it also says how many series are shown, and the table keeps them all.

## 0.2.0

### Minor Changes

- ed22521: Credits in `Amount` and `MovementsTable` are now cyan (`color-success-foreground`, the same cyan as `color-accent-ink`) and debits are magenta, through a new token `color-debit-foreground`. The red of `color-danger-foreground` stays for errors. A credit or debit still carries its sign and its word, never only colour.
- 6e5f41a: Add `Amount`, `MovementsTable` and `TrendChart` for finance dashboards, and the `color-success-foreground` token. Amounts are formatted with `Intl` from a currency code and an optional locale, unknown values read "sin dato", and the chart ships its values as a visible table.
- ed22521: Add `BarChart`: grouped bars for several series in plain SVG, with a text legend, an ink fill pattern per series (solid, stripes, dots, cross) so no series depends on colour, and a visible table with every value. `MovementsTable` can now sort by date, concept or amount (`sortable`) and filter by concept or date (`filterable`); both are off by default, so existing tables render exactly as before. Unknown values always sort last, ties keep their original order, and the order and the number of visible rows are announced through a status region.
- ed22521: Add the pieces to compose a finance dashboard. `usePanelData(key, load)` loads one panel per key (the period), derives `loading` in the very render the key changes, discards late responses from an older key and keeps the previous data with the key it belongs to. `DashboardStatus` announces once for the whole screen (loading, and errors grouped in one alert) so several panels do not speak at once. `DashboardGrid` and `DashboardCell` lay panels out in 3, 2 or 1 columns with the DOM order equal to the visual order. `DataPanel` gains `announce`, on by default, so a panel inside a dashboard can stay silent; nothing changes unless it is turned off.
- ed22521: Add `Metric` and `DataPanel` for finance dashboards, and the `metric-value` text style. `Metric` writes how much a figure changed in words, never dividing by zero; `DataPanel` says in words whether it is loading, failed or showing older data, announces it through a status region and keeps focus on retry. `SegmentedControl` now renders nothing without options and keeps the first of repeated values. Credits are now blue instead of green (`color-success-foreground` is `#1d4ed8`).

### Patch Changes

- f8832d5: `OptionCard` now measures at least 40px tall with a fine pointer, scale notches included. Before, only the coarse-pointer rule (44px) held it.
- 873d704: `SegmentedControl` with `kind="options"` now also answers to the up and down arrow keys, like a native radio group. `kind="tabs"` keeps left and right only.

## 0.1.0

### Minor Changes

- 1cd4e28: Add `Drawer`: a non-modal side panel on Radix Dialog, with Escape, focus in and back out, and motion from new `transition-drawer-in` and `transition-drawer-out` tokens. Adds `@radix-ui/react-dialog` as a dependency.
- 3593248: Add `Field` (label, margin note, error and origin note, wired to the control by id) and `Select` (native capsule dropdown).
- 33c4f20: Add `MeasureField` and `MeasureGrid`: a measurement written as a figure on a line, changed by typing, by the arrow keys (ten steps with Shift) or by dragging its unit.
- 20c813e: Add `Notice`: a note, preview, error or configuration-error message with the screen-reader role that matches its variant.
- d8f150f: Add `OptionField` and `OptionCard`: a labelled group of options drawn to scale, as a grid of cards or a scale of notches, built on `Field`.
- 6b4732f: Add `ResultList`, `ResultRow` and `HowPanel`: a description list of figures with their units, and the panel that says what they are made of.
- 51eb4a1: Add `SegmentedControl`: a segmented selector with `tablist` semantics (`kind="tabs"`) or `radiogroup` semantics (`kind="options"`), one tab stop, arrow keys, Home and End.
- e360afd: Add `SpecStep`: a numbered spec-sheet step on `<details>`, with its closed-state value, an options mark and controlled or uncontrolled `open`.
- a174be9: Add `Toast` and `ToastProvider`: dismissible notices on Radix Toast. A note leaves by itself; an error stays until it is dismissed. Adds `@radix-ui/react-toast` as a dependency.
