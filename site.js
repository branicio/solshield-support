(function () {
  // Set first: styles.css only hides languages once this is present, so a
  // script error before this line (e.g. a parse failure) degrades to all
  // three languages shown stacked, never to none. Everything AFTER it runs
  // inside the try/catch below, whose catch removes this very attribute:
  // it is what authorises the stylesheet to hide any [data-lang] section,
  // so any failure to complete setup must withdraw that authorisation
  // rather than leave content hidden with nothing left running to recover
  // it. Showing the wrong language is a cosmetic bug; showing none would
  // hide a legal document from a user or an App Store reviewer.
  document.documentElement.dataset.js = "on";

  try {
    var HASH = { portugues: "pt", espanol: "es", top: "en" };
    var LANG_ATTR = { en: "en", pt: "pt-BR", es: "es-ES" };
    var FRAGMENT = { pt: "#portugues", es: "#espanol", en: "" };
    var STORE_KEY = "solshield.lang";
    // The three real pages of this site, keyed by filename. Everything else an
    // <a> can point at — mailto:, the App Store listing, apple.com/legal, the
    // skip link's #main — is deliberately absent: a language fragment on those
    // is meaningless at best and breaks the target at worst.
    var PAGES = { "index.html": true, "privacy.html": true, "terms.html": true };

    // Written as a function rather than a map lookup so that no inherited
    // Object property ("constructor", "toString", ...) can masquerade as a
    // valid stored language.
    function isLang(v) { return v === "en" || v === "pt" || v === "es"; }

    var sections = Array.prototype.slice.call(document.querySelectorAll("[data-lang]"));
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));

    // Structural wiring stamped on at load time. The HTML need only provide
    // data-lang on each section and role="tab" + data-lang-target on each
    // control; a hand-authored id could collide with one generated here.
    var firstSectionIdForLang = {};
    sections.forEach(function (s, i) {
      s.setAttribute("role", "tabpanel");
      if (!s.id) s.id = "lang-panel-" + (s.dataset.lang || i) + "-" + i;
      if (!(s.dataset.lang in firstSectionIdForLang)) {
        firstSectionIdForLang[s.dataset.lang] = s.id;
      }
    });
    tabs.forEach(function (t) {
      var id = firstSectionIdForLang[t.dataset.langTarget];
      if (id) t.setAttribute("aria-controls", id);
    });

    // Capture each translatable element's authored text once, before any
    // switch can overwrite it, so PT -> ES on an element with no
    // data-i18n-es restores the English baseline instead of leaving stale
    // Portuguese on screen.
    var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-en]"));
    i18nEls.forEach(function (el) { el.dataset.i18nBaseline = el.textContent; });

    // The same channel for aria-label. A label is text a screen-reader user
    // hears, so on a trilingual site it has to speak their language; but it is
    // an attribute, not textContent, so the loop above cannot carry it. Only
    // the shared chrome needs this — inside a [data-lang] section a label is
    // already translated by duplication. "[data-i18n-aria-en]" and
    // "[data-i18n-en]" are distinct attribute names, so the two sets never
    // overlap. Baseline is captured here, before any switch, for the same
    // reason as above.
    var i18nAriaEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-aria-en]"));
    i18nAriaEls.forEach(function (el) {
      el.dataset.i18nAriaBaseline = el.getAttribute("aria-label") || "";
    });

    // In-site page links, collected once: the nav, the brand marks, the three
    // footers and the cross-references inside the prose. apply() rewrites
    // their fragment so the reader's language survives the click. Absolute
    // and scheme-bearing hrefs (mailto:, https:, protocol-relative //host)
    // drop out before the filename test, so an external URL can never be
    // rewritten just because its path happens to end in one of our filenames.
    var pageLinks = [];
    Array.prototype.slice.call(document.querySelectorAll("a[href]")).forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("//") === 0 || /^[a-z][a-z0-9+.\-]*:/i.test(href)) return;
      var path = href.split("#")[0];
      // Compare only the last path segment, so "privacy.html" and
      // "./privacy.html" both match; a fragment-only href ("#main") leaves an
      // empty path and is skipped.
      var file = path.substring(path.lastIndexOf("/") + 1).toLowerCase();
      if (PAGES[file] === true) pageLinks.push({ el: a, path: path });
    });

    // Storage is probed behind its OWN try/catch, never the outer one. Safari
    // private mode and some privacy settings make even *reading*
    // window.localStorage throw, and others hand back an object that throws on
    // setItem — so the access and a round-trip are both proved here. If such an
    // exception were allowed to reach the outer catch it would withdraw
    // data-js and drop every page into the stacked no-JS presentation, turning
    // "we cannot remember your choice" into a visible regression on a legal
    // document. A storage failure must degrade to no memory, and nothing more.
    function openStore(name) {
      try {
        var s = window[name];
        var probe = "solshield.probe";
        s.setItem(probe, "1");
        s.removeItem(probe);
        return s;
      } catch (e) {
        return null;
      }
    }
    var store = openStore("localStorage") || openStore("sessionStorage") || null;

    function readStored() {
      if (!store) return null;
      try {
        var v = store.getItem(STORE_KEY);
        // Anything that is not one of the three languages — hand-edited, left
        // by an older build, corrupted — is ignored rather than trusted.
        return isLang(v) ? v : null;
      } catch (e) {
        return null;
      }
    }

    function remember(lang) {
      if (!store || !isLang(lang)) return;
      try { store.setItem(STORE_KEY, lang); } catch (e) { /* no memory, no harm */ }
    }

    function pick() {
      // Order matters, and the first two are the non-obvious part.
      //
      // A language named in the URL outranks the stored preference on purpose:
      // #portugues / #espanol / #top is an explicit, per-visit request — that
      // link was shared precisely to land the reader in that language — while
      // the stored value only records what this browser chose last time. If
      // memory won, a Portuguese reader could never open a Spanish link a
      // friend sent them, which is a worse bug than the one being fixed.
      var h = (location.hash || "").replace("#", "").toLowerCase();
      if (HASH[h]) return HASH[h];
      var stored = readStored();
      if (stored) return stored;
      var n = (navigator.language || "en").toLowerCase();
      if (n.indexOf("pt") === 0) return "pt";
      if (n.indexOf("es") === 0) return "es";
      return "en";
    }

    // A requested language with no section falls back to "en"; if even "en"
    // has no section, the first [data-lang] in document order wins. This is
    // what makes "zero active sections" impossible.
    function resolveLang(lang) {
      var i;
      for (i = 0; i < sections.length; i++) {
        if (sections[i].dataset.lang === lang) return lang;
      }
      for (i = 0; i < sections.length; i++) {
        if (sections[i].dataset.lang === "en") return "en";
      }
      return sections.length ? sections[0].dataset.lang : "en";
    }

    function apply(lang, updateHash) {
      lang = resolveLang(lang);

      var activated = false;
      sections.forEach(function (s) {
        // Two sections sharing one data-lang (a markup bug) must still yield
        // exactly one active panel: only the first match wins.
        var on = !activated && s.dataset.lang === lang;
        if (on) activated = true;
        s.toggleAttribute("data-lang-active", on);
        if (on) s.removeAttribute("aria-hidden");
        else s.setAttribute("aria-hidden", "true");
      });

      tabs.forEach(function (t) {
        var on = t.dataset.langTarget === lang;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });

      i18nEls.forEach(function (el) {
        var v = el.getAttribute("data-i18n-" + lang);
        el.textContent = v != null ? v : el.dataset.i18nBaseline;
      });

      i18nAriaEls.forEach(function (el) {
        var v = el.getAttribute("data-i18n-aria-" + lang);
        var next = v != null ? v : el.dataset.i18nAriaBaseline;
        // An empty label is worse than none: it would silence an element the
        // author meant to name. Fall back to removing the attribute instead.
        if (next) el.setAttribute("aria-label", next);
        else el.removeAttribute("aria-label");
      });

      document.documentElement.lang = LANG_ATTR[lang] || lang;

      // Carry the language on to the next page. This is deliberately separate
      // from the stored preference rather than a duplicate of it: it is what
      // makes a copied URL, a middle-click and "open in new tab" arrive in the
      // right language, and it is the *only* mechanism left when storage is
      // blocked. English is the site default, so its links carry no fragment —
      // a clean URL is the better thing to copy, and pick() reaches "en" on
      // its own once nothing else claims the page.
      var linkFrag = FRAGMENT[lang] != null ? FRAGMENT[lang] : "";
      pageLinks.forEach(function (l) {
        l.el.setAttribute("href", l.path + linkFrag);
      });

      if (updateHash) {
        history.replaceState(null, "", lang === "en" ? "#top" : FRAGMENT[lang]);
      }

      // Returned so callers acting on an explicit signal can persist the
      // language that actually took effect, not the one they asked for: a page
      // missing a section falls back in resolveLang, and storing the fallback
      // keeps memory and screen in agreement.
      return lang;
    }

    // A tab click and an arrow-key move are both explicit choices, so both are
    // remembered.
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { remember(apply(t.dataset.langTarget, true)); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus(); remember(apply(next.dataset.langTarget, true));
      });
    });

    var initialHash = (location.hash || "").replace("#", "").toLowerCase();
    var initialLang = apply(pick(), false);
    // Persist only what the reader actually asked for. Landing on a URL that
    // names a language counts; a language merely inferred from
    // navigator.language does not, and must never be written back — freezing a
    // first-time visitor's browser locale into storage would make every later
    // visit act as though they had chosen it, which is exactly the kind of
    // sticky wrong answer this feature exists to avoid.
    if (HASH[initialHash]) remember(initialLang);
    // Only re-derive the language when the new hash actually names one of the
    // three language anchors (#top / #portugues / #espanol). Any other
    // in-page anchor — including the skip link's #main — must leave the
    // reader's current language alone: falling through to pick()'s
    // navigator.language branch on every hashchange would silently switch a
    // PT/ES reader who clicks an ordinary anchor to whatever the browser's
    // locale says.
    // Arriving at a language anchor is an explicit signal too, so it is
    // remembered on the same terms as a tab click.
    window.addEventListener("hashchange", function () {
      var h = (location.hash || "").replace("#", "").toLowerCase();
      if (HASH[h]) remember(apply(HASH[h], false));
    });

  } catch (err) {
    // Setup did not complete, so withdraw the authorisation data-js grants
    // the stylesheet to hide content: without it, the no-JS branch takes
    // over and all three languages render stacked. Never rethrow past here.
    document.documentElement.removeAttribute("data-js");
    console.error("site.js: language-tab setup failed, falling back to no-JS presentation", err);
  }
})();
