---
name: new-post
description: Create a new bird-rehab update post. Use when the user wants to add, draft, or write a new rescue story, intake, release, or update for the Second Flight site. Scaffolds a Markdown file in src/content/posts/ with valid frontmatter and an emotionally resonant draft in the house style.
argument-hint: [short description of the bird/situation]
---

# Create a new update post

The user wants a new post for the bird-rehab site. The topic: **$ARGUMENTS**

Steps:

1. Pick a URL-safe slug from the topic (kebab-case, no dates in the slug).
2. Create `src/content/posts/<slug>.md`. Do NOT overwrite an existing file —
   if it exists, pick a different slug or ask.
3. Use frontmatter matching the schema in `src/content.config.ts`:
   - `title` — evocative, specific, not clickbait
   - `date` — today's date unless the user gives one
   - `species` — if known
   - `status` — one of: In care, Released, Education bird, Update.
     Choose the accurate one; only Released triggers the gold chip.
   - `excerpt` — one or two sentences; this shows in the update list
   - `image` — omit unless the user provides one
4. Write the body in the house voice, matching the existing sample posts:
   warm, first-person-plural ("we"), specific sensory detail, and a concrete
   closing — either what the rescue cost (tie to donations) or a small
   actionable ask (e.g. window decals). Keep it honest; don't invent medical
   specifics the user didn't give.
5. After writing, run `npm run build` to confirm the frontmatter validates,
   and tell the user the local URL: `/posts/<slug>`.

Read `src/content/posts/great-horned-owl-release.md` first as the style
reference. Keep to the three-color, minimal, emotionally-driven ethos in
CLAUDE.md — but this skill only writes content, never changes styling.
