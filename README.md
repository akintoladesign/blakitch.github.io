# Blakitch — multi-page site

Four static pages — Home, Our Services, About Us, Contact Us — built as plain
HTML/CSS/JS so they can be hosted directly on GitHub Pages, no build step
required. Dark theme, red accent, based on the Figma comps you shared.

## Folder structure

```
blakitch-site/
├── index.html                 ← Home
├── services.html               ← Our Services
├── about.html                  ← About Us
├── contact.html                 ← Contact Us
├── CNAME                       ← tells GitHub Pages to serve blakitch.com
├── css/
│   └── styles.css
├── js/
│   ├── main.js                 ← nav, dropdown, mobile menu, forms (works with no JS-motion library)
│   └── animations.js           ← GSAP motion layer, built on top of main.js
└── assets/
    ├── blakitch-logo.png              ← original logo, white background
    ├── blakitch-logo-transparent.png  ← logo, transparent background
    ├── blakitch-logo-white.png        ← pure white logo for the dark header/footer
    ├── Blakitch CEO.png               ← owner-supplied portrait; retained as provided
    ├── kitchen-showreel.png           ← generated shared showreel image
    ├── kitchen-team-banner.png        ← generated homepage banner image
    ├── portfolio-*-setup.png          ← generated illustrative service gallery images
    ├── contact-hospitality.png        ← generated contact page image
    ├── newsletter-chef-plating.png    ← generated newsletter image
    └── vendor/gsap/
        ├── gsap.min.js
        └── ScrollTrigger.min.js       ← self-hosted, not loaded from a CDN
```

Everything is relative-pathed, so it works the same whether opened straight
from a folder or served from GitHub Pages.

## What's animated, and how

- **Split-word headline reveal** — every `<h1>` with `data-split` gets broken
  into words and staggered in on load (`animations.js`).
- **GSAP marquees** — the "What Blakitch stands for" strip on the Home and
  About pages scrolls infinitely; hover to slow it down. Driven by
  `gsap.to(track, { xPercent: -50, repeat: -1 })` on a duplicated track, not CSS.
- **Scroll-scrubbed process line** — the red progress line under "Our Process"
  fills in sync with scroll position (`ScrollTrigger`, `scrub: true`).
- **Morphing SVG blob** — the soft red shape behind the homepage hero photo
  cycles between three organic path shapes on a slow loop. Purely decorative,
  sits behind the image, never over real content.
- **Mobile menu** — hamburger morphs into an "X", the menu reveals with a
  circular clip-path wipe, and links stagger in.
- Everything above respects `prefers-reduced-motion` and degrades gracefully:
  if GSAP fails to load for any reason, `main.js` alone still makes every
  page fully usable (nav, dropdown, mobile menu, forms all work without it).

GSAP is **self-hosted** in `assets/vendor/gsap/` rather than pulled from a
CDN — one less external dependency, no CDN outage risk, works identically
offline.

## Nav & mobile menu

- Desktop: "Our Services" opens a mega-dropdown (hover or click) with the
  three service categories, each linking to an anchor on `services.html`.
- Mobile (under 900px): the hamburger opens a full-page dark overlay with
  large stacked links and an accordion for "Our Services" — inspired by the
  Korbs dropdown pattern you referenced.

## A few things I changed from your comps, and why

- **Removed the "Trusted by Netflix / BBC / Airbnb / Nokia" logo strip.**
  Those look like placeholder logos from a design template — shipping them
  as-is would imply those companies are Blakitch clients, which isn't true,
  and reproducing their logos without permission is a trademark issue on top
  of that. I swapped it for a marquee of Blakitch's own value statements
  instead. Once you have real client or press logos, that's an easy swap.
- **Standardized the phone number.** Your comps had two different numbers
  (`+239030015850` and `+234 701 208 0337`) — I used the second everywhere.
  Update `contact.html` and the footer (all four pages) if that's wrong.
- **Footer links to Events / Blog / Careers removed.** Those pages don't
  exist yet, so I pointed the footer at the four real pages instead of dead
  links. Happy to add real Events/Blog/Careers pages later if you want them.
- **Photo blocks now use real image files.** Seven generated hospitality
  scenes fill the showreel, banner, gallery, contact and newsletter slots.
  Gallery cards are labeled as illustrative examples, not client case-study
  photos. The supplied `Blakitch CEO.png` portrait is used for the Founder/CEO
  and mission sections without alteration. Replace illustrative scenes with
  client-owned or licensed photography when it becomes available.
- **Reviews are sample placeholders**, clearly labeled as such under the
  section, ready to swap for real client quotes.
- **Calendly link** (`calendly.com/blakitch`) is a guess at the URL —
  confirm or create that account before it goes live.

## 1. Put this on GitHub Pages

Push everything in this folder to the root of whichever repo serves
`blakitch.com` (see our earlier conversation on the `blakitch.github.io` vs.
custom-domain naming question). From inside this folder:

```bash
git init
git add .
git commit -m "Launch Blakitch multi-page site"
git branch -M main
git remote add origin https://github.com/<your-username-or-org>/<repo-name>.git
git push -u origin main
```

Then in the repo: **Settings → Pages** → Source: `main` branch, `/ (root)`.

## 2. Custom domain (blakitch.com)

Same as before — the `CNAME` file here is already set to `blakitch.com`.
At your DNS provider:

```
A       @      185.199.108.153
A       @      185.199.109.153
A       @      185.199.110.153
A       @      185.199.111.153
CNAME   www    <your-username>.github.io.
```

Then in **Settings → Pages**, enter `blakitch.com` under Custom domain,
wait for the DNS check to pass, and turn on **Enforce HTTPS**.

## 3. Making changes later

No build tools — edit the HTML/CSS/JS directly and push:

- Copy and page structure → the four `.html` files
- Colors, spacing, layout → `css/styles.css` (brand colors are CSS variables
  at the top: `--red`, `--bg`, `--white`, etc.)
- Nav behavior, forms → `js/main.js`
- Motion/animation → `js/animations.js`

## 4. Forms still need a backend

Both the contact form and the "Join Our List" newsletter form are
static-only right now — submitting just shows a confirmation message
locally, nothing is actually sent or stored. Wire them up to
[Formspree](https://formspree.io), [Getform](https://getform.io), or a
serverless function when you're ready — flag it and I can help wire
whichever you pick.
