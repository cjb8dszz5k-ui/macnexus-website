# MacNexus — Website

Statische Website (HTML/CSS/JS, keine Build-Tools, keine Abhängigkeiten)
für Apple-Software-Support und Online-Kurse im Bezirk Baden / Wien.

## Lokal ansehen

Doppelklick auf `index.html` funktioniert. Besser ist ein kleiner lokaler Server,
damit sich alles genau wie später online verhält:

```bash
cd ~/Downloads/Webseite && python3 -m http.server 4321
```

Danach im Browser `http://localhost:4321` öffnen. Beenden mit `Ctrl+C`.

## Struktur

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Hero, drei Wege, Warum, Themen, Ablauf, Preise, Anspruch, FAQ |
| `support.html` | 1:1 Support — Leistung, typische Anliegen, Ablauf, Preis, FAQ |
| `academy.html` | Online-Kurse + Warteliste |
| `business.html` | Angebot für Unternehmen |
| `ueber-mich.html` | Geschichte, Haltung, klare Grenzen |
| `buchen.html` | Terminplaner: Art, Tag/Uhrzeit, Daten, Kalendereintrag |
| `kontakt.html` | Anfrageformular + Kontaktdaten |
| `impressum.html`, `datenschutz.html`, `agb.html` | Rechtstexte (Vorlagen) |
| `assets/css/style.css` | Komplettes Design-System |
| `assets/js/main.js` | Navigation, Scroll-Effekte, FAQ, Formular |
| `assets/js/booking.js` | Terminplaner-Logik und Kalenderdatei (.ics) |
| `assets/js/config.js` | **Alle Einstellungen an einer Stelle** |
| `assets/js/theme.js` | Umschalter Hell / Dunkel / Systemangepasst |

## Was noch zu tun ist

### 1. Rechtstexte ausfüllen (Pflicht vor dem Livegang)

In `impressum.html`, `datenschutz.html` und `agb.html` stehen Platzhalter in
`[eckigen Klammern]` sowie jeweils ein blauer Hinweiskasten mit Erklärung.
Beides ausfüllen bzw. entfernen. Die WKO prüft Impressum und
Datenschutzerklärung für Mitglieder kostenlos — nimm das mit.

### 2. Persönliche Inhalte

- `ueber-mich.html`: An der mit `<!-- TODO -->` markierten Stelle deine eigene
  Geschichte einsetzen (Werdegang, warum du das machst).

Die Seite spricht durchgehend in der **Ich-Form**. Bewusste Ausnahmen, die so
bleiben sollten: Formulierungen, die „du und ich“ meinen („Lass uns …“, „So
starten wir“, „wir beide“), und FAQ-Fragen, die aus Kundensicht formuliert sind
(„Wir haben auch Windows-Rechner im Einsatz“). Wenn du neue Texte schreibst,
achte auf diese Unterscheidung — sonst klingt es schnell nach Konzern.

Kontaktadresse ist überall `office@macnexus.at`. Falls sie sich noch einmal
ändert, findest du alle Stellen mit:

```bash
cd ~/Downloads/Webseite && grep -rn "office@macnexus.at" .
```

### 3. Buchung und Formularversand

Alles dafür steht in **einer einzigen Datei**: `assets/js/config.js`.
Du musst sonst nirgends etwas suchen.

**Formularversand — aktiv.** Der Web3Forms-Key in `config.js` gehört zu
`office@macnexus.at`. Anfragen vom Kontaktformular, von der Academy-Warteliste
und aus dem Terminplaner kommen dort an.

Merke dir für später: **Der Key bestimmt, wohin zugestellt wird — nicht der
Text auf der Website.** Wenn du die Kontaktadresse noch einmal wechselst,
brauchst du auch einen neuen Key, sonst landen die Anfragen weiter im alten
Postfach.

Ein Spamschutz (unsichtbares Honeypot-Feld) ist eingebaut. Der passende
Abschnitt in der Datenschutzerklärung ist ebenfalls schon aktiv.

**Terminbuchung — eingebaut.** `buchen.html` ist ein eigener Terminplaner:
Termin-Art wählen, Tag und Uhrzeit aussuchen, Daten eingeben. Die Anfrage kommt
über denselben Weg wie das Kontaktformular bei dir an, mit dem gewählten Termin
in der Betreffzeile.

Deine Verfügbarkeiten stellst du in `config.js` unter `planer` ein:

| Einstellung | Bedeutung |
|---|---|
| `tage` | Wochentage, an denen du arbeitest (1 = Montag) |
| `zeiten` | Uhrzeiten je Termin-Art |
| `samstagAktiv` | Samstage freischalten |
| `vorlaufTage` | Wie kurzfristig gebucht werden darf |
| `horizontTage` | Wie weit im Voraus |
| `gesperrteTage` | Urlaub, Feiertage, private Termine |

**Wichtig — was der Planer nicht kann:** Er kennt deinen echten Kalender nicht.
Zwei Leute können denselben Slot anfragen, und ein Termin, den du privat schon
vergeben hast, wird trotzdem angeboten (außer du trägst ihn unter
`gesperrteTage` ein). Deshalb ist jede Buchung ausdrücklich eine **Anfrage**,
die du per E-Mail bestätigst — so steht es auch auf der Seite. Für echte
Verfügbarkeitsprüfung brauchst du einen externen Dienst; siehe unten.

**Externer Dienst später.** Trägst du bei `bookingSupport` / `bookingBusiness`
eine Adresse ein (z. B. von Cal.com), führen alle Buttons dorthin statt zum
eingebauten Planer. Dann in `datenschutz.html` einen Absatz für den Anbieter
ergänzen.

**Warum die Kombination sinnvoll ist:** Wer schon weiß, was er will, bucht
selbst einen Slot — das erspart dir das Hin und Her mit Terminvorschlägen.
Wer unsicher ist oder ein Firmenanliegen hat, schreibt lieber erst. Beide
Wege stehen nebeneinander zur Verfügung.

### 4. Domain kaufen und Seite online stellen

**Domain.** Eine `.at`-Domain kostet rund 15–20 € pro Jahr. Du kaufst sie nicht
direkt bei nic.at (der zentralen Registrierungsstelle für Österreich), sondern
bei einem Registrar. Gängige Anbieter in Österreich sind zum Beispiel World4You,
easyname oder Hosttech; international auch Namecheap oder Cloudflare.

Ablauf ist überall gleich:

1. Auf der Seite des Anbieters den Wunschnamen in die Suche eingeben
   (z. B. `macnexus.at`) und prüfen, ob er frei ist.
2. In den Warenkorb, Konto anlegen, bezahlen.
3. Auf „Whois-Schutz“ bzw. „Domain Privacy“ achten — sonst steht deine
   Privatadresse öffentlich abfragbar im Register. Bei `.at` ist das für
   Privatpersonen ohnehin eingeschränkt, aber prüf es.

Wenn `macnexus.at` schon vergeben ist: `macnexus.co.at` oder ein leicht
abgewandelter Name funktionieren genauso. Prüf vorher kurz, ob der Name nicht
schon als Marke geschützt ist.

**Hosting.** Die Seite ist rein statisch — sie braucht keine Datenbank und kein
PHP. Damit läuft sie auf den einfachsten (und oft kostenlosen) Angeboten:

- **Netlify** oder **Cloudflare Pages**: Ordner per Drag-and-drop hochladen,
  Domain verbinden, fertig. HTTPS ist automatisch dabei. Kostenlos ausreichend.
- **Klassisches Webhosting** beim selben Anbieter wie die Domain: Dateien per
  FTP hochladen. Etwa 3–8 € im Monat, dafür alles an einer Stelle.

Für den Start ist Variante eins schneller und günstiger.

### 5. Vor dem Livegang

- Bei Google Ads / Meta Ads: Cookie-Banner mit vorheriger Einwilligung ergänzen
  (die Seite setzt aktuell selbst keine Tracking-Cookies)
- Echte Kundenstimmen ergänzen, sobald vorhanden
- Google Business Profil anlegen — für lokale Suchanfragen wie
  „Apple Hilfe Baden“ ist das oft wirksamer als bezahlte Anzeigen

## Design-Hinweise

- Akzentfarbe ist Apple-Blau (`--c-accent`), zentral in `style.css` änderbar.
- **Farbschema-Umschalter** in der Navigation mit drei Zuständen: Hell, Dunkel,
  Systemangepasst. Die Wahl wird im Browser der Besucher:innen gespeichert und
  gilt beim nächsten Besuch weiter.
- **Voreinstellung ist Hell** — auch für Besucher:innen, deren Betriebssystem
  auf Dunkel steht. Das entspricht apple.com und wirkt einladender. Ändern
  kannst du das in `assets/js/theme.js` bei `var STANDARD = "light";`
  (mögliche Werte: `"light"`, `"dark"`, `"system"`). Achtung: Der gleiche Wert
  steht auch im kleinen Inline-Skript im `<head>` jeder Seite — es verhindert,
  dass die Seite beim Laden kurz in der falschen Farbe aufblitzt. Wenn du die
  Voreinstellung änderst, musst du beide Stellen anpassen.
- Der Hell-Modus setzt bewusst warme Töne ein: ein sanfter Verlauf im
  Seitenkopf und je eigene Farbtöne für die drei Einstiegskarten
  (`--c-warm-1` bis `--c-warm-3`).
- Schriftart ist die System-Schrift (SF Pro auf Apple-Geräten) — dadurch lädt
  die Seite sehr schnell und wirkt nativ.
- Alle Illustrationen sind Inline-SVG und passen sich automatisch an
  Hell/Dunkel an. Es werden keine externen Dateien geladen.

## Termine im Apple Kalender

Auf der Bestätigungsseite gibt es „Zum Kalender hinzufügen“. Das erzeugt eine
`.ics`-Datei, die Apple Kalender, Outlook und Google direkt verstehen. Sie ist
korrekt auf die Zeitzone Europe/Vienna gesetzt und enthält eine Erinnerung
60 Minuten vorher. Diese Datei bekommt allerdings **die Kundin oder der Kunde** —
nicht du.

**Für deinen eigenen Kalender gibt es zwei Wege:**

*Sofort und ohne Zusatzkosten:* In der Anfrage-E-Mail steht das Feld
`termin_kurz` im Format `01.09.2026 17:00`. Apple Mail und iOS erkennen so ein
Datum automatisch — antippen bzw. anklicken genügt, und der Termin landet mit
einem Schritt im Kalender.

*Vollautomatisch:* Das kann eine statische Website prinzipiell nicht leisten —
dafür müsste ein Server dauerhaft Zugriff auf deinen iCloud-Kalender haben.
Genau das machen Dienste wie **Cal.com** (kostenlose Stufe vorhanden): Du
verbindest dort einmalig deinen Apple-/iCloud-Kalender, danach werden Termine
automatisch eingetragen **und** bereits belegte Zeiten gar nicht erst als frei
angeboten. Das löst zugleich das Doppelbuchungs-Problem des eingebauten Planers.
Wenn du diesen Weg gehst, trag den Link einfach in `config.js` ein — die Seite
schaltet dann von selbst um.
