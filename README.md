# NodeX Station — Website

One-page website for **NodeX Station**, a full-stack development + AI automation studio based in Khulna, Bangladesh.

Tagline: *We build MERN web apps, e-commerce systems & AI automations that help businesses sell more.*

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content: hero, about, services, process, products, FAQ, contact |
| `styles.css` | All styling — responsive, no frameworks, no build step |
| `script.js` | Mobile menu, FAQ accordion, contact-form validation + mailto compose, footer year |
| `favicon.svg` | NodeX "NX" mark used as favicon and header logo |
| `README.md` | This file |

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
