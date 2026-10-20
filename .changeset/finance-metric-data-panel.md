---
'@caravenas/pliego-ui': minor
---

Add `Metric` and `DataPanel` for finance dashboards, and the `metric-value` text style. `Metric` writes how much a figure changed in words, never dividing by zero; `DataPanel` says in words whether it is loading, failed or showing older data, announces it through a status region and keeps focus on retry. `SegmentedControl` now renders nothing without options and keeps the first of repeated values. Credits are now blue instead of green (`color-success-foreground` is `#1d4ed8`).
