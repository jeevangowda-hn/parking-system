---
name: Parkwise Mobility OS
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#545c72'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c748b'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  numeric-metric:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  slot-id:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
---

## Brand & Style

This design system embodies high-precision mobility operations, architectural calm, and effortless spatial intelligence. It sits at the intersection of modern automotive interfaces and high-scale enterprise SaaS platforms. The experience prioritizes clarity, immediate status comprehension, and zero visual friction.

The style fuses **Modern Corporate SaaS** with **Architectural Minimalism**:
- **High-legibility hierarchy:** Data-dense telemetry and interactive parking bay blueprints balanced by generous whitespace and restrained chromatic weight.
- **Precision hardware & spatial cues:** Micro-indicators, structural hairline dividers, and muted contextual surfaces evoke modern architectural schematics rather than generic dashboard software.
- **Emotional tone:** Unflappable, secure, ultra-efficient, and effortless. Dispatchers, facility operators, and end-user motorists feel an immediate sense of frictionless orientation.

## Colors

The palette leverages an editorial balance between crisp operational neutrals and luminous emerald telemetry accents.

### Core Canvas & Accents
- **Canvas Base:** `#F8F9FA` serves as the primary canvas; nested operational containers utilize pure white `#FFFFFF` or elevated cool-neutral `#F1F5F9`.
- **Primary Brand / Action:** `#059669` (Core Emerald) with `#0F766E` for deep hover/pressed states and `#10B981` for glowing live telemetry signals.
- **Secondary Slate:** `#64748B` anchors non-interactive metadata, subheadings, and contextual iconography.
- **Enterprise Shell / Anchor:** `#0F172A` provides the deep slate foundational tone for navigation rails, command bars, and dense multi-floor facility pickers.
- **Hairline Borders:** `#E2E8F0` and `#E5E7EB` maintain structural precision without visual heaviness.

### Telemetry & Parking State Semantics
Each state features a calibrated three-tier system (Fill, Border, Label):
- **Available:** Fill `#ECFDF5`, Border `#A7F3D0`, Signal `#10B981`. Conveys clear, unblocked opportunity.
- **Selected:** Fill `#D1FAE5`, Border `#059669`, Focus Glow `#10B981` with inner contrast text `#064E3B`.
- **Occupied:** Fill `#F1F5F9`, Border `#CBD5E1`, Text `#64748B`. Low-contrast and intentionally receded to keep attention focused on active bays.
- **Reserved:** Fill `#FFFBEB`, Border `#FDE68A`, Signal `#D97706`. High-visibility warmth for impending arrivals and VIP bookings.
- **Maintenance / Restricted:** Fill `#FFF1F2`, Border `#FECDD3`, Signal `#E11D48`. Precise, non-panicked utility alert.

## Typography

The typographical pairing splits display authority and micro-density:
- **Headlines (Manrope):** Geometric, modern, and sturdy. Delivers high structure across large navigational signage, capacity metrics, and modal titles with tighter negative letter-spacing for premium polish.
- **Interface & Metrics (Inter):** Highly neutral, engineered for extreme legibility at small sizes. Used for slot metadata, occupancy charts, and forms.
- **Numbers & Slot Identifiers:** Always utilize tabular figures (`font-variant-numeric: tabular-nums`) across vehicle license tags, rates, spot codes, and countdown clocks to eliminate visual vibration during real-time status refreshes.

## Layout & Spacing

The architecture operates on an 8pt base grid with an intentional sense of breathing room for spatial intelligence mapping.

### Grid & Breakpoints
- **Desktop (1280px+):** Asymmetrical enterprise shell. Persistent `280px` dark navigation rail (`#0F172A`), followed by a fluid multi-pane workspace spanning a 12-column grid with `24px` (`1.5rem`) gutters and `32px` (`2rem`) content canvas padding.
- **Tablet (768px - 1279px):** Collapsible icon rail (`72px`), 8-column workspace, fluid floor-map viewport with floating drawer overlays for reservation controls.
- **Mobile (< 768px):** Single-column stack with bottom navigation bar, `16px` canvas margins, and sticky bottom booking sheets.

### Floor-Map Viewport Philosophy
Map layers (bay grids, lane vectors, EV charger banks) sit within an interactive canvas bounded by unified internal panel padding (`space-lg`), separating dynamic visual telemetry from persistent analytic summaries.

## Elevation & Depth

Depth is established via structural tonal layering, crisp borders, and subtle diffuse shadows rather than deep drop shadows:

- **Surface 0 (Background):** `#F8F9FA` canvas with absolute flat elevation.
- **Surface 1 (Base Cards / Sections):** Pure white `#FFFFFF` bordered by `1px solid #E2E8F0` and paired with micro-shadow `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Surface 2 (Hovered Cards & Interactive Bays):** Border shifts to `#CBD5E1` with elevation `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.03)`.
- **Surface 3 (Flyouts, Popovers, & Dropdown Sheets):** Elevated `#FFFFFF` surfaces bounded by `#E2E8F0` with `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Active Telemetry Glow:** Active selection utilizes an ambient ring `0 0 0 3px rgba(16, 185, 129, 0.25)` to create electric, high-visibility focus without altering layout dimensions.
- **Sidebar & Nav Depth:** The `#0F172A` admin shell remains matte with a hairline border-right of `1px solid #1E293B`, creating structural compartmentalization without drop shadows.

## Shapes

The design system maintains an intentional, architectural roundedness balance (`roundedness: 2`). It avoids toy-like full pills for operational components while providing smooth, modern corners:

- **Standard Elements (Inputs, Buttons, Badges):** `8px` (`0.5rem`) corner radius.
- **Cards, Modals, & Data Containers:** `12px` to `16px` (`rounded-lg` to `rounded-xl`) corner radius.
- **Interactive Parking Bays:** `8px` corner radius with `1.5px` precision borders, mirroring realistic architectural stalls while offering tactile click targets.
- **Pill Exceptions:** Restricted exclusively to status dot indicators, micro telemetry chips (`padding: 2px 8px`), and user avatars.

## Components

### Buttons
- **Primary:** Solid `#059669` emerald fill, crisp `#FFFFFF` text, `8px` border radius, subtle inner highlight `inset 0 1px 0 rgba(255, 255, 255, 0.15)`. Hover: `#0F766E`. Active: Scale `0.99`.
- **Secondary / Operational:** White `#FFFFFF` surface with `1px solid #E2E8F0` border and `#1E293B` text. Hover: `#F8F9FA` with border `#CBD5E1`.
- **Destructive:** Soft wash `#FFF1F2` with `#E11D48` text and border `#FECDD3`. Hover: `#FFE4E6`.

### Parking Bay Grid Slot (Core Specialty Component)
- **Dimensions & Proportion:** Aspect ratio ~1:1.6 (mimicking real vehicle bays).
- **Idle State:** Background set by semantic status token; bay code (`slot-id`) positioned in upper quadrant; vehicle type icon (EV, Compact, Accessible) positioned in lower quadrant.
- **Interactive State (Hover/Focus):** Micro-lift (`translateY(-2px)`), border darkened by 10%.
- **Selected State:** Emerald background `#D1FAE5`, active `#059669` border, `3px` focus ring `#10B981` at 25% opacity, dynamic checkmark icon anchored top-right.

### Status Badges & Chips
- Semantically tinted background (e.g., `#ECFDF5` for available) paired with a `6px` pulsing or static solid status dot, accompanied by `12px` medium text in `#065F46`. Padding: `4px 10px`. Border radius: `6px`.

### Cards & Container Panels
- White background `#FFFFFF`, `16px` corner radius, `1px solid #E2E8F0`.
- Card Header: Flex layout with bottom hairline divider `#F1F5F9` separating title actions from telemetry metrics.

### Input Fields & Selectors
- Background `#FFFFFF`, height `40px`, border `1px solid #CBD5E1`, text `#111827`, placeholder `#94A3B8`.
- Focus state: Border `#059669`, ring `3px rgba(5, 150, 105, 0.15)`, smooth transition `150ms ease-out`.

### Checkboxes & Toggle Switches
- Checkboxes: `18px x 18px`, `4px` corner radius, `#059669` when checked with white checkmark glyph.
- Toggles: Track `#E2E8F0` (inactive) to `#059669` (active). Thumb is pure white `#FFFFFF` with a crisp `0 1px 3px rgba(0,0,0,0.15)` drop shadow.

### Enterprise Sidebar Navigation
- Deep slate background `#0F172A`. Text links `#94A3B8` with hover `#F8F9FA`.
- Active Route: `#1E293B` background fill, `#10B981` text, left border indicator `3px solid #10B981`.