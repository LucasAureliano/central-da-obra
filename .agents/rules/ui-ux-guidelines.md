# CentralObra - Agent Guidelines & UI/UX Standards

This document defines the core standards and operational rules for Antigravity when working on the CentralObra codebase.

## 1. UI/UX Pro Max Design Intelligence (Mandatory)

For all frontend, layout, styling, and visual component tasks, you **MUST** consult and apply the guidelines from **UI/UX Pro Max** located in `.agents/skills/ui-ux-pro-max/` and `~/.gemini/config/skills/ui-ux-pro-max/`.

### Design System Source of Truth
- **Master Design System**: Refer to `design-system/centralobra/MASTER.md`.
- **Page Overrides**: If a page specification exists in `design-system/centralobra/pages/[page].md`, its rules override MASTER.md.

### Priority Hierarchy (Priority 1 -> 10)
1. **Accessibility (CRITICAL)**:
   - Minimum 4.5:1 text contrast for body text; 3:1 for large text/icons.
   - Visible focus rings (2-4px) on interactive elements.
   - `aria-label` for icon-only buttons.
   - Never use emojis as structural icons — always use Lucide SVG icons.
   - Respect `prefers-reduced-motion`.
2. **Touch & Interaction (CRITICAL)**:
   - Minimum touch target 44x44px on mobile (iOS/Android standard).
   - Minimum 8px gap between interactive elements.
   - Visual feedback on tap/hover within 80-150ms.
   - `cursor: pointer` on all clickable elements.
   - Never rely on hover alone (mobile-first interaction).
3. **Performance (HIGH)**:
   - WebP/AVIF images with explicit width/height or aspect-ratio (prevent layout shift, CLS < 0.1).
   - Lazy load non-critical below-the-fold media.
4. **Style & Visual Identity (HIGH)**:
   - Architecture & Civil Engineering identity: Clean, professional, solid, industrial grey with safety orange accents.
   - Never use random AI purple/pink gradients.
   - Cohesive icon set (Lucide).
5. **Layout & Responsive (HIGH)**:
   - Mobile-first breakpoints: 375px, 768px, 1024px, 1440px.
   - Zero horizontal overflow (`overflow-x: hidden`).
   - Respect safe areas (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`).
6. **Typography & Color (MEDIUM)**:
   - Consistent CSS token variables (`--color-primary`, `--color-background`, etc.).
   - Body font scale: minimum 15-16px on mobile to prevent automatic browser zoom.
7. **Animation & Motion (MEDIUM)**:
   - Smooth transitions (150-300ms) with purposeful meaning.
   - No layout-shifting scale on hover.
8. **Forms & Feedback (MEDIUM)**:
   - Visible labels, helper text, and clear inline validation near the input.
9. **Navigation Patterns (HIGH)**:
   - Predictable back button navigation.
   - Bottom navigation <= 5 primary destinations.
10. **Pre-Delivery Verification**:
   - Run verification checks across mobile (375px) and desktop before concluding frontend tasks.

---

## 2. Running UI/UX Pro Max Tools

To query styles, colors, guidelines, or components:
```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>
# Examples:
# python .agents/skills/ui-ux-pro-max/scripts/search.py "dashboard" --domain ux
# python .agents/skills/ui-ux-pro-max/scripts/search.py "construction" --domain color
# python .agents/skills/ui-ux-pro-max/scripts/search.py "hero" --domain landing
```
