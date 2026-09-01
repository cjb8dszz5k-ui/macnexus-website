/* ============================================================
   MacNexus — Terminplaner
   ------------------------------------------------------------
   Dreistufig: Termin-Art -> Tag & Uhrzeit -> Kontaktdaten.
   Läuft komplett im Browser; der gewählte Slot wird zusammen mit
   den Kontaktdaten per Web3Forms als E-Mail zugestellt.
   ============================================================ */
(function () {
  "use strict";

  var root = document.querySelector("[data-planer]");
  if (!root) return;

  var cfg = window.MACNEXUS_CONFIG || {};
  var P = cfg.planer || {};
  var mail = cfg.email || "office@macnexus.at";

  var TAGE   = P.tage || [1, 2, 3, 4, 5];
  var VORLAUF = typeof P.vorlaufTage === "number" ? P.vorlaufTage : 1;
  var HORIZONT = P.horizontTage || 42;
  var GESPERRT = P.gesperrteTage || [];

  var WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  var MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli",
                "August", "September", "Oktober", "November", "Dezember"];

  /* ---------- Termin-Arten ---------- */
  var ARTEN = {
    support: {
      titel: "1:1 Support-Session",
      dauer: "60 Minuten",
      minuten: 60,
      preis: "49,99 €",
      text: "Ein konkretes Thema, sauber gelöst und verständlich erklärt."
    },
    business: {
      titel: "Business-Erstgespräch",
      dauer: "30 Minuten",
      minuten: 30,
      preis: "kostenlos",
      text: "Unverbindlich klären, wo es im Betrieb hakt und was sinnvoll ist."
    }
  };

  /* ---------- Zustand ---------- */
  var state = {
    art: null,
    datum: null,        // Date-Objekt
    zeit: null,         // "HH:MM"
    monat: new Date()   // angezeigter Monat
  };
  state.monat.setDate(1);

  /* ---------- Hilfsfunktionen ---------- */
  function iso(d) {
    return d.getFullYear() + "-" +
           String(d.getMonth() + 1).padStart(2, "0") + "-" +
           String(d.getDate()).padStart(2, "0");
  }

  function heute() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function istWerktag(d) {
    var wt = d.getDay() === 0 ? 7 : d.getDay();   // So = 7
    if (wt === 6) return !!P.samstagAktiv;
    return TAGE.indexOf(wt) !== -1;
  }

  function zeitenFuer(d) {
    var wt = d.getDay() === 0 ? 7 : d.getDay();
    if (wt === 6) return P.zeitenSamstag || [];
    var z = (P.zeiten || {})[state.art];
    return z ? z.slice() : [];
  }

  function istBuchbar(d) {
    var min = heute();
    min.setDate(min.getDate() + VORLAUF);
    var max = heute();
    max.setDate(max.getDate() + HORIZONT);
    if (d < min || d > max) return false;
    if (!istWerktag(d)) return false;
    if (GESPERRT.indexOf(iso(d)) !== -1) return false;
    return zeitenFuer(d).length > 0;
  }

  function langesDatum(d) {
    return WOCHENTAGE[(d.getDay() === 0 ? 7 : d.getDay()) - 1] + ", " +
           d.getDate() + ". " + MONATE[d.getMonth()] + " " + d.getFullYear();
  }

  /* ---------- Kalendereintrag (.ics) ----------
     Erzeugt eine Datei im iCalendar-Format. Apple Kalender, Outlook und
     Google verstehen das direkt — ein Doppelklick genügt.
     Zeitzone fest auf Europe/Vienna, damit der Termin auch dann richtig
     liegt, wenn der Kunde gerade im Ausland ist. */
  function padz(n) { return String(n).padStart(2, "0"); }

  function icsZeitstempel(d) {
    return d.getUTCFullYear() + padz(d.getUTCMonth() + 1) + padz(d.getUTCDate()) +
           "T" + padz(d.getUTCHours()) + padz(d.getUTCMinutes()) + "00Z";
  }

  function icsLokal(d) {
    return d.getFullYear() + padz(d.getMonth() + 1) + padz(d.getDate()) +
           "T" + padz(d.getHours()) + padz(d.getMinutes()) + "00";
  }

  function baueIcs(name) {
    var art = ARTEN[state.art];
    var teile = state.zeit.split(":");
    var start = new Date(state.datum.getFullYear(), state.datum.getMonth(),
                         state.datum.getDate(), Number(teile[0]), Number(teile[1]));
    var ende = new Date(start.getTime() + art.minuten * 60000);

    var beschreibung = art.titel + " bei MacNexus." +
      "\\n\\nDieser Termin ist eine Anfrage und wird von MacNexus per E-Mail " +
      "bestätigt.\\n\\nKontakt: " + mail;

    var zeilen = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MacNexus//Terminplaner//DE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VTIMEZONE",
      "TZID:Europe/Vienna",
      "BEGIN:DAYLIGHT",
      "TZOFFSETFROM:+0100",
      "TZOFFSETTO:+0200",
      "TZNAME:CEST",
      "DTSTART:19700329T020000",
      "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
      "END:DAYLIGHT",
      "BEGIN:STANDARD",
      "TZOFFSETFROM:+0200",
      "TZOFFSETTO:+0100",
      "TZNAME:CET",
      "DTSTART:19701025T030000",
      "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
      "END:STANDARD",
      "END:VTIMEZONE",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "-macnexus@" + location.hostname,
      "DTSTAMP:" + icsZeitstempel(new Date()),
      "DTSTART;TZID=Europe/Vienna:" + icsLokal(start),
      "DTEND;TZID=Europe/Vienna:" + icsLokal(ende),
      "SUMMARY:" + art.titel + " — MacNexus",
      "DESCRIPTION:" + beschreibung,
      "LOCATION:" + (name || "wird per E-Mail bestätigt"),
      "STATUS:TENTATIVE",
      "BEGIN:VALARM",
      "TRIGGER:-PT60M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Erinnerung: " + art.titel,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    // Nach RFC 5545 werden Zeilen mit CRLF getrennt
    return zeilen.join("\r\n");
  }

  function ladeIcsHerunter() {
    var blob = new Blob([baueIcs()], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "MacNexus-Termin.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ---------- Schritt-Anzeige ---------- */
  function zeigeSchritt(n, ohneScroll) {
    root.querySelectorAll("[data-schritt]").forEach(function (el) {
      el.hidden = Number(el.dataset.schritt) !== n;
    });
    root.querySelectorAll("[data-stufe]").forEach(function (el) {
      var s = Number(el.dataset.stufe);
      el.classList.toggle("is-active", s === n);
      el.classList.toggle("is-done", s < n);
    });
    if (ohneScroll) return;
    var top = root.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  /* Springt zum ersten Monat, in dem es überhaupt freie Tage gibt —
     sonst landet man in einem leeren Kalender und denkt, es sei nichts frei. */
  function ersterFreierMonat() {
    var d = heute();
    d.setDate(d.getDate() + VORLAUF);
    var grenze = heute();
    grenze.setDate(grenze.getDate() + HORIZONT);
    while (d <= grenze) {
      if (istBuchbar(d)) {
        return new Date(d.getFullYear(), d.getMonth(), 1);
      }
      d.setDate(d.getDate() + 1);
    }
    var f = heute();
    return new Date(f.getFullYear(), f.getMonth(), 1);
  }

  /* ---------- Schritt 1: Art wählen ---------- */
  root.querySelectorAll("[data-art]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.art = btn.dataset.art;
      state.datum = null;
      state.zeit = null;
      state.monat = ersterFreierMonat();
      root.querySelectorAll("[data-art]").forEach(function (b) {
        b.classList.toggle("is-selected", b === btn);
      });
      zeichneKalender();
      aktualisiereZusammenfassung();
      zeigeSchritt(2);
    });
  });

  /* ---------- Schritt 2: Kalender ---------- */
  var gridEl  = root.querySelector("[data-kalender-grid]");
  var labelEl = root.querySelector("[data-kalender-label]");
  var prevBtn = root.querySelector("[data-kalender-prev]");
  var nextBtn = root.querySelector("[data-kalender-next]");
  var slotsEl = root.querySelector("[data-slots]");
  var slotsKopf = root.querySelector("[data-slots-kopf]");

  function zeichneKalender() {
    if (!gridEl) return;
    gridEl.innerHTML = "";
    labelEl.textContent = MONATE[state.monat.getMonth()] + " " + state.monat.getFullYear();

    // Zurück-Button sperren, wenn Monat in der Vergangenheit läge
    var fruehester = ersterFreierMonat();
    prevBtn.disabled = state.monat <= fruehester;

    var maxDatum = heute();
    maxDatum.setDate(maxDatum.getDate() + HORIZONT);
    var letzterAngezeigt = new Date(state.monat.getFullYear(), state.monat.getMonth() + 1, 0);
    nextBtn.disabled = letzterAngezeigt >= maxDatum;

    // Wochentagsköpfe
    WOCHENTAGE.forEach(function (w) {
      var h = document.createElement("div");
      h.className = "kal__wt";
      h.textContent = w;
      gridEl.appendChild(h);
    });

    // Leerfelder bis zum ersten Wochentag (Woche beginnt Montag)
    var erster = new Date(state.monat.getFullYear(), state.monat.getMonth(), 1);
    var versatz = (erster.getDay() === 0 ? 7 : erster.getDay()) - 1;
    for (var i = 0; i < versatz; i++) {
      gridEl.appendChild(document.createElement("span"));
    }

    var tageImMonat = new Date(state.monat.getFullYear(), state.monat.getMonth() + 1, 0).getDate();
    for (var t = 1; t <= tageImMonat; t++) {
      var d = new Date(state.monat.getFullYear(), state.monat.getMonth(), t);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "kal__tag";
      b.textContent = t;

      if (!istBuchbar(d)) {
        b.disabled = true;
        b.setAttribute("aria-label", langesDatum(d) + " — nicht verfügbar");
      } else {
        b.setAttribute("aria-label", langesDatum(d) + " — Termine verfügbar");
        (function (datum, el) {
          el.addEventListener("click", function () {
            state.datum = datum;
            state.zeit = null;
            gridEl.querySelectorAll(".kal__tag").forEach(function (x) {
              x.classList.remove("is-selected");
            });
            el.classList.add("is-selected");
            zeichneSlots();
            aktualisiereZusammenfassung();
          });
        })(d, b);
      }

      if (state.datum && iso(state.datum) === iso(d)) b.classList.add("is-selected");
      gridEl.appendChild(b);
    }
    zeichneSlots();
  }

  function zeichneSlots() {
    if (!slotsEl) return;
    slotsEl.innerHTML = "";

    if (!state.datum) {
      slotsKopf.textContent = "Wähl zuerst einen Tag aus.";
      return;
    }
    var zeiten = zeitenFuer(state.datum);
    slotsKopf.textContent = langesDatum(state.datum);

    zeiten.forEach(function (z) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "slot";
      b.textContent = z + " Uhr";
      if (state.zeit === z) b.classList.add("is-selected");
      b.addEventListener("click", function () {
        state.zeit = z;
        slotsEl.querySelectorAll(".slot").forEach(function (x) {
          x.classList.remove("is-selected");
        });
        b.classList.add("is-selected");
        aktualisiereZusammenfassung();
        weiterBtn.disabled = false;
      });
      slotsEl.appendChild(b);
    });
  }

  if (prevBtn) prevBtn.addEventListener("click", function () {
    state.monat.setMonth(state.monat.getMonth() - 1);
    zeichneKalender();
  });
  if (nextBtn) nextBtn.addEventListener("click", function () {
    state.monat.setMonth(state.monat.getMonth() + 1);
    zeichneKalender();
  });

  var weiterBtn = root.querySelector("[data-weiter]");
  if (weiterBtn) weiterBtn.addEventListener("click", function () {
    if (!state.datum || !state.zeit) return;
    zeigeSchritt(3);
  });

  root.querySelectorAll("[data-zurueck]").forEach(function (b) {
    b.addEventListener("click", function () {
      zeigeSchritt(Number(b.dataset.zurueck));
    });
  });

  /* ---------- Zusammenfassung ---------- */
  function aktualisiereZusammenfassung() {
    var art = ARTEN[state.art];
    root.querySelectorAll("[data-zf-art]").forEach(function (el) {
      el.textContent = art ? art.titel : "—";
    });
    root.querySelectorAll("[data-zf-dauer]").forEach(function (el) {
      el.textContent = art ? art.dauer + " · " + art.preis : "—";
    });
    root.querySelectorAll("[data-zf-termin]").forEach(function (el) {
      el.textContent = (state.datum && state.zeit)
        ? langesDatum(state.datum) + " um " + state.zeit + " Uhr"
        : "noch nicht gewählt";
    });
    if (weiterBtn) weiterBtn.disabled = !(state.datum && state.zeit);

    // versteckte Felder fürs Formular
    var f = root.querySelector("form[data-form]");
    if (!f) return;
    f.querySelector("[name=termin_art]").value = art ? art.titel + " (" + art.dauer + ", " + art.preis + ")" : "";
    f.querySelector("[name=termin_datum]").value = state.datum ? langesDatum(state.datum) : "";
    f.querySelector("[name=termin_zeit]").value = state.zeit ? state.zeit + " Uhr" : "";

    // Kurzformat: wird von Apple Mail und iOS als Datum erkannt, sodass sich
    // der Termin direkt aus der E-Mail in den Kalender übernehmen lässt.
    var kurz = f.querySelector("[name=termin_kurz]");
    if (kurz) {
      kurz.value = (state.datum && state.zeit)
        ? String(state.datum.getDate()).padStart(2, "0") + "." +
          String(state.datum.getMonth() + 1).padStart(2, "0") + "." +
          state.datum.getFullYear() + " " + state.zeit
        : "";
    }
  }

  /* ---------- Absenden ---------- */
  var form = root.querySelector("form[data-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!state.datum || !state.zeit || !state.art) {
        zeigeSchritt(2);
        return;
      }
      if (!form.reportValidity()) return;

      var status = form.querySelector(".form__status");
      function show(text, ok) {
        if (!status) return;
        status.classList.add("is-visible");
        status.classList.toggle("form__status--ok", ok !== false);
        status.classList.toggle("form__status--error", ok === false);
        status.textContent = text;
        status.setAttribute("role", "status");
      }

      if (!cfg.web3formsKey) {
        show("Der automatische Versand ist noch nicht eingerichtet — deine " +
             "Buchung wurde deshalb nicht abgeschickt. Schreib mir bitte " +
             "direkt an " + mail + ".", false);
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      var alt = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Wird gesendet …"; }

      var data = new FormData(form);
      data.append("access_key", cfg.web3formsKey);
      data.append("subject",
        "Terminanfrage: " + ARTEN[state.art].titel + " am " +
        langesDatum(state.datum) + " um " + state.zeit + " Uhr");
      data.append("from_name", "MacNexus Terminplaner");

      fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || !res.success) throw new Error("fehlgeschlagen");
          root.querySelector("[data-erfolg-termin]").textContent =
            langesDatum(state.datum) + " um " + state.zeit + " Uhr";
          root.querySelector("[data-erfolg-art]").textContent = ARTEN[state.art].titel;
          var icsBtn = root.querySelector("[data-ics]");
          if (icsBtn) icsBtn.onclick = function () { ladeIcsHerunter(); };
          zeigeSchritt(4);
        })
        .catch(function () {
          show("Das Absenden hat leider nicht funktioniert. Bitte versuch es " +
               "noch einmal oder schreib mir direkt an " + mail + ".", false);
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = alt; }
        });
    });
  }

  /* ---------- Start ---------- */
  // Vorauswahl über ?art=business
  var q = new URLSearchParams(location.search).get("art");
  if (q && ARTEN[q]) {
    state.art = q;
    state.monat = ersterFreierMonat();
    var vor = root.querySelector('[data-art="' + q + '"]');
    if (vor) vor.classList.add("is-selected");
    zeichneKalender();
    aktualisiereZusammenfassung();
    zeigeSchritt(2, true);   // ohne Scrollen, sonst springt die Seite beim Laden
  } else {
    state.monat = ersterFreierMonat();
    zeichneKalender();
    aktualisiereZusammenfassung();
  }
})();
