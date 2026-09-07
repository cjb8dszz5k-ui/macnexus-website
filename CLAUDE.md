# macNexus Website — Projektkontext für Claude

Diese Datei ist der Einstiegspunkt für jede Claude-Code-Sitzung in diesem Repo.
Sie fasst zusammen, was das Projekt ist, wie der Code aufgebaut ist und was als
Nächstes ansteht — damit nicht jedes Mal neu erklärt werden muss.

## Was ist macNexus?

Ali Yuvarlak (Teamleiter Vollzeit, macNexus als Nebenerwerb) baut ein
Einzelunternehmen für Apple-Software-Support in Österreich auf:
Ausschließlich macOS/iOS/iCloud/Sicherheit/Migration — **keine Hardware-Reparatur**.

Drei Einnahmesäulen:
1. **1:1 Support-Session** — 49,99 € Pauschale, bis 60 Min, 100%
   Zufriedenheitsgarantie (keine Lösung = 0 €).
2. **macNexus Business** (B2B) — kostenloses 30-Min-Erstgespräch, danach
   89–120 €/Std. oder Pauschalpakete.
3. **macNexus Academy** — Video-Onlinekurse, ca. 30 € Einmalkauf.

Standort: Kirchengasse 5a/7, 2525 Schönau an der Triesting (Bezirk Baden, NÖ).
Vor Ort: Baden, Mödling, Wiener Neustadt, Wien. Remote: ganz Österreich + DACH.
Kontakt: office@macnexus.at, +43 664 2112924. Domain: macnexus.at.

Rechtlich: Freies Gewerbe "Dienstleistungen in der automatischen
Datenverarbeitung und Informationstechnik" (WKO NÖ, Fachgruppe UBIT),
Kleinunternehmerregelung (§6 Abs.1 Z27 UStG, keine USt). Die offizielle
Gewerbeanmeldung ist aktuell bewusst pausiert (Vorbereitungsphase, um
Fixkosten zu sparen, bis der erste zahlende Auftrag steht) — daher fehlen
GISA-Zahl/UID im Impressum noch.

Ausführliche Geschäftsdaten (Businessplan, Marketing, Roadmap) liegen in
`~/Documents/macnexus-unterlagen/macNexus_Master_Gesamtdokumentation_fuer_Claude.md`
— bei Fragen zum Geschäftsmodell, Preisen oder der Roadmap dort nachlesen,
nicht raten.

## Tech-Stack

Bewusst simpel: **statisches HTML/CSS/Vanilla-JS, keine Build-Tools, keine
Frameworks, keine Dependencies.** Ziel ist 100/100 Lighthouse und maximale
Ladegeschwindigkeit über die System-Schrift (SF Pro).

- Deployment: GitHub-Repo `macnexus-website` (main-Branch) → Hostinger
  Business Webhosting via Continuous Deployment. Push auf `main` = live auf
  macnexus.at.
- Lokal ansehen: `python3 -m http.server 4321` im Projektordner, dann
  `http://localhost:4321`.

### Seitenstruktur (10 Seiten)

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Hero, 3 Wege, Warum, Themen, Ablauf, Preise, FAQ |
| `support.html` | 1:1 Support mit 4 Vorher/Nachher-Fallbeispielen |
| `academy.html` | 4 Online-Kurse + Warteliste (Web3Forms) |
| `business.html` | B2B-Angebot |
| `ueber-mich.html` | Persönliche Profilkarte, Standort, Reaktionszeit |
| `buchen.html` | Terminplaner (eigenbau) → aktuell umgestellt auf Cal.com |
| `kontakt.html` | Anfrageformular (Web3Forms) + WhatsApp/Anruf-Buttons |
| `impressum.html`, `datenschutz.html`, `agb.html` | Rechtstexte (AT/DSGVO) |

### Wichtige Dateien

- **`assets/js/config.js`** — Die EINE Datei für alle Einstellungen: Cal.com-
  Buchungslinks (bereits live: `cal.com/macnexus/support`,
  `cal.com/macnexus/business`), Web3Forms-Key (gehört zu office@macnexus.at,
  bestimmt wohin Formulare zugestellt werden — bei E-Mail-Wechsel auch Key
  wechseln), interner Terminplaner (Arbeitstage, Zeiten, gesperrte Tage —
  aktuell nur Fallback, da Cal.com-Links Vorrang haben).
- **`assets/js/theme.js`** — Hell/Dunkel/System-Umschalter. Voreinstellung ist
  **Hell** (`var STANDARD = "light"`), auch bei Dunkel-Systemen (wie
  apple.com). Wird an zwei Stellen gesetzt: hier UND im Inline-Skript im
  `<head>` jeder HTML-Seite (verhindert Flackern beim Laden) — bei Änderung
  **beide** Stellen anpassen.
- **`assets/css/style.css`** — Komplettes Design-System über CSS-Variablen:
  Akzentfarbe `--c-accent: #0071e3` (Apple Electric Blue), Signal-Grün
  `#34c759`, Hell/Dunkel-Paletten sauber getrennt. Warmtöne
  `--c-warm-1..3` für die drei Einstiegskarten im Hell-Modus.
- **`assets/js/booking.js`** — Logik des eingebauten Terminplaners + .ics-
  Kalenderexport (Europe/Vienna, Erinnerung 60 Min vorher).
- **`assets/js/main.js`** — Navigation, Scroll-Effekte, FAQ-Akkordeon,
  Formularlogik.

### Design-Prinzipien (bitte respektieren)

- **Ich-Form durchgehend**, außer bei „du und ich"-Formulierungen und
  FAQ-Fragen aus Kundensicht — siehe README für die genaue Abgrenzung.
- **Keine künstlichen Gerätemockups mehr.** Zwei frühere Hero-Varianten
  (abstrakte Geräte-SVGs, MacBook+iPhone-Mockup) wurden von Ali explizit
  abgelehnt ("sieht nicht schön aus" / "schaut schrecklich aus"). Der
  aktuelle Live-Zustand ist **puren Minimalismus**: scharfe Typografie +
  3 Frosted-Glass Trust-Pillen (Zufriedenheitsgarantie, 24–48h Termine,
  Region). Nicht zu alten Mockup-Ideen zurückkehren, ohne das explizit mit
  Ali abzustimmen.
- Alle Illustrationen sind Inline-SVG (kein Laden externer Assets), passen
  sich automatisch an Hell/Dunkel an.
- Kontaktadresse überall `office@macnexus.at` — bei Änderung mit
  `grep -rn "office@macnexus.at" .` alle Stellen finden.

## Aktueller Stand (siehe `git log`)

Working tree ist sauber, `main` ist deckungsgleich mit `origin/main`. Letzte
Commits (neueste zuerst):
1. Hero Redesign: Mockups entfernt, purer Minimalismus mit Trust-Pillen
   *(aktueller Live-Zustand)*
2. Hero Showcase mit MacBook+iPhone-Mockup *(verworfen, s.o.)*
3. Ablauf/FAQ zu Google Meet & Bildschirmfreigabe präzisiert
4. 4 Optimierungen: Über-Mich-Profilkarte, Vorher/Nachher-Fallbeispiele,
   WhatsApp/Tel-Schnellkontakt, Academy-Curricula
5. Cal.com Live-Buchungslinks aktiviert

Remote-Support-Workflow ist praxisgetestet: Apple-native Bildschirmfreigabe
als primärer Weg (kostenlos, Ende-zu-Ende von Apple verschlüsselt), Google
Meet und AnyDesk/RustDesk als Alternativen.

## Offene Punkte / Roadmap (aus der Master-Doku, Kapitel 6)

**Bekanntes technisches Problem:** Beim Hostinger-Git-Auto-Deployment gab es
zuletzt ein Problem mit dem Branch-Dropdown — Status zuletzt "in Bearbeitung".
Falls das Thema wieder aufkommt: prüfen, ob der Auto-Deploy-Branch in
Hostinger korrekt auf `main` zeigt.

Noch offen laut README/Master-Doku:
- [ ] Persönliche Über-mich-Geschichte final einsetzen
- [ ] GISA-Zahl/UID nach Gewerbeanmeldung ins Impressum eintragen
- [ ] Cookie-Banner vor Start von Google/Meta Ads ergänzen
- [ ] Rechnungsvorlage für 49,99 € (ohne USt-Ausweis) aufsetzen

Die Website-technischen Aufgaben sind größtenteils erledigt (Rechtstexte,
persönliche Story, Cal.com-Anbindung, Hero-Design). Der Fokus laut Roadmap
liegt jetzt auf **Content-Produktion** (Academy-Videokurse) und
**Marketing/Sichtbarkeit** (Flyer, Google-Beiträge, Social Media), nicht auf
weiterer Website-Entwicklung — bevor an neuen Features gearbeitet wird, im
Zweifel bei Ali nachfragen, ob das gerade Priorität hat.

## Arbeitsweise mit Ali

- Kommuniziert auf Deutsch, arbeitet praktisch/technisch orientiert.
- Rotierender 3-Schicht-Job — realistisch 10–20 Std./Woche Zeit fürs
  Business, oft in kurzen Blöcken. Änderungen möglichst klar begründen und
  in überschaubaren Schritten liefern statt große unaufgeforderte Umbauten.
- Frühere KI-generierte Hero-Mockups wurden zweimal explizit abgelehnt —
  bei visuellen Vorschlägen lieber zurückhaltend/minimalistisch bleiben und
  größere Design-Änderungen vorher kurz beschreiben statt direkt umsetzen.
