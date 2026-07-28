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

    function pick() {
      var h = (location.hash || "").replace("#", "").toLowerCase();
      if (HASH[h]) return HASH[h];
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

      if (updateHash) {
        var frag = lang === "pt" ? "#portugues" : lang === "es" ? "#espanol" : "#top";
        history.replaceState(null, "", frag);
      }
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { apply(t.dataset.langTarget, true); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus(); apply(next.dataset.langTarget, true);
      });
    });

    apply(pick(), false);
    // Only re-derive the language when the new hash actually names one of the
    // three language anchors (#top / #portugues / #espanol). Any other
    // in-page anchor — including the skip link's #main — must leave the
    // reader's current language alone: falling through to pick()'s
    // navigator.language branch on every hashchange would silently switch a
    // PT/ES reader who clicks an ordinary anchor to whatever the browser's
    // locale says.
    window.addEventListener("hashchange", function () {
      var h = (location.hash || "").replace("#", "").toLowerCase();
      if (HASH[h]) apply(HASH[h], false);
    });

  } catch (err) {
    // Setup did not complete, so withdraw the authorisation data-js grants
    // the stylesheet to hide content: without it, the no-JS branch takes
    // over and all three languages render stacked. Never rethrow past here.
    document.documentElement.removeAttribute("data-js");
    console.error("site.js: language-tab setup failed, falling back to no-JS presentation", err);
  }
})();
