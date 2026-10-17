# @caravenas/pliego-ui

## 0.1.1

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
