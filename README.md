# NodeX Station — Website

One-page website for **NodeX Station**, an AI automation studio based in Khulna, Bangladesh, working worldwide.

Positioning: *AI automations that sell, save time, and save money* — NodeX Station also builds MERN web apps and e-commerce systems.

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content: hero, story, how-it-works, capabilities, product preview, use cases, products, founder, FAQ, closing CTA, contact |
| `styles.css` | All styling — cinematic dark theme, responsive, no frameworks, no build step |
| `script.js` | Mobile menu, FAQ accordion, contact-form validation + mailto compose, footer year |
| `three-hero.js` | Three.js hero visual (ember neural network) + scroll-linked camera drift |
| `animations.js` | Scroll-progress bridge + GSAP hero intro, word reveals, workflow animation, scroll reveals |
| `favicon.svg` | NodeX "NX" mark used as favicon and header logo |
| `README.md` | This file |

## Design

Premium, cinematic, editorial — a warm-dark canvas with cream typography,
huge negative space, hairline dividers and a single restrained orange
accent. Original design built for NodeX Station's own identity (any
resemblance to other sites is design-language inspiration only — no
branding, copy, assets or code were taken from anywhere).

**Palette tokens (CSS variables in `styles.css`):**

| Token | Value | Use |
|---|---|---|
| `--bg` | `#100904` | Page background — warm near-black |
| `--cream` | `#ffedd7` | Primary text |
| `--surface` | `#382416` | Panels, nodes, form surface |
| `--border` | `#40372e` | Hairline dividers & borders |
| `--muted` | `#6c5f51` | Large labels / decorative text only (low contrast on `--bg`) |
| `--muted-text` | `color-mix(cream 58%, muted)` | Readable secondary body text |
| `--accent` | `#dc5000` | Restrained orange: eyebrow labels, markers, hovers, primary CTA |

**Typography:** Inter (Google Fonts, `display=swap`), oversized fluid
headings with tight letter-spacing, uppercase micro-labels with wide
tracking. **Layout voice:** spacious full-width statement sections,
editorial numbering (01/02/03), spec-table rows (system INPUT/PROCESS/
OUTPUT, capabilities list, starter pricing) separated by hairlines —
minimal card grids by design.

**Human grounding (real material only):** a compact founder section —
Fahim Ahmed Asif, Founder & CEO, his clothing/construction/supply/
marketing background and his line *"I run businesses too — so I build
like an owner, not just a developer."* — plus one grounded example
outcome (AI FAQ/order automation saving ~10 hrs/week for a clothing
brand). No testimonials, client logos, ratings, or invented metrics
anywhere on the site.

## Animations — Three.js + GSAP

Both layers are progressive enhancement: the page is complete and
readable with the libraries missing, blocked, or disabled.

**Libraries (cdnjs, no local copies, no build step):** Three.js 0.160.0,
GSAP 3.12.5, GSAP ScrollTrigger 3.12.5, plus Inter from Google Fonts.
Script order at the end of `index.html`: `script.js` first, then the
three CDN libraries, then `three-hero.js`, then `animations.js`.

**Three.js hero (`three-hero.js`)** — a full-bleed `<canvas
id="hero-canvas">` behind the hero copy: a warm ember neural system of
~64 orange/cream nodes linked to their nearest neighbours, a soft
central glow, travelling light pulses on highlighted links, and a
sparse ember-dust field. The network slowly rotates and breathes. A
scroll-progress value (`window.__nxScroll`, published by a lightweight
listener in `animations.js`) drifts the camera as the hero scrolls
away; the mouse adds gentle parallax.

**GSAP (`animations.js`)** — hero intro stagger; story statements whose
words light up progressively as you scroll (scrubbed); the workflow SVG
drawing its connectors, then activating inputs → agent core → outcomes
in sequence; a subtle parallax and looping run-highlight on the
console preview; and one-time fade-up reveals for the capabilities
rows, use cases, pricing rows, founder, FAQ and contact sections. All
animation is driven from JS (`gsap.from` / `fromTo`) — no content is
ever hidden in CSS, so a failed library can never blank the page. No
scroll pins and no loader overlay, by design.

**Fallbacks & performance:**

- Three.js CDN failure, missing WebGL, or any init error → the canvas
  hides and the hero's CSS shade gradient carries the design.
- GSAP failure → the page is static but fully functional; ScrollTrigger
  failure alone still leaves the hero intro.
- `prefers-reduced-motion` is honoured everywhere: the WebGL loop never
  starts (canvas hidden), GSAP motion is skipped, and CSS transitions
  are effectively disabled.
- The render loop pauses when the tab is hidden or the hero is
  off-screen (`IntersectionObserver`); `devicePixelRatio` is capped
  at 2; resize is handled.

## Run locally

No build step. Serve the folder with any static server:

```bash
cd nodexstation-site
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publish on GitHub Pages

The site is hosted from the `nodexStation/nodexstation.github.io`
repository, branch `main`, root folder — asset paths are relative, so
it works from any static host.

1. Push the changed files to `main` (for example with the GitHub
   snapshot push used previously, listing every changed file).
2. GitHub Pages deploys automatically on push — no workflow file is
   needed for a static root site. (Settings → Pages should read:
   Source “Deploy from a branch”, branch `main`, folder `/ (root)`.)
3. Verify: open `https://nodexstation.github.io/`, hard-refresh
   (Ctrl+Shift+R) to beat the CDN cache, and check the hero canvas,
   the workflow diagram and the contact form on desktop and mobile.
   Pages builds can queue for several minutes — check the repo's
   Actions tab (“pages build and deployment”) before assuming a push
   failed.

## How the contact form works

There is no backend. On submit, the form validates the name, email, and message in the browser, then opens the visitor's email app with a pre-addressed, pre-filled email to **nodexstation@gmail.com** (name, email, and message included). The visitor presses send in their own email app.

## Contact

- Email: nodexstation@gmail.com
- GitHub: https://github.com/nodexStation
- LinkedIn: https://www.linkedin.com/company/nodexstation
- Instagram: https://www.instagram.com/nodex_station/
