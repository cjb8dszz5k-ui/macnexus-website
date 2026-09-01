/* ============================================================
   MacNexus — Zentrale Einstellungen
   ------------------------------------------------------------
   Das ist die EINZIGE Datei, die du anfassen musst, um Buchung
   und Formularversand scharf zu schalten. Alles andere passt
   sich automatisch an.

   Solange hier nichts eingetragen ist, funktioniert die Seite
   trotzdem: Buchungs-Buttons führen dann aufs Kontaktformular,
   und das Formular zeigt einen Hinweis mit deiner E-Mail-Adresse.
   ============================================================ */

window.MACNEXUS_CONFIG = {

  /* ----------------------------------------------------------
     1. BUCHUNGSLINKS  (z. B. Cal.com oder Calendly)
     ----------------------------------------------------------
     Lege bei deinem Buchungstool zwei Termin-Arten an:

       • eine für Support-Sessions (60 Min, 49,99 €)
       • eine für Business-Erstgespräche (30 Min, kostenlos)

     Kopiere dann die jeweilige öffentliche Adresse hier herein,
     z. B. "https://cal.com/macnexus/support".

     Leer lassen = Button führt aufs Kontaktformular.
  */
  bookingSupport:  "",
  bookingBusiness: "",

  /* ----------------------------------------------------------
     2. FORMULARVERSAND  (Web3Forms)
     ----------------------------------------------------------
     Auf web3forms.com deine E-Mail eingeben — du bekommst einen
     Access Key zugeschickt. Kein Konto nötig. Key hier einfügen.

     Leer lassen = Formular zeigt nur einen Hinweis, verschickt
     aber nichts.

     Der Key bestimmt, an WELCHE Adresse zugestellt wird — nicht
     der Text auf der Website. Wenn du die Kontaktadresse änderst,
     brauchst du also auch einen neuen Key.

     Aktueller Key gehört zu: office@macnexus.at

     Hinweis: Die Anfragen laufen über einen Dienst außerhalb der EU.
     Der passende Abschnitt steht bereits in datenschutz.html.
  */
  web3formsKey: "9262919e-4fde-4644-bc4a-f03797c3a617",

  /* ----------------------------------------------------------
     3. TERMINPLANER  (eingebaut, ohne externen Anbieter)
     ----------------------------------------------------------
     Steuert, welche Termine auf buchen.html angeboten werden.
     Der Kunde wählt einen Slot; du bekommst die Anfrage per E-Mail
     und bestätigst sie. Es wird nichts automatisch verbindlich
     gebucht — siehe Hinweis im README.
  */
  planer: {

    // Arbeitstage: 1 = Montag … 7 = Sonntag
    tage: [1, 2, 3, 4, 5],

    // Uhrzeiten je Termin-Art. Format "HH:MM", lokale Zeit.
    // Passe das an deinen Feierabend an — du arbeitest nebenberuflich,
    // deshalb sind abends mehr Slots hinterlegt als tagsüber.
    zeiten: {
      support:  ["17:00", "18:00", "19:00", "20:00"],
      business: ["09:00", "12:00", "17:00", "18:00"]
    },

    // Zusätzliche Zeiten am Samstag (leer lassen = keine)
    zeitenSamstag: ["10:00", "11:00", "14:00"],
    samstagAktiv: false,

    // Wie viele Tage im Voraus frühestens buchbar (1 = ab morgen)
    vorlaufTage: 1,

    // Wie weit in die Zukunft darf gebucht werden
    horizontTage: 42,

    // Termine, die du blockierst — Urlaub, Feiertage, private Termine.
    // Format "JJJJ-MM-TT". Ganze Tage sperren.
    gesperrteTage: [
      // "2026-12-24",
      // "2026-12-25"
    ]

  },

  /* ----------------------------------------------------------
     4. KONTAKTADRESSE
     ----------------------------------------------------------
     Wird im Hinweistext angezeigt, solange kein Versand aktiv ist.
  */
  email: "office@macnexus.at"

};
