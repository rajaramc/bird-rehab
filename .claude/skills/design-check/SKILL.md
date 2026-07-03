---
name: design-check
description: Audit the site against its non-negotiable design constraints — exactly three colors, minimalism, and emotional impact. Use before shipping visual changes or when the user asks whether a change fits the design system. Read-only analysis; reports violations rather than silently fixing.
---

# Design constraint audit

Check the current state of the site against the client's hard rules
(see CLAUDE.md). Report findings; do not change files unless asked.

1. **Three colors only.** Grep `src/styles/global.css` and every `.astro`
   file for hex codes, `rgb(`, `hsl(`, and named CSS colors. The ONLY
   allowed base values are `#1E332A` (spruce), `#FAFAF7` (paper), `#E0A32E`
   (gold), plus `rgba()` tints of spruce or paper. Flag any other color,
   including inline styles and SVG `fill`/`stroke` attributes.

   ```bash
   grep -rniE '#[0-9a-f]{3,6}|rgb\(|hsl\(' src public/admin --include=*.astro --include=*.css --include=*.html
   ```
   Confirm each hit resolves to one of the three tokens.

2. **Minimalism.** Look for clutter that crept in: competing focal points in
   a single view, decorative elements that encode nothing, more than one bold
   "signature" moment per page. Note anything that should be cut.

3. **Emotional impact of the content pane.** Check the hero and post cards
   still lead with story and stakes, not generic marketing copy. Flag filler.

4. **Quality floor.** Confirm keyboard focus styles, responsive behavior down
   to mobile widths, and `prefers-reduced-motion` handling are intact.

Output a short pass/fail list per section with file:line references. If the
user then asks you to fix violations, do so minimally and re-run the grep.
