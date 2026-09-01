/* MacNexus — Interaktion: Navigation, Scroll-Reveal, FAQ, Formular */
(function () {
  "use strict";

  /* ---------- Mobile-Navigation ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    // Menü schließen, wenn ein Link angeklickt wird
    nav.querySelectorAll(".nav__menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Beim Wechsel auf Desktop-Breite aufräumen
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---------- Scroll-Reveal ---------- */
  var revealables = document.querySelectorAll(".reveal");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reduced) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.dataset.revealDelay || "0", 10);
        setTimeout(function () { el.classList.add("is-in"); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- FAQ-Akkordeon ---------- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var btn = item.querySelector(".faq__q");
    var panel = item.querySelector(".faq__a");
    if (!btn || !panel) return;

    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      // Andere Einträge in derselben FAQ schließen
      var group = item.closest(".faq");
      if (group) {
        group.querySelectorAll(".faq__item.is-open").forEach(function (other) {
          if (other === item) return;
          other.classList.remove("is-open");
          other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq__a").style.maxHeight = "0px";
        });
      }

      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : "0px";
    });
  });

  // Höhen nach Resize korrigieren
  window.addEventListener("resize", function () {
    document.querySelectorAll(".faq__item.is-open .faq__a").forEach(function (panel) {
      panel.style.maxHeight = panel.scrollHeight + "px";
    });
  });

  /* ---------- Zahlen hochzählen ---------- */
  var counters = document.querySelectorAll("[data-count-to]");
  if (counters.length && "IntersectionObserver" in window && !reduced) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.dataset.countTo);
        var suffix = el.dataset.countSuffix || "";
        var prefix = el.dataset.countPrefix || "";
        var dur = 1100;
        var start = performance.now();

        function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          var shown = Number.isInteger(target)
            ? Math.round(val).toLocaleString("de-AT")
            : val.toFixed(1).replace(".", ",");
          el.textContent = prefix + shown + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Einstellungen ---------- */
  var cfg = window.MACNEXUS_CONFIG || {};
  var mail = cfg.email || "office@macnexus.at";

  /* ---------- Buchungslinks ----------
     Buttons mit data-booking="support" bzw. "business" bekommen den
     Link aus config.js. Ist dort nichts hinterlegt, bleibt der im HTML
     stehende Fallback (kontakt.html) unangetastet — die Seite
     funktioniert also in jedem Fall. */
  document.querySelectorAll("[data-booking]").forEach(function (el) {
    var kind = el.dataset.booking;
    var url = kind === "business" ? cfg.bookingBusiness : cfg.bookingSupport;
    if (!url) return;

    el.href = url;
    el.target = "_blank";
    el.rel = "noopener";

    // Beschriftung anpassen: aus "anfragen" wird "buchen"
    var label = el.dataset.bookingLabel;
    if (label) el.textContent = label;
  });

  // Zusatzhinweis „Lieber erst schreiben?" nur zeigen, wenn wirklich
  // gebucht werden kann — sonst wäre er sinnlos.
  if (cfg.bookingSupport || cfg.bookingBusiness) {
    document.querySelectorAll("[data-booking-alt]").forEach(function (el) {
      el.hidden = false;
    });
  }

  /* ---------- Formularversand ---------- */
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var status = form.querySelector(".form__status");

    function show(text, ok) {
      if (!status) return;
      status.classList.add("is-visible");
      status.classList.toggle("form__status--ok", ok !== false);
      status.classList.toggle("form__status--error", ok === false);
      status.textContent = text;
      status.setAttribute("role", "status");
      status.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      // Kein Key hinterlegt -> ehrlicher Hinweis statt stiller Verlust
      if (!cfg.web3formsKey) {
        show(
          "Der automatische Versand ist noch nicht eingerichtet — deine " +
          "Anfrage wurde deshalb nicht abgeschickt. Schreib mir bitte " +
          "direkt an " + mail + ", dann melde ich mich innerhalb " +
          "eines Werktags.",
          false
        );
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      var btnText = btn ? btn.textContent : "";
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Wird gesendet …";
      }

      var data = new FormData(form);
      data.append("access_key", cfg.web3formsKey);
      data.append("subject", form.dataset.formSubject || "Neue Anfrage über macnexus");
      data.append("from_name", "MacNexus Website");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            show(
              "Danke für deine Anfrage! Sie ist bei mir angekommen. " +
              "Du bekommst innerhalb eines Werktags eine Antwort mit " +
              "Terminvorschlägen."
            );
            form.reset();
          } else {
            throw new Error(res && res.message ? res.message : "unbekannt");
          }
        })
        .catch(function () {
          show(
            "Das Absenden hat leider nicht funktioniert. Bitte versuch es " +
            "noch einmal oder schreib mir direkt an " + mail + ".",
            false
          );
        })
        .then(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = btnText;
          }
        });
    });
  });

  /* ---------- Jahr im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
