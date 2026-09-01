/* ============================================================
   MacNexus — Farbschema-Umschalter
   ------------------------------------------------------------
   Drei Zustände: "light", "dark", "system".
   Die Wahl wird im Browser der Besucher:innen gespeichert und
   gilt beim nächsten Besuch weiter.

   Das eigentliche Setzen passiert bereits im <head> jeder Seite
   (kleines Inline-Skript), damit die Seite nicht kurz in der
   falschen Farbe aufblitzt. Diese Datei baut nur die Bedienung.
   ============================================================ */
(function () {
  "use strict";

  var SPEICHER = "macnexus-theme";
  var STANDARD = "light";           // Voreinstellung für neue Besucher:innen

  function gespeichert() {
    try {
      var v = localStorage.getItem(SPEICHER);
      return (v === "light" || v === "dark" || v === "system") ? v : STANDARD;
    } catch (e) {
      return STANDARD;              // privater Modus o. Ä.
    }
  }

  function setze(modus) {
    document.documentElement.setAttribute("data-theme", modus);
    try { localStorage.setItem(SPEICHER, modus); } catch (e) {}

    // Farbe der Browserleiste mitziehen
    var dunkel = modus === "dark" ||
      (modus === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", dunkel ? "#000000" : "#ffffff");
    });

    document.querySelectorAll("[data-theme-btn]").forEach(function (b) {
      var aktiv = b.dataset.themeBtn === modus;
      b.classList.toggle("is-active", aktiv);
      b.setAttribute("aria-checked", aktiv ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-theme-btn]").forEach(function (b) {
    b.addEventListener("click", function () { setze(b.dataset.themeBtn); });
  });

  // Wechselt das Betriebssystem, während "systemangepasst" aktiv ist
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  var beiWechsel = function () {
    if (gespeichert() === "system") setze("system");
  };
  if (mq.addEventListener) mq.addEventListener("change", beiWechsel);
  else if (mq.addListener) mq.addListener(beiWechsel);

  setze(gespeichert());
})();
