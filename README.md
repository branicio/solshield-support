# SolShield — Support Site

Static support and legal site for **SolShield**, the UV monitoring app for iOS.

Plain HTML, no build step. Served by **GitHub Pages** from the `main` branch root
(`source: main /`), so anything pushed to root is live within a minute:

**https://branicio.github.io/solshield-support/**

---

## Live URLs — and why the filenames are frozen

All five of these return `200` today and must keep returning `200`:

| URL | Resolves to |
|---|---|
| https://branicio.github.io/solshield-support/ | `index.html` |
| https://branicio.github.io/solshield-support/privacy | `privacy.html` |
| https://branicio.github.io/solshield-support/privacy.html | `privacy.html` |
| https://branicio.github.io/solshield-support/terms | `terms.html` |
| https://branicio.github.io/solshield-support/terms.html | `terms.html` |

GitHub Pages resolves the extensionless forms (`/privacy`, `/terms`) to the
matching `.html` file automatically — there is no redirect rule, no `.htaccess`,
nothing to configure. **That resolution is what keeps `/privacy` and `/terms`
alive, and it only works because the files are still named `privacy.html` and
`terms.html`.** Rename either file and the extensionless URL 404s.

`/privacy` and `/terms` are registered in App Store Connect and embedded
verbatim in the App Store description for app ID **6757956272**
(`https://apps.apple.com/app/apple-store/id6757956272`). That description text
cannot be changed without shipping a new app version and going through App
Review. **Do not rename `index.html`, `privacy.html`, or `terms.html`, for any
reason, without first confirming a coordinated App Store Connect update.**

---

## Files

| Path | Purpose |
|---|---|
| `index.html` | Home page — trilingual landing page (English → Português → Español stacked sections): hero, UV-level ribbon, feature grid, science card, skin-type reference, FAQ, contact card |
| `privacy.html` | Privacy Policy, same trilingual structure |
| `terms.html` | Terms of Use, same trilingual structure, including the subscription pricing section |
| `styles.css` | The one stylesheet for all three pages: Solar Noon design tokens (colour, type, spacing), nav/hero/card/footer components, the `[data-lang]` show/hide rules and their no-JS fallback, and the `[data-rise]` load-in animation (disabled under `prefers-reduced-motion`) |
| `site.js` | Language-tab controller — see "Languages and anchors" below. No other behaviour lives here |
| `fonts/Inter-latin.woff2` | Self-hosted variable Inter, latin subset — see "Self-hosted font" below |
| `fonts/OFL.txt` | The SIL Open Font License covering Inter — required attribution, must ship alongside the font |
| `badges/app-store-{en-us,pt-br,es-es}.svg` | Vendored App Store badge artwork, one per language — see "Vendored store badges" below |
| `app-icon.png` | Shared app-icon asset used as the favicon and the nav/footer brand mark on every page |
| `README.md` | This file |
| `.gitignore` | Ignores `.DS_Store` |

---

## Vendored store badges (`badges/`)

The site loads **no third-party subresource anywhere** — the font, the app
icon, and the three App Store badges are all served from this repo. The
badges are Apple's own artwork, downloaded byte-for-byte from:

| File | Source |
|---|---|
| `badges/app-store-en-us.svg` | `https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83` |
| `badges/app-store-pt-br.svg` | …same with `/pt-br` |
| `badges/app-store-es-es.svg` | …same with `/es-es` |

> **Never modify these files.** Apple's marketing guidelines permit hosting
> their badge art but not altering it — no recolouring, cropping, rescaling,
> or re-encoding, and no running them through an image optimiser. Size them
> with CSS only (`.badges .as`, fixed at `width: 150px; height: auto`), never
> by editing the file. To refresh, re-download from the URL above (`-L`
> required — the endpoint 301s) and commit the new bytes unchanged.

Hosting rather than hotlinking is deliberate: `tools.applemediaservices.com`
is an API endpoint, not a stability contract, and local files remove a
DNS+TLS handshake from the home page.

---

## Self-hosted font (`fonts/`)

`styles.css` declares one `@font-face` rule pointing at a local `.woff2` file
instead of a `fonts.googleapis.com` / `fonts.gstatic.com` `<link>`:

| File | Family | Weight | Notes |
|---|---|---|---|
| `fonts/Inter-latin.woff2` | Inter | Variable, `wght` axis 100–900 (518 glyphs) | Latin subset only — the site's English/Portuguese/Spanish content needs no `latin-ext` coverage |

Inter is SIL Open Font License (OFL) 1.1 — see `fonts/OFL.txt`, which the OFL
requires to travel alongside the font. 47 KB total.

Self-hosting, same as the badges above, means **zero third-party requests of
any kind** — no Google Fonts DNS/TLS round trip, no dependency on a CDN
staying up, and no way for a third party to see a visitor's IP or User-Agent
just from loading this site. This matters more here than it would for an
ordinary marketing site: two of these three pages *are* the privacy policy
and the terms of use for an app that promises to protect the user's data, so
the pages that host that promise have to keep it themselves.

---

## Languages and anchors

`index.html`, `privacy.html`, and `terms.html` are each a **single stacked
trilingual page** (English → Português → Español), with the same three
anchors:

| Anchor | Language | `lang` attribute site.js sets |
|---|---|---|
| `#top` | English | `en` |
| `#portugues` | Português (pt-BR) | `pt-BR` |
| `#espanol` | Español (es-ES) | `es-ES` |

Example: https://branicio.github.io/solshield-support/terms.html#espanol

> **Store listings use the BASE URLs above with no `#anchor` deep-links.**
> `/privacy` and `/terms` are what's registered in App Store Connect (see
> "Live URLs" above), and that registration is locale-independent — every
> storefront points at the same base URL. If anchor deep-linking is ever
> adopted for locale-specific submission fields, it must be a planned,
> coordinated change, not a quiet edit to these pages.

### How the language tabs work (`site.js`)

Each page renders all three languages as sibling `<section data-lang="en|pt|es">`
elements inside `<main>`. `site.js` is what turns that into a tabbed view:

- On load it reads `location.hash` (`#top` → en, `#portugues` → pt,
  `#espanol` → es); if the hash is empty or unrecognised it falls back to
  `navigator.language`, then to English.
- Clicking a language tab (`role="tab"`, `EN`/`PT`/`ES` in the nav) shows that
  language's section, hides the other two (`data-lang-active` +
  `aria-hidden`), sets `document.documentElement.lang`, and updates
  `location.hash` via `history.replaceState` (so the URL becomes shareable
  without adding a back-button entry per click).
- Left/Right arrow keys move focus and selection between tabs, wrapping at
  the ends — standard ARIA tablist behaviour.
- A `hashchange` listener re-applies the language **only when the new hash is
  one of the three language anchors** (`#top`/`#portugues`/`#espanol`).
  Any other in-page anchor — including the skip link's `#main` — leaves the
  reader's current language alone. Falling through to `navigator.language` on
  every hashchange would otherwise silently switch a PT/ES reader to whatever
  the browser's locale says the moment they clicked an ordinary anchor.

### The no-JS fallback

`site.js` sets `document.documentElement.dataset.js = "on"` as its very
first statement, before anything else runs. `styles.css` hides inactive
`[data-lang]` sections **only** under the scope `html[data-js="on"]
[data-lang] { display: none; }` — there is no rule anywhere in the stylesheet
that hides `[data-lang]` content outside that scope. Together, that means:

- With JavaScript disabled entirely, `data-js` is never set, the CSS hiding
  rule never matches, and all three languages render stacked on one page, top
  to bottom — still fully readable, still fully linkable via
  `#top`/`#portugues`/`#espanol` (the browser's native in-page anchor scroll
  works with zero script).
- If `site.js` throws partway through setup, its `catch` block explicitly
  *removes* `data-js` again and logs to `console.error` — it never rethrows —
  which hands control back to the same no-JS stylesheet branch.

So a missing, disabled, or broken script degrades to **all three languages
stacked and readable**, never to a blank page. That matters because two of
these three pages are legal documents a user, or an App Store reviewer, must
be able to read regardless of what their browser or network does with the
script.

---

## Where prices appear

The section Pew Pal's README does not have, because Pew Pal has no
subscription. SolShield's prices appear in exactly these six places:

| File | Languages | Location |
|---|---|---|
| `index.html` | en / pt / es | FAQ item 1 — "What does SolShield cost?" |
| `terms.html` | en / pt / es | Subscription section — plans and amounts |

Current values, **verified against the App Store Connect API on
2026-07-28**: **$9.99/year**, **$0.99/month**, both with a **7-day free
trial**. Every one of the six locations above must state exactly these
numbers, in USD, in every language.

**Prices must be re-verified via the ASC API before every release — never
trusted from in-repo strings, and never trusted from any single source.**
This is not a hypothetical: in July 2026 three sources disagreed and none of
them was right — the live Terms of Use said **$2.99**, the App Store
description said **$4.99**, and the real, ASC-configured price was **$9.99**.
Three sources, three numbers, none correct. The only source of truth is the
ASC API queried at the time of the edit.

---

## Design

`styles.css` implements the "Solar Noon" palette — a sky-to-amber gradient
derived from the app icon, plus a five-band UV-severity ramp taken directly
from `UVLevel.swift` in the iOS app so the site's colours never drift from
the app's.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` / `--bg-alt` | `#FFFFFF` / `#F6FAFD` | near-black | Page background / tinted section background |
| `--ink` / `--ink-soft` | `#0F2B46` / `#4B6580` | near-white / soft blue-grey | Body text / secondary text |
| `--accent` | `#9A6414` | `#FFC65C` | Kicker eyebrows, links |
| `--sky` / `--sun` | `#4EB3E8` / `#F5A623` | same (literal, unthemed) | Hero gradient — identical in both schemes by design |
| `--uv-low` … `--uv-extreme` | `#3EC46D` → `#9B59B6` (WHO order) | same (literal) | The five-band UV ribbon, matching `UVLevel.swift` |

Bands that must stay dark in both colour schemes (`.vow`, `.foot`) use
literal ink values rather than the themed tokens, since flipping to
`var(--ink)` in dark mode would put dark text on a dark ground.

Every foreground/background pair used anywhere on the site is required to
clear **WCAG AA**: 4.5:1 for body text, 3:1 for large text and UI borders, in
both light and dark. This is enforced by `contrast.py` — see "Verifying
changes" below.

---

## Verifying changes

**The verification harness is NOT part of this repo.** It lives in the iOS
app repo, at `tools/support-site-verify/`, alongside a frozen `baseline/`
copy of the pre-redesign pages. This keeps the published site a plain static
bundle with nothing but content in it — same convention as Pew Pal. If you're
picking this project back up, you need that harness checked out locally; it
is not published anywhere.

Four small Python scripts, no dependencies beyond the standard library:

| Script | What it checks |
|---|---|
| `contrast.py <styles.css>` | Reads foreground/background token pairs live from `:root` and the dark-scheme block, plus a fixed list of brand/WHO colours that aren't tokens (hero ink on sky/sun, the five UV-ribbon ink-on-band pairs), and checks each against its WCAG floor (4.5:1 text, or the pair's stated floor). Exits 1 and prints every failing pair with its measured ratio. |
| `links.py <baseline.html> <new.html>` | Exits 1 if any outbound (`http://`, `https://`, `mailto:`) link present in the baseline page is missing from the new page — *unless* the dropped URL is in the script's `INTENTIONALLY_REMOVED` map (URL → a required, written reason), in which case it still prints, with its reason, so a reader can tell a deliberate removal from a regression, but does not fail the gate. New links are always fine; only unacknowledged losses fail. Currently one entry: `https://open-meteo.com`, dropped because the old Privacy Policy falsely named Open-Meteo as the weather provider (the app uses Apple WeatherKit). Anyone adding an entry must supply a reason. |
| `parity.py <page.html>` | Exits 1 unless the `en`, `pt`, and `es` `[data-lang]` sections of a page have matching counts of headings (`h1`/`h2`/`h3`), `<article>`, `<details>`, and `<a href>` elements — catches a language section missing a block the others have. It also detects a **duplicate `[data-lang]` value** (two sibling sections claiming the same language) and fails immediately, naming the duplicated language, rather than silently averaging over it. |
| `assets.py <file>…` | Exits 1 if any given file references a third-party subresource the browser would fetch: `script src`, `link href`, `img src`, `iframe`/`video`/`audio`/`source`/`embed` `src`, `object data`, `@import`, or CSS `url()` — and, separately, every candidate inside an `srcset` list, since one remote candidate there can be third-party even when the plain `src` is local. A **protocol-relative URL** (`//host/...`) is treated as third-party everywhere a `https://` URL would be, since the browser fetches both off-origin. Outbound `<a href>` links are not subresources and are allowed. |

None of the above catches everything. Rendering issues (horizontal overflow
at narrow viewports, whether the language tabs actually work with JS on and
off, whether an anchor like `#espanol` selects the right section on load)
need a real browser — those were checked with Playwright against a local
server rather than a committed script, since headless-browser tooling
doesn't belong in a static site's repo either.

---

## Editing notes

- No Jekyll config, no dependencies, no CI. Edit the HTML, push to `main`,
  Pages rebuilds within a minute.
- Keep the three language sections (`en`/`pt`/`es`) in sync when editing any
  one of them — same headings, same structural elements, same links. That's
  what `parity.py` and `links.py` check for.
- **"SolShield" is never translated** — it appears identically in all three
  languages, everywhere.
- Portuguese is pt-BR. **Spanish is es-ES, using the formal *usted* register**
  — not the informal *tú*.
- A copy of these pages is mirrored in the iOS app repo under
  `solshield-support-website/` for reference. **This repo's root is the
  deploy source** — the mirror is not published and must be re-synced by hand
  after any change here.

---

## Contact

Support email: **braniapps@gmail.com**

---

_All URLs above verified returning HTTP 200 on 2026-07-28._
