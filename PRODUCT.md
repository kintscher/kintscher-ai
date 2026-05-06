# Product

## Register

brand

## Users

Three audiences, all visiting via a LinkedIn link or a direct share, all evaluating quickly:

- **Founders and CTOs scoping greenfield work.** Want to know in under sixty seconds whether Yannik is senior enough to trust with an end-to-end build. Read the about page if the home page convinces them.
- **Recruiters in Zürich tech.** Skim on phones first, often with auto-translate on. Tab through to test if the site is real, or click the chat to see if it actually works.
- **Design-literate engineers and peers.** Read the source. Notice the chat thesis, the command palette, the typography. The bar is set by what they ship themselves.

The default visitor reaches the site once, on a phone, with thirty seconds of attention. Everything load-bearing must clear that bar.

## Product Purpose

Signal senior fullstack capability and demonstrate the exact work Yannik does at UBS. The Ask-Yannik chatbot is the thesis: instead of a paragraph claiming "I build chatbots inside a regulated bank," the visitor talks to one. The site succeeds when a CTO scoping greenfield work emails after the visit, or when a recruiter forwards the link to a hiring engineer.

The portfolio competes with hundreds of dev-portfolio templates. Its job is to be unmistakably not one of them.

## Brand Personality

Confident, calm, precise. Three words: editorial, deliberate, technical.

Voice is terse without being curt. First person sparingly, second person not at all. Sentences carry weight; nothing is filler. The tone of a senior engineer explaining their work to a peer, not a candidate selling themselves to a recruiter. Every word earns its place.

The interface should feel inhabited rather than designed - like the work of someone who reads a lot, ships a lot, and has opinions about both.

## Anti-references

Explicit non-goals - if any of these patterns appear, something has gone wrong:

- **Dev-portfolio-on-Vercel template.** No hero gradient, no three tech-stack icons, no GitHub-pinned-repos carousel, no newsletter signup, no "Hi, I'm Yannik" with a wave emoji.
- **shadcn-default.** Must not look like someone ran `shadcn init` and shipped the defaults. No generic radius, no muted-foreground gray, no card-with-border-and-padding everywhere.
- **Brutalism.** No oversized Helvetica, no harsh boxes, no anti-design as a stance. Trendy but too loud for the voice.
- **Awwwards maximalism.** No WebGL, no cursor effects, no animated particles, no smooth-scroll hijacking. "Look how clever" is not the vibe.
- **Marketing landing page.** No checkmark bullet lists, no testimonial carousels, no trusted-by logo walls, no sticky CTAs, no social-proof scaffolding.
- **LinkedIn-engineer-personal aesthetic.** No warm pastel-blue stock-photo feel, no "building cool things in tech" energy, no humblebrag-as-content.

## Design Principles

Five principles, in order of precedence. When two conflict, the higher one wins.

1. **Show, don't tell.** The chatbot demonstrates the work; copy never describes capabilities a visitor can verify directly. If a paragraph could be replaced with the thing it describes, replace it.
2. **Editorial over marketing.** Linear, Vercel, Resend, rauno.me - not portfolio templates. Whitespace is a design element, not absence. Typography carries hierarchy; cards don't.
3. **Keyboard is first-class.** Command palette, key hints, focus discipline. The site is keyboard-first because the work it represents is. If keyboard navigation breaks, the thesis breaks.
4. **Trust the reader.** Text-dense, technically literate, no hand-holding. Dates, numbers, and tech tokens are content - not bullet points to scan.
5. **Calm over loud.** No motion that demands attention. Animation supports state changes, never decorates idle moments. The amber accent is a single deliberate signal, not a palette.

## Accessibility & Inclusion

Target WCAG AA as floor, not ceiling. Specific commitments:

- **Contrast.** 4.5:1 for body text, 3:1 for UI elements. Verified at every text-on-surface combination.
- **Keyboard-only operation.** Every interactive element reachable and operable. Visible focus indicator on every focusable element - no exceptions, no `outline: none` without a stronger replacement. Tab order matches reading order.
- **Screen reader paths.** Correct heading hierarchy, landmarks set, ARIA used only where semantic HTML falls short. Live regions for async UI (chat stream, copy confirmation).
- **Reduced motion.** `prefers-reduced-motion` respected across all animations - rise, fade, sweep, shimmer.
- **Touch targets.** ≥44×44px on mobile. The LinkedIn launch will surface most traffic via phone.
- **Auto-translate safety.** Tech tokens (Python, OpenAI, FastAPI, etc.) wrapped with `translate="no"` so German auto-translate doesn't mangle them.
- **Zoom resilience.** Layout holds at 200% zoom without horizontal scroll or content clipping.
- **Body text floor.** No body copy under 16px on mobile (iOS auto-zoom safeguard plus low-vision support).

Out of scope: WCAG AAA conformance, voice-control optimization, cognitive-accessibility adaptations. The site is intentionally text-dense and assumes context; simplification would dilute the voice.
