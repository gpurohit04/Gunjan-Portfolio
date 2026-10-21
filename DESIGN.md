# Runbook — design system

The portfolio is a system, documented like one. The reference is a well-kept
runbook or design doc: a calm page, a strict grid, small monospaced metadata in
the margin, diagrams that explain rather than decorate. One colour means "live".

## Type

| Role | Face | Why |
| --- | --- | --- |
| Display, headings, body | **Instrument Sans** (variable, 400–700) | A tight grotesk with flat, sharp terminals. Reads engineered without the coldness of Helvetica clones, and is not one of the defaults (Inter, Space Grotesk, Plus Jakarta) that make portfolios look generated. |
| Labels, metadata, metrics, readouts | **IBM Plex Mono** (400, 500) | Designed by a company that builds infrastructure; clear, distinct digits (0/O, 1/l) with tabular figures for numbers that change. |

Both are self-hosted through Fontsource (no third-party request on first paint).

### Scale (fluid, rem at 16px)

| Token | Size | Weight / tracking / leading | Use |
| --- | --- | --- | --- |
| `--t-display` | clamp(2.75rem → 5.5rem) | 600 / −0.035em / 0.95 | Name in the hero, once |
| `--t-h2` | clamp(2rem → 3rem) | 600 / −0.025em / 1.05 | Section titles |
| `--t-h3` | clamp(1.5rem → 2rem) | 600 / −0.015em / 1.15 | Case-study titles |
| `--t-lead` | clamp(1.125rem → 1.3125rem) | 400 / −0.005em / 1.5 | Intro and deks |
| `--t-body` | 1.0625rem | 400 / 0 / 1.6 | Prose, max 66ch |
| `--t-small` | 0.9375rem | 400 / 0 / 1.5 | Captions, secondary prose |
| `--t-label` | 0.75rem mono | 500 / +0.08em uppercase / 1.4 | Margin labels, table heads |
| `--t-data` | 0.875rem mono | 400 / 0 / 1.5 | Stack lists, readouts |
| `--t-metric` | clamp(1.75rem → 2.5rem) mono | 500 / −0.02em / 1 | Result numbers, tabular-nums |

## Colour

Near-neutral warm paper and ink, plus **one** accent. The accent is reserved for
things that are live or actionable: requests in flight, the queue filling, links
and the one primary button. It never appears on headings or as decoration.

| Token | Value | Contrast on paper | Use |
| --- | --- | --- | --- |
| `--paper` | `#F5F4F0` | — | Page background |
| `--paper-2` | `#ECEAE4` | — | Inset surfaces: figures, diagrams |
| `--ink` | `#141414` | 16.7 : 1 | Headings, body |
| `--ink-2` | `#4A4945` | 8.2 : 1 | Secondary prose |
| `--ink-3` | `#6B6963` | 5.0 : 1 (4.6 on paper-2) | Labels, captions |
| `--rule` | `#D9D6CE` | decorative | Hairlines, grid rules |
| `--rule-strong` | `#B9B5AB` | decorative | Diagram strokes, inputs |
| `--signal` | `#B93D0B` | 5.1 : 1 (4.7 on paper-2) | The accent |
| `--signal-tint` | `#F3DED2` | — | Queue fill, focus halo |

Orange because it's the colour of status in ops tooling (degraded, paging,
in-flight) — it carries meaning here instead of being "brand".

## Space & grid

- 4px base. Steps: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 (`--s-1` … `--s-10`).
- Container max 1240px; side gutter clamp(16px, 4vw, 48px).
- 12 columns, 24px gutter. **Margin column** = cols 1–3 (mono metadata);
  **content** = cols 4–12, prose capped at 66ch. Below 900px the margin column
  stacks above its content.
- Sections are separated by a 1px `--rule` and 128px (desktop) / 80px (mobile) of space.
  No cards, no shadows, radius 2px maximum.

## Diagrams

One visual language across all four projects:
- Nodes: 1px `--ink` stroke on `--paper`, 2px radius; name in Instrument Sans 600,
  a mono sub-label for the AWS/vendor service.
- Edges: 1px `--ink-2` orthogonal lines with small solid arrowheads; dashed for
  control/async loops (autoscaling, health checks).
- Groups (AWS account, on-prem): dashed `--rule-strong` boundary, mono label top-left.
- The happy-path edge is drawn in `--signal` — the only colour in the figure.
- Every diagram has a wide (desktop) and tall (mobile) layout; never shrunk below legibility.
- Each figure is numbered and captioned in mono: `Fig. 2 — …`.

## Motion

Motion explains state; it never performs for its own sake.

- **Reveal**: content fades in and rises 12px, 420ms, `cubic-bezier(.2,.7,.2,1)`, once.
  Stagger ≤ 60ms. No scaling, no springs, no sideways entrances.
- **Diagrams**: edges draw in once (stroke offset, 700ms) when the figure enters.
- **Hover**: underline thickens / colour shifts in 150ms. Nothing lifts or glows.
- **Smooth scroll**: Lenis, lerp 0.12. Anchor links scroll through Lenis.
- **The hero simulation** is the only continuous animation, and it pauses when off-screen.
- `prefers-reduced-motion: reduce` → no Lenis, no reveals, no particles; the hero
  shows the 2D diagram and the simulation updates its numbers in discrete steps.

## Interaction & accessibility

- Every interactive element reachable by keyboard; visible focus = 2px `--signal`
  outline offset 3px.
- Skip link to main content.
- Body text ≥ 4.5 : 1, large text ≥ 3 : 1 (all tokens above pass).
- The simulation exposes its readouts in an `aria-live="polite"` region, throttled.
- Target: Lighthouse ≥ 90 on mobile in every category. three.js is never loaded on
  mobile or with reduced motion; on desktop it loads after first paint, when idle.
