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
| `index.html` | Home page — six-language landing page (English → Português → Español → Français → Italiano → Deutsch stacked sections): hero, UV-level ribbon, feature grid, science card, skin-type reference, FAQ, contact card |
| `privacy.html` | Privacy Policy, same six-language structure |
| `terms.html` | Terms of Use, same six-language structure, including the subscription pricing section |
| `styles.css` | The one stylesheet for all three pages: Solar Noon design tokens (colour, type, spacing), nav/hero/card/footer components, the `[data-lang]` show/hide rules and their no-JS fallback, and the `[data-rise]` load-in animation (disabled under `prefers-reduced-motion`) |
| `site.js` | Language-tab controller — see "Languages and anchors" below. No other behaviour lives here |
| `fonts/Inter-latin.woff2` | Self-hosted variable Inter, latin subset — see "Self-hosted font" below |
| `fonts/OFL.txt` | The SIL Open Font License covering Inter — required attribution, must ship alongside the font |
| `badges/app-store-{en-us,pt-br,es-es,fr-fr,it-it,de-de}.svg` | Vendored App Store badge artwork, one per language — see "Vendored store badges" below |
| `app-icon.png` | Shared app-icon asset used as the favicon and the nav/footer brand mark on every page |
| `README.md` | This file |
| `.gitignore` | Ignores `.DS_Store` |

---

## Vendored store badges (`badges/`)

The site loads **no third-party subresource anywhere** — the font, the app
icon, and the six App Store badges are all served from this repo. The
badges are Apple's own artwork, downloaded byte-for-byte from:

| File | Source |
|---|---|
| `badges/app-store-en-us.svg` | `https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83` |
| `badges/app-store-pt-br.svg` | …same with `/pt-br` |
| `badges/app-store-es-es.svg` | …same with `/es-es` |
| `badges/app-store-fr-fr.svg` | …same with `/fr-fr` |
| `badges/app-store-it-it.svg` | …same with `/it-it` |
| `badges/app-store-de-de.svg` | …same with `/de-de` |

The French and Italian badges were added on 2026-10-30 (SolShield 1.2.0),
downloaded fresh from the endpoint that day; their bytes are identical to the
copies Pew Pal's support site already ships (`cmp` clean, same SHA-256).
The German badge was added on 2026-11-03 (SolShield 1.3.0), downloaded
byte-for-byte from the `/de-de` endpoint that day (its embedded title is
`Download_on_the_App_Store_Badge_DE_RGB_blk_092917`) and committed
unchanged; its alt text is „Laden im App Store“.

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
| `fonts/Inter-latin.woff2` | Inter | Variable, `wght` axis 100–900 (518 glyphs) | Latin subset only — the site's English/Portuguese/Spanish/French/Italian/German content needs no `latin-ext` coverage |

Inter is SIL Open Font License (OFL) 1.1 — see `fonts/OFL.txt`, which the OFL
requires to travel alongside the font. 47 KB total.

French and Italian coverage was checked against the font's cmap with
fontTools on 2026-10-30: every letter the two languages use is present
(à â ç é è ê ë î ï ô œ ù û ü ÿ, À Â Ç È É Ê Î Ì Ò Ô Ù Û Œ), as are « » ’ and
U+00A0 (no-break space). Two things are **not** in the subset: U+202F
(narrow no-break space) and Ÿ. French spacing before `:` `;` `?` `!` and
inside « » therefore uses `&nbsp;` (U+00A0), never U+202F, which would fall
back to a system font. (`→` and `≈`, already used by every language's
copy, also fall back — that predates French and Italian.)

German coverage was checked the same way on 2026-11-03: ä ö ü Ä Ö Ü ß,
the German quotes „ “ (U+201E, U+201C), the en dash – and U+00A0 are all
present. U+00AD (soft hyphen) and U+2011 (no-break hyphen) are **not**. The
German page titles carry one soft hyphen each (`Datenschutz&shy;erklärung`,
`Nutzungs&shy;bedingungen`) so that a phone breaks them at the compound
boundary instead of mid-word; that needs no glyph of its own, because the
browser draws the font's ordinary U+002D at the break. U+2011 is not used:
the home page says "Vorhersage stündlich und für 7&nbsp;Tage" rather than
"7-Tage-Vorhersage" in the feature heading, which otherwise broke after
"7-".

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
six-language page** (English → Português → Español → Français → Italiano →
Deutsch), with the same six anchors:

| Anchor | Language | `lang` attribute site.js sets |
|---|---|---|
| `#top` | English | `en` |
| `#portugues` | Português (pt-BR) | `pt-BR` |
| `#espanol` | Español (es-ES) | `es-ES` |
| `#francais` | Français (fr-FR) | `fr-FR` |
| `#italiano` | Italiano (it-IT) | `it-IT` |
| `#deutsch` | Deutsch (de-DE) | `de-DE` |

Example: https://branicio.github.io/solshield-support/terms.html#espanol

`#francais` and `#italiano` are the anchor names Pew Pal's support site uses
for the same two languages, so the portfolio's sites deep-link alike.
`#deutsch` (added 2026-11-03 for SolShield 1.3.0) follows the same rule —
the language's own name, lower case, ASCII — and is the fragment the app's
German links open.

Six tabs (since 2026-11-03) need ~270px at full padding, which no phone row
beside the brand has, so every viewport up to 840px uses a compact tab (8px
side padding, `.04em` tracking, ~203px for all six; each tab is still ~32 ×
30px). With it, the tabs fit beside the brand at 362px and wider (375px
included); at 361px and below the tablist wraps onto a nav row of its own, so
the phone nav grows from 96px to 129px. `styles.css` raises `--nav-h` to
131px at `max-width: 370px` (it was 360px with five tabs) so `[id]`'s
scroll-margin-top keeps clearing it. Just above the 760px phone breakpoint,
French's longer nav labels pushed the tabs onto a second row at 761-781px, so
the link gap tightens to 14px between 761 and 840px; the sixth tab needs the
compact tabs there too. German's nav link to the Terms reads "Bedingungen",
as French reads "Conditions" and Italian "Condizioni": the full
"Nutzungsbedingungen" (~150px) cannot fit that row; the footer and the page
title keep the full name. Measured 2026-11-03 in headless Chromium, every
page, all six languages: a one-row 63px nav at 761-1440px, 95.9px at
362-760px, 129.3px at 320-361px, and no horizontal scroll anywhere from 320px
up.

> **Store listings use the BASE URLs above with no `#anchor` deep-links.**
> `/privacy` and `/terms` are what's registered in App Store Connect (see
> "Live URLs" above), and that registration is locale-independent — every
> storefront points at the same base URL. If anchor deep-linking is ever
> adopted for locale-specific submission fields, it must be a planned,
> coordinated change, not a quiet edit to these pages.

### How the language tabs work (`site.js`)

Each page renders all six languages as sibling `<section data-lang="en|pt|es|fr|it|de">`
elements inside `<main>`. `site.js` is what turns that into a tabbed view:

- On load, `pick()` (site.js:127-149) resolves a language in this order: an
  explicit language named in `location.hash` (`#top` → en, `#portugues` → pt,
  `#espanol` → es, `#francais` → fr, `#italiano` → it, `#deutsch` → de) beats
  the stored preference (see below), which beats `navigator.language` (any
  `pt*`, `es*`, `fr*`, `it*` or `de*` locale maps to that language — `de-DE`,
  `de-AT`, `de-CH` all read German), which falls back to English. The hash wins on
  purpose: a link was shared precisely to land the reader in that language,
  so a deep link to `#espanol` still overrides a stored Portuguese
  preference — if memory won instead, a Portuguese reader could never open a
  Spanish link a friend sent them.
- Clicking a language tab (`role="tab"`, `EN`/`PT`/`ES`/`FR`/`IT`/`DE` in the
  nav, each with its endonym as `aria-label`) shows that language's section,
  hides the other five (`data-lang-active` +
  `aria-hidden`), sets `document.documentElement.lang`, and updates
  `location.hash` via `history.replaceState` (so the URL becomes shareable
  without adding a back-button entry per click).
- Left/Right arrow keys move focus and selection between tabs, wrapping at
  the ends — standard ARIA tablist behaviour.
- A `hashchange` listener re-applies the language **only when the new hash is
  one of the six language anchors** (`#top`/`#portugues`/`#espanol`/
  `#francais`/`#italiano`/`#deutsch`).
  Any other in-page anchor — including the skip link's `#main` — leaves the
  reader's current language alone. Falling through to `navigator.language` on
  every hashchange would otherwise silently switch a PT/ES/FR/IT/DE reader to whatever
  the browser's locale says the moment they clicked an ordinary anchor.

### Persisting the language across page navigation

Before this was fixed, a reader's language choice was lost on every page
load: nav links were bare (`href="privacy.html"`) and `pick()` fell straight
through to `navigator.language`, so a Portuguese reader clicking
"Privacidade" landed back in English. Two independent mechanisms now carry
the choice forward. Both exist because neither alone covers every way a
reader actually gets from one page to the next:

1. **A stored preference.** `openStore()` (site.js:97-107) probes
   `localStorage` with a real `setItem`/`removeItem` round-trip — not just a
   presence check — and falls back to `sessionStorage`, and finally to no
   persistence at all if both throw. `remember(lang)` (site.js:122-125)
   writes the choice to whichever store won, under `STORE_KEY =
   "solshield.lang"`; `readStored()` (site.js:110-120) reads it back,
   discarding anything that isn't exactly `"en"`/`"pt"`/`"es"`/`"fr"`/`"it"`/`"de"` (a hand-edited
   or stale value is ignored rather than trusted). Crucially, only an
   **explicit** choice is ever stored — a tab click, an arrow-key move, or
   landing on a URL that names a language — never a language merely inferred
   from `navigator.language`. Storing an inferred value would freeze a
   first-time visitor's browser locale into memory permanently, making every
   later visit behave as if they had chosen it.
2. **Language-tagged in-site links.** On every language change, `apply()`
   (site.js:201-211) rewrites the `href` of every nav/footer/brand link that
   points at `index.html`, `privacy.html` or `terms.html` to carry the active
   language's fragment (`#portugues`, `#espanol`, `#francais`, `#italiano`,
   `#deutsch`; English gets no fragment,
   since it's the default and `pick()` reaches it on its own). The link set
   is collected once up front (site.js:71-87); `mailto:` links, external
   links, and the skip link's `#main` are excluded there and are never
   rewritten.

**Why both exist:** storage is what saves a reader who types or bookmarks a
bare URL with no fragment — the link-tagging mechanism has nothing to rewrite
in that case. The fragments are what save a reader who copies a link,
middle-clicks, or opens a page in a new tab, none of which carries
`sessionStorage` along, and any of which can land on a browser with storage
blocked entirely. Together, the language survives even if one mechanism is
completely unavailable.

**The separate `try`/`catch` is the subtle part.** Storage access
(`openStore`, site.js:97-107) is wrapped in its own `try`/`catch`, isolated
from the script's outer one (site.js:13-266). Safari private mode — and some
privacy settings in other browsers — make `localStorage` *throw on access*,
not just silently refuse to persist. If that exception reached the outer
`catch`, it would remove `data-js` (site.js:264), which is what authorises
`styles.css` to hide inactive `[data-lang]` sections — removing it drops the
page into the no-JS presentation, all six languages rendered stacked at
once. That would turn "we can't remember your choice" into a visible
regression on a page that, for `privacy.html` and `terms.html`, is a legal
document. So a storage failure must degrade to "no memory" and nothing more.
This was verified with both `localStorage` and `sessionStorage` throwing on
every call: `data-js` stayed `"on"` and the language still persisted
correctly across pages via the link fragments alone.

### The no-JS fallback

`site.js` sets `document.documentElement.dataset.js = "on"` as its very
first statement, before anything else runs. `styles.css` hides inactive
`[data-lang]` sections **only** under the scope `html[data-js="on"]
[data-lang] { display: none; }` — there is no rule anywhere in the stylesheet
that hides `[data-lang]` content outside that scope. Together, that means:

- With JavaScript disabled entirely, `data-js` is never set, the CSS hiding
  rule never matches, and all six languages render stacked on one page, top
  to bottom — still fully readable, still fully linkable via
  `#top`/`#portugues`/`#espanol`/`#francais`/`#italiano`/`#deutsch` (the
  browser's native in-page anchor scroll works with zero script).
- If `site.js` throws partway through setup, its `catch` block explicitly
  *removes* `data-js` again and logs to `console.error` — it never rethrows —
  which hands control back to the same no-JS stylesheet branch.

So a missing, disabled, or broken script degrades to **all six languages
stacked and readable**, never to a blank page. That matters because two of
these three pages are legal documents a user, or an App Store reviewer, must
be able to read regardless of what their browser or network does with the
script.

---

## Where prices appear

The section Pew Pal's README does not have. SolShield's prices appear in
exactly these twelve places (two per language):

| File | Languages | Location |
|---|---|---|
| `index.html` | en / pt / es / fr / it / de | FAQ item 1 — "What does SolShield cost?" |
| `terms.html` | en / pt / es / fr / it / de | Subscription section — "Plans and prices" ("Formules et prix" / "Piani e prezzi" / "Abos und Preise") |

Current values, **verified against the App Store Connect API on
2026-07-28 and re-verified unchanged on 2026-10-30 and 2026-11-03** (USA territory;
annual `6757970517` at $9.99 since 2026-05-09, monthly `6758952296` at
$0.99, each with a one-week `FREE_TRIAL` introductory offer):
**$9.99/year**, **$0.99/month**, both with a **7-day free trial**. Every one
of the twelve locations above must state exactly these numbers, in USD, in
every language — written `$9.99` / `$0.99` with a decimal point in all six
(German too: never "9,99 $"), exactly as the Portuguese and Spanish sections
always have, so a grep for the amount finds every copy.

The plan names in the Terms are the App Store purchase-sheet names (ASC
subscription localizations): "SolShield Premium" for the annual plan in
every language, and "SolShield Premium (Monthly)" / "(Mensal)" /
"(Mensual)" / "(Mensuel)" / "(Mensile)" / "(Monatlich)" for the monthly
one. The French and Italian names were written for 1.2.0, the German one
(from the German glossary) for 1.3.0; check them against the fr-FR, it and
de-DE subscription localizations in ASC whenever those change. The German
copies, added 2026-11-03, repeat the amounts above unchanged.

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
| `parity.py <page.html>` | Exits 1 unless the `en`, `pt`, `es`, `fr`, `it` and `de` `[data-lang]` sections of a page have matching counts of headings (`h1`/`h2`/`h3`), `<article>`, `<details>`, and `<a href>` elements — catches a language section missing a block the others have. It also detects a **duplicate `[data-lang]` value** (two sibling sections claiming the same language) and fails immediately, naming the duplicated language, rather than silently averaging over it. |
| `assets.py <file>…` | Exits 1 if any given file references a third-party subresource the browser would fetch: `script src`, `link href`, `img src`, `iframe`/`video`/`audio`/`source`/`embed` `src`, `object data`, `@import`, or CSS `url()` — and, separately, every candidate inside an `srcset` list, since one remote candidate there can be third-party even when the plain `src` is local. A **protocol-relative URL** (`//host/...`) is treated as third-party everywhere a `https://` URL would be, since the browser fetches both off-origin. Outbound `<a href>` links are not subresources and are allowed. |

None of the above catches everything. Rendering issues (horizontal overflow
at narrow viewports, whether the language tabs actually work with JS on and
off, whether an anchor like `#espanol`, `#italiano` or `#deutsch` selects the right section on load)
need a real browser — those were checked with Playwright against a local
server (most recently on 2026-11-03, for German) rather than a committed script, since headless-browser tooling
doesn't belong in a static site's repo either.

---

## Editing notes

- No Jekyll config, no dependencies, no CI. Edit the HTML, push to `main`,
  Pages rebuilds within a minute.
- Keep the six language sections (`en`/`pt`/`es`/`fr`/`it`/`de`) in sync when
  editing any one of them — same headings, same structural elements, same links. That's
  what `parity.py` and `links.py` check for.
- **"SolShield" is never translated** — it appears identically in all six
  languages, everywhere.
- Portuguese is pt-BR. **Spanish is es-ES, using the formal *usted* register**
  — not the informal *tú*.
- **French is fr-FR, using *vous*** throughout. French typography: a
  no-break space (`&nbsp;`) before `:` `;` `?` `!` and inside « », decimal
  commas in the formula (`1,5`, `10,5`); prices stay `$9.99` as above.
- **Italian is it-IT, using *tu* on every page** — the home page and FAQ
  (the app's own Italian register) and the two legal pages alike, as Apple
  Italia's own legal pages do, so a reader never changes register between
  pages. Quotation marks are « ».
- **German is de-DE, using *du* on every page**, the two legal pages
  included, as the app and Apple's own German pages do. It follows the
  binding German glossary in the iOS repo
  (`docs/superpowers/plans/2026-11-03-german-glossary.md`): ß, quotation
  marks „…“, a no-break space (`&nbsp;`) between a number and its unit
  (`7&nbsp;Tage`, `24&nbsp;Stunden`, `200&nbsp;J/m²`), decimal commas in the
  formula (`1,5`, `10,5`) and the spaced en dash – as the sentence dash;
  prices stay `$9.99` as above.
- The WHO bands and glossary are shared with the app's French, Italian and
  German strings: Faible / Modéré / Élevé / Très élevé / Extrême, Basso /
  Moderato / Alto / Molto alto / Estremo and Niedrig / Mittel / Hoch /
  Sehr hoch / Extrem; OMS; coup de soleil / scottatura / Sonnenbrand;
  phototype / fototipo / Hauttyp nach Fitzpatrick; Réglages / Impostazioni /
  Einstellungen; Sonnen-Timer; Datenschutzerklärung, Nutzungsbedingungen.
- **Describe only what the app does.** The app has no exposure-history
  feature: no model, no view, no strings. On 2026-10-30 the "Exposure
  history" feature card and every history claim (home FAQ, Privacy Policy,
  Terms §2) were removed from all five languages. The feature grid now holds
  eight cards, and `styles.css` lays it out 4 × 2 / 2 × 4 / 1 × 8, so a ninth
  card would need those column counts revisited. The Privacy Policy's
  storage list matches what the iOS app keeps on the device:
  - settings in UserDefaults;
  - saved locations in SwiftData (`SavedLocation`, the only `@Model`);
  - one snapshot of the latest UV reading and hourly forecast in the App
    Group container (`SharedDataManager`), overwritten on every update;
  - a cached subscription status.
- The Privacy Policy's GDPR paragraph names three supervisory authorities as
  examples, each linked: Spain's AEPD, France's CNIL and Italy's Garante.
  The German section names the same three, as the English does; adding a
  German authority would mean a new link in all six sections.
- A copy of these pages is mirrored in the iOS app repo under
  `solshield-support-website/` for reference. **This repo's root is the
  deploy source** — the mirror is not published and must be re-synced by hand
  after any change here.

---

## Contact

Support email: **braniapps@gmail.com**

---

_All URLs above verified returning HTTP 200 on 2026-07-28, and again on
2026-10-30._
