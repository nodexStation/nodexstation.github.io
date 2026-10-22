# NodeX Station — Website

One-page website for **NodeX Station**, a full-stack development + AI automation studio based in Khulna, Bangladesh.

Tagline: *We build MERN web apps, e-commerce systems & AI automations that help businesses sell more.*

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content: hero, about, services, process, products, FAQ, contact |
| `styles.css` | All styling — responsive, no frameworks, no build step |
| `script.js` | Mobile menu, FAQ accordion, contact-form validation + mailto compose, footer year |
| `three-hero.js` | Three.js animated hero background (gold wireframe icosahedron + particle field) |
| `animations.js` | GSAP hero intro timeline + ScrollTrigger scroll reveals |
| `favicon.svg` | NodeX "NX" mark used as favicon and header logo |
| `README.md` | This file |

## Animations — Three.js + GSAP

The site is enhanced with two animation layers. Both are progressive
enhancement: the page is complete and readable with JavaScript libraries
missing, blocked, or disabled.

**Libraries (loaded from cdnjs, no local copies, no build step):**

| Library | Version | Used for |
|---|---|---|
| Three.js | 0.160.0 (`three.min.js`, classic global build) | WebGL hero background |
| GSAP | 3.12.5 (`gsap.min.js`) | Hero intro + scroll reveal animations |
| GSAP ScrollTrigger | 3.12.5 (`ScrollTrigger.min.js`) | Triggering reveals on scroll |

Script order at the end of `index.html` matters: `script.js` (core site
behaviour) first, then the three CDN libraries, then `three-hero.js`,
then `animations.js`.

**Three.js hero background (`three-hero.js`)** — a `<canvas id="hero-canvas">`
sits absolutely positioned behind the hero content (`pointer-events: none`,
hero content layered above it). The scene is on-brand black/gold: a slowly
rotating gold wireframe icosahedron with a fainter inner shell and glowing
vertices, plus a gold/white particle field with faint connecting lines.
The camera drifts gently with the mouse (parallax). The renderer is
transparent (`alpha: true`) so the existing hero gradient shows through.

**GSAP animations (`animations.js`)** — a staggered fade/slide intro for the
hero text on page load, and ScrollTrigger fade-up reveals (slight stagger
per group) for section headers, service cards, process steps, product cards,
FAQ items, and the contact columns. Everything animates with `gsap.from()` —
no element is ever hidden in CSS — so a failed animation can never leave
content invisible.

**Fallbacks & performance:**

- If the Three.js CDN fails, WebGL is unavailable, or initialisation throws,
  the canvas is hidden and the hero looks exactly as it did before.
- If GSAP fails to load, `animations.js` exits silently; the page is static
  but fully functional. If only ScrollTrigger fails, the hero intro still
  plays and the scroll reveals are skipped.
- `prefers-reduced-motion` is honoured in both files: the WebGL loop never
  starts and no GSAP animation runs.
- The Three.js render loop pauses when the browser tab is hidden
  (`visibilitychange`) and when the hero is scrolled off-screen
  (`IntersectionObserver`). `devicePixelRatio` is capped at 2, and the scene
  resizes with the hero.

## Run locally

No build step. Serve the folder with any static server, for example:

```bash
cd nodexstation-site
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy on GitHub Pages

1. Push these files to the root of a GitHub repository (for an organisation site, a repo named `nodexStation.github.io` serves at `https://nodexstation.github.io/`).
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Save. GitHub Pages publishes the site automatically on every push to `main`.

## How the contact form works

There is no backend. On submit, the form validates the name, email, and message in the browser, then opens the visitor's email app with a pre-addressed, pre-filled email to **nodexstation@gmail.com** (name, email, and message included). The visitor presses send in their own email app.

## Contact

- Email: nodexstation@gmail.com
- GitHub: https://github.com/nodexStation
- LinkedIn: https://www.linkedin.com/company/nodexstation
- Instagram: https://www.instagram.com/nodex_station/
