/* MacNexus — Cookie-/Einwilligungs-Banner
   Aktuell setzt die Seite keine Tracking- oder Marketing-Cookies. Das Banner ist
   die Grundlage dafür, dass später (z. B. Google Ads) nichts ohne Einwilligung
   geladen wird: Skripte, die eine Einwilligung brauchen, hängen sich über
   window.macnexusConsent.onAccept(fn) ein und laufen erst nach "Akzeptieren". */
(function () {
  "use strict";

  var KEY = "macnexus-consent";          // "accepted" | "declined"
  var listeners = [];

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  window.macnexusConsent = {
    get: function () { return read(); },
    onAccept: function (fn) {
      if (read() === "accepted") { fn(); } else { listeners.push(fn); }
    }
  };

  var banner = null;

  function close() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }

  function decide(value) {
    write(value);
    close();
    if (value === "accepted") {
      listeners.splice(0).forEach(function (fn) { try { fn(); } catch (e) {} });
    }
  }

  function open() {
    if (banner) return;
    banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie-Einstellungen");
    banner.innerHTML =
      '<p class="cookie-banner__text"><strong>Deine Privatsphäre.</strong> ' +
      'Diese Seite nutzt nur technisch notwendige Speicherung (z. B. dein Farbschema). ' +
      'Cookies für Statistik oder Werbung setzen wir nur, wenn du zustimmst. ' +
      '<a href="datenschutz.html#cookies">Mehr dazu</a></p>' +
      '<div class="cookie-banner__actions">' +
      '<button type="button" class="btn btn--ghost" data-consent="declined">Ablehnen</button>' +
      '<button type="button" class="btn btn--ghost" data-consent="accepted">Akzeptieren</button>' +
      '</div>';
    banner.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-consent")) {
        decide(t.getAttribute("data-consent"));
      }
    });
    document.body.appendChild(banner);
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.hasAttribute && t.hasAttribute("data-cookie-settings")) {
        e.preventDefault();
        open();
        return;
      }
      t = t.parentNode;
    }
  });

  function init() { if (!read()) open(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
