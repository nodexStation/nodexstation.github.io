# NodeX Station — Website

One-page website for **NodeX Station**, an AI automation studio based in Khulna, Bangladesh, working worldwide.

Positioning: *AI automations that sell, save time, and save money* — NodeX Station also builds MERN web apps and e-commerce systems.

**Products — 34 starters, live on Gumroad** ([nodex5.gumroad.com](https://nodex5.gumroad.com)):

- [MERN Clothing E-commerce Starter](https://nodex5.gumroad.com/l/mern-clothing-store-starter) — $29 (launch offer: $49 → $29 with code LAUNCH20)
- [MERN SaaS Starter](https://nodex5.gumroad.com/l/mern-saas-starter) — $99
- [MERN Food Delivery Starter](https://nodex5.gumroad.com/l/mern-food-delivery-starter) — $49
- [MERN Online Course (LMS) Starter](https://nodex5.gumroad.com/l/mern-lms-starter) — $49
- [MERN Hotel Booking Starter](https://nodex5.gumroad.com/l/mern-hotel-booking-starter) — $49
- [MERN Inventory & POS Starter](https://nodex5.gumroad.com/l/mern-inventory-pos-starter) — $49
- [MERN Real Estate Starter](https://nodex5.gumroad.com/l/mern-real-estate-starter) — $39
- [MERN Job Board Starter](https://nodex5.gumroad.com/l/mern-job-board-starter) — $39
- [MERN Appointment Booking Starter](https://nodex5.gumroad.com/l/mern-appointment-booking-starter) — $39
- [MERN Community / Social Starter](https://nodex5.gumroad.com/l/mern-community-starter) — $39
- [MERN AI Chatbot Starter](https://nodex5.gumroad.com/l/mern-ai-chatbot) — $39
- [MERN Admin Dashboard Starter](https://nodex5.gumroad.com/l/mern-admin-dashboard) — $29
- [MERN Blog & CMS Starter](https://nodex5.gumroad.com/l/mern-blog-cms-starter) — $29
- [MERN Agency & Portfolio CMS Starter](https://nodex5.gumroad.com/l/mern-agency-cms-starter) — $29
- [MERN Fitness & Trainer Starter](https://nodex5.gumroad.com/l/mern-fitness-tracker-starter) — $49
- [MERN Travel & Tour Booking Starter](https://nodex5.gumroad.com/l/mern-travel-booking-starter) — $49
- [MERN Event Management & Ticketing Starter](https://nodex5.gumroad.com/l/mern-event-ticketing-starter) — $49
- [MERN Service Marketplace Starter](https://nodex5.gumroad.com/l/mern-service-marketplace-starter) — $49
- [MERN Car Rental Starter](https://nodex5.gumroad.com/l/mern-car-rental-starter) — $49
- [MERN Salon & Spa Booking Starter](https://nodex5.gumroad.com/l/mern-salon-booking-starter) — $39
- [MERN Pharmacy Store Starter](https://nodex5.gumroad.com/l/mern-pharmacy-store-starter) — $39
- [MERN Charity & Donation Starter](https://nodex5.gumroad.com/l/mern-charity-donation-starter) — $39
- [MERN Pet Care & Vet Booking Starter](https://nodex5.gumroad.com/l/mern-pet-care-starter) — $39
- [MERN Bookstore Starter](https://nodex5.gumroad.com/l/mern-bookstore-starter) — $29
- [MERN Multi-Vendor Marketplace Starter](https://nodex5.gumroad.com/l/mern-multi-vendor-marketplace-starter) — $49
- [MERN Doctor & Clinic Appointment Starter](https://nodex5.gumroad.com/l/mern-doctor-appointment-starter) — $49
- [MERN School Management Starter](https://nodex5.gumroad.com/l/mern-school-management-starter) — $49
- [MERN Taxi & Ride Booking Starter](https://nodex5.gumroad.com/l/mern-taxi-booking-starter) — $49
- [MERN HR & Employee Management Starter](https://nodex5.gumroad.com/l/mern-hr-management-starter) — $49
- [MERN CRM & Lead Management Starter](https://nodex5.gumroad.com/l/mern-crm-starter) — $49
- [MERN Courier & Parcel Delivery Starter](https://nodex5.gumroad.com/l/mern-courier-delivery-starter) — $39
- [MERN Freelance Services Marketplace Starter](https://nodex5.gumroad.com/l/mern-freelance-marketplace-starter) — $39
- [MERN Laundry & Cleaning Service Booking Starter](https://nodex5.gumroad.com/l/mern-laundry-booking-starter) — $39
- [MERN Invoicing & Billing Starter](https://nodex5.gumroad.com/l/mern-invoicing-starter) — $29

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content: hero, story, how-it-works, capabilities, product preview, selected work, use cases, products, founder, FAQ, closing CTA, contact |
| `styles.css` | All styling — cinematic dark theme, responsive, no frameworks, no build step |
| `script.js` | Mobile menu, FAQ accordion, contact-form validation + mailto compose, footer year |
| `animations.js` | GSAP hero intro, orbital-visual parallax/drift, word reveals, workflow animation, scroll reveals |
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
minimal card grids by design. Section bands alternate between the
pure background and a faint deep-brown wash, panels share one radius
and one warm layered shadow, and a barely-visible film grain sits
over the whole page for a cinematic finish.

**Human grounding (real material only):** a compact founder section —
Fahim Ahmed Asif, Founder & CEO, his clothing/construction/supply/
marketing background and his line *"I run businesses too — so I build
like an owner, not just a developer."* — plus one grounded example
outcome (AI FAQ/order automation saving ~10 hrs/week for a clothing
brand). No testimonials, client logos, ratings, or invented metrics
anywhere on the site.

## Visuals & animation — CSS, SVG + GSAP

Every visual on the page is hand-built CSS and inline SVG — there is
no 3D library and nothing to compile. All motion layers are
progressive enhancement: the page is complete and readable with
animations disabled or the animation library missing.

**Library (cdnjs, no local copy, no build step):** GSAP 3.12.5 +
ScrollTrigger 3.12.5, plus Inter from Google Fonts. Script order at
the end of `index.html`: `script.js`, then the GSAP CDN pair, then
`animations.js`.

**Hero visual (inline SVG + CSS keyframes)** — an orbital diagram of
the agent system beside the hero copy: concentric hairline rings
turning very slowly in opposite directions, a glowing core labelled
“AI AGENT” with a soft pulse, channel nodes on the left (Messenger,
Store, Email), outcome nodes on the right (Replies, Orders, Leads),
thin connector paths, and twinkling ember dots. The atmosphere is
pure CSS: layered warm radial glows (a restrained ember bloom, a
soft cream bloom) and a film-grain overlay generated from an inline
SVG noise filter at very low opacity.

**GSAP (`animations.js`)** — hero intro stagger; a gentle scroll
parallax and cursor drift on the orbital visual, with a slow idle
float on the artwork; story statements whose words light up
progressively as you scroll (scrubbed); the workflow SVG drawing its
connectors, then activating inputs → agent core → outcomes in
sequence; a subtle parallax and looping run-highlight on the console
preview; and one-time fade-up reveals for the capabilities rows, work
rows, use cases, pricing rows, founder, FAQ and contact sections. All GSAP
motion is driven from JS (`gsap.from` / `fromTo`) — no content is
ever hidden in CSS, so a failed library can never blank the page. No
scroll pins and no loader overlay, by design.

**Fallbacks & performance:**

- GSAP failure → the page is static but fully functional (the SVG
  diagram and CSS keyframe motion still carry the hero);
  ScrollTrigger failure alone still leaves the hero intro.
- `prefers-reduced-motion` is honoured everywhere: GSAP motion is
  skipped, CSS keyframe animations (rings, pulse, embers) are
  switched off, and transitions are effectively disabled.
- No render loops and no per-frame work outside GSAP's own ticker —
  the page idles at zero cost.

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
   (Ctrl+Shift+R) to beat the CDN cache, and check the hero orbital
   diagram, the workflow diagram and the contact form on desktop
   and mobile.
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
