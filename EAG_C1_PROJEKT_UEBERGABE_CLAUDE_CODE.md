# EAG C1 Trainer – Projektbeschreibung für Claude Code

## 1. Projektziel

Dieses Projekt ist ein statischer, browserbasierter **EAG-C1-Trainer auf Deutsch** für Katja.

Ziel ist die Vorbereitung auf die luxemburgische **Épreuve d’aptitude générale (EAG)** für die Laufbahngruppe **C1**.

Das Projekt besteht aus:

- 7 separaten Trainingsmodulen
- je 50 Trainingsaufgaben pro Modul
- insgesamt 350 Trainingsaufgaben
- einem separaten 2-Stunden-Prüfungsmodus
- einem unabhängigen Tipps-&-Tricks-Projekt
- reinem HTML/CSS/JavaScript
- ohne Build-Prozess
- ohne Backend
- geeignet für GitHub Pages

Repository:

`https://github.com/heybobo31/katja`

Voraussichtliche GitHub-Pages-URL:

`https://heybobo31.github.io/katja/`

---

# 2. Testbereiche

Die C1-Vorbereitung umfasst folgende sieben Bereiche:

1. Abstraktes Denken
2. Verbales Denken
3. Numerisches Denken
4. Planung
5. Kontrolle & Genauigkeit
6. Situatives Urteil – Bürger/Kunde
7. Situatives Urteil – Zusammenarbeit

Zusätzlich gibt es:

8. Komplette Prüfungssimulation – 120 Minuten

---

# 3. Aktuelle Projektstruktur

```text
/
├── index.html
├── 01_abstraktes-denken.html
├── 02_verbales-denken.html
├── 03_numerisches-denken.html
├── 04_planung.html
├── 05_kontrolle-genauigkeit.html
├── 06_situatives-urteil-buerger.html
├── 07_situatives-urteil-zusammenarbeit.html
├── 08_pruefungssimulation.html
├── style.css
├── trainer.js
├── exam.js
├── questions.js
└── README.md
```

Die aktuelle funktionierende Version wurde intern als:

`V5 FULL CHECK`

bezeichnet.

---

# 4. Architektur

## 4.1 questions.js

`questions.js` enthält alle Trainingsdaten in:

```js
window.EAG_DATA
```

Struktur ungefähr:

```js
window.EAG_DATA = {
  abstract: {
    title: "...",
    short: "...",
    questions: [...]
  },
  verbal: {...},
  numerical: {...},
  planning: {...},
  accuracy: {...},
  customer: {...},
  cooperation: {...}
}
```

Jede Aufgabe besitzt mindestens:

```js
{
  prompt: "...",
  options: [...],
  answer: 0,
  explanation: "...",
  context: "...",
  kind: "..."
}
```

Je nach Fragetyp können zusätzliche visuelle Inhalte enthalten sein.

---

# 5. Trainingslogik

Alle sieben Trainingsseiten verwenden denselben:

`trainer.js`

Das jeweilige Modul wird über:

```html
<body data-module="abstract">
```

bzw. den passenden Schlüssel ausgewählt.

---

# 6. Shuffle- und Fortschrittslogik

WICHTIG: Diese Funktionalität muss erhalten bleiben.

## Verhalten

Wenn Katja ein Trainingsmodul startet:

1. Noch nicht bearbeitete Fragen werden zuerst geladen.
2. Diese werden zufällig gemischt.
3. Bereits bearbeitete Fragen werden danach ebenfalls zufällig gemischt.
4. Sobald alle 50 Fragen eines Moduls einmal bearbeitet wurden:
   - startet jeder neue Durchgang mit allen 50 Fragen komplett neu gemischt.

Der Fortschritt wird lokal im Browser über:

```js
localStorage
```

gespeichert.

Schema:

```js
eag_c1_seen_<module>
```

Beispiel:

```js
eag_c1_seen_abstract
eag_c1_seen_planning
```

Dadurch muss Katja beim nächsten Besuch nicht erneut durch die ersten bereits bekannten Aufgaben klicken.

Diese Logik bitte NICHT entfernen.

---

# 7. Abstraktes Denken

Das Modul wurde visuell aufgewertet.

Es soll nicht nur aus Text- oder Zahlenreihen bestehen.

Gewünscht sind insbesondere:

- visuelle Reihen
- 3×3-Matrizen
- Rotation
- Positionen
- gefüllt / ungefüllt
- Anzahl von Elementen
- kombinierte Regeln
- mehrere Merkmale gleichzeitig
- grafische Antwortmöglichkeiten

Wichtig:

Visuelle Inhalte müssen als HTML/SVG korrekt gerendert werden.

Frühere Versionen hatten einen Bug, weil grafischer Inhalt als normaler Text ausgegeben wurde.

Der Renderer muss deshalb unterscheiden können zwischen:

- normalem Text
- HTML-Kontext
- visuellen Antwortoptionen

Bitte bei Änderungen unbedingt testen.

---

# 8. Planung

Planung soll möglichst wie ein professioneller Assessment-Test wirken.

Gewünschte Elemente:

- Kalenderansicht
- freie und belegte Zeitfenster
- feste Termine
- Deadlines
- frühestmöglicher Beginn
- spätestmöglicher Abschluss
- Aufgabenlänge
- Prioritäten
- Abhängigkeiten
- eingeschränkte Zeitfenster
- mehrere plausible Antwortmöglichkeiten

Beispiele für Bedingungen:

```text
A muss vor 11:00 abgeschlossen sein.
B darf frühestens ab 10:00 beginnen.
C dauert 60 Minuten.
D darf erst nach A stattfinden.
E ist nur zwischen 14:00 und 15:00 möglich.
```

Wichtig:

Kalender und Planungsinformationen sollen visuell dargestellt werden, nicht nur als Fließtext.

---

# 9. Kontrolle & Genauigkeit

Dieses Modul wurde in V5 komplett neu aufgebaut.

Frühere Versionen hatten zwei Probleme:

1. Tabellen wurden teilweise nicht korrekt gerendert.
2. Manche Aufgaben waren nicht eindeutig lösbar.

Aktueller gewünschter Aufbau:

- pro Aufgabe 15–30 Tabellenzeilen
- eindeutiger Referenzdatensatz
- Katja muss exakt den passenden Datensatz identifizieren
- große scrollbare Tabellen
- ähnliche Datensätze
- realistische Ablenkungen

Spalten:

- Zeile
- Nachname
- Vorname
- ID
- Aktennummer
- Adresse
- Ort

Typische Fallen:

```text
583917 ↔ 583197
SCHMIT ↔ SCHMIDT
MULLER ↔ MÜLLER
Marie ↔ Maria
C1-4718-26 ↔ C1-4781-26
```

Wichtig:

Jede Aufgabe muss eindeutig lösbar sein.

Es muss immer eine klare Referenz geben.

---

# 10. Verbales Denken

Ziel:

Informationen nur anhand des angegebenen Textes bewerten.

Typische Antwortoptionen:

- Richtig
- Falsch
- Nicht feststellbar

Keine externe Wissensannahme.

Typische Fallen:

- immer
- nie
- alle
- ausschließlich
- garantiert
- spätestens
- frühestens

---

# 11. Numerisches Denken

Schwerpunkte:

- Prozentrechnung
- prozentuale Veränderung
- Durchschnitt
- Verhältnis
- Dreisatz
- Tabellen
- Diagramme
- Mengen
- Zeit
- einfache Rechenoperationen

Wichtig:

Die Aufgaben sollen realistisch und nicht unnötig mathematisch-akademisch sein.

Die EAG prüft Fähigkeiten, keine Hochschulmathematik.

---

# 12. Situatives Urteil – Bürger/Kunde

Bewertet werden soll professionelles Verhalten gegenüber Bürgern/Nutzern.

Bevorzugte Antwortlogik:

```text
zuhören
→ prüfen
→ verständlich erklären
→ realistischen nächsten Schritt anbieten
→ Regeln einhalten
```

Vermeiden:

- unrealistische Versprechen
- unhöfliches Verhalten
- unnötiges Abschieben
- Regelverstöße
- Konfliktverschärfung

---

# 13. Situatives Urteil – Zusammenarbeit

Bevorzugte Logik:

```text
direkt
→ respektvoll
→ sachlich
→ kooperativ
→ lösungsorientiert
```

Eskalation nur, wenn notwendig.

Vermeiden:

- öffentlich bloßstellen
- ignorieren
- passiv-aggressives Verhalten
- unnötig sofort an Vorgesetzte eskalieren

---

# 14. Prüfungssimulation

Datei:

`08_pruefungssimulation.html`

Logik:

`exam.js`

Ziel:

Eine realistische Simulation der C1-EAG.

Aktuell:

- Gesamtdauer: 120 Minuten
- alle 7 Bereiche
- 56 Aufgaben
- Timer
- keine Sofortkorrektur
- Navigation zwischen Fragen
- Aufgabenübersicht
- Abgabe
- Auswertung nach Testbereich

Wichtig:

Die 56 Fragen sind eine Trainingsentscheidung.

Es ist NICHT bekannt, wie viele Fragen die echte EAG exakt enthält.

Das Projekt darf deshalb nicht behaupten:

> „Dies ist eine exakte Kopie der echten EAG.“

Stattdessen:

> realistische Simulation anhand öffentlich beschriebener Testbereiche

---

# 15. Prüfungsmodus – mögliche zukünftige Verbesserung

Mögliche Verbesserung:

- Startbildschirm
- Instruktionsseite vor jedem Testblock
- Testblöcke getrennt
- optional Zeit pro Block
- abgeschlossene Blöcke sperren
- kein Zurückspringen in abgeschlossene Blöcke
- Vollbild-/Assessment-Center-Look
- Fortschrittsanzeige
- Warnung bei wenig Restzeit

Nur umsetzen, wenn die bestehende Funktionalität erhalten bleibt.

---

# 16. Design

Aktuelles Design:

- hell
- professionell
- neutral
- responsive
- Desktop und Tablet im Fokus
- mobil nutzbar

CSS:

`style.css`

Wichtige Komponenten:

- Cards
- Progressbar
- Buttons
- Tabellen
- Timer
- Badges
- Kalenderansichten
- große scrollbare Accuracy-Tabellen

---

# 17. Cache-Busting

Es gab Probleme mit alten gecachten JS-Dateien auf GitHub Pages.

Deshalb werden Assets mit Versionsparameter geladen, z. B.:

```html
<script src="trainer.js?v=5"></script>
<script src="questions.js?v=5"></script>
<link rel="stylesheet" href="style.css?v=5">
```

Bei größeren Releases bitte Versionsnummer erhöhen.

Beispiel:

```text
?v=6
```

---

# 18. Fehlerhistorie

## Fehler 1 – Abstraktes Denken

Problem:

Grafische Aufgaben waren vorhanden, wurden aber als Text gerendert.

Lösung:

HTML/SVG-Kontext korrekt über `innerHTML` rendern.

---

## Fehler 2 – Planung

Problem:

Kalenderdaten wurden ebenfalls nur als Text ausgegeben.

Lösung:

HTML-Kontext visuell rendern.

---

## Fehler 3 – Kontrolle & Genauigkeit

Problem:

Große Tabellen wurden im Prüfungsmodus nicht korrekt dargestellt.

Zusätzlich waren einige Aufgaben logisch nicht eindeutig.

Lösung:

- HTML-Tabellen korrekt rendern
- Aufgaben komplett neu erzeugt
- eindeutige Referenz pro Aufgabe

---

# 19. Testanforderungen bei Änderungen

Vor einem Commit bitte mindestens prüfen:

## Alle Trainingsmodule

```text
01 Abstraktes Denken
02 Verbales Denken
03 Numerisches Denken
04 Planung
05 Kontrolle & Genauigkeit
06 Bürger/Kunde
07 Zusammenarbeit
```

Für jedes Modul:

- Seite lädt ohne JS-Fehler
- Frage wird angezeigt
- Antwortbuttons erscheinen
- Antwort auswählbar
- „Antwort prüfen“ funktioniert
- „Nächste“ funktioniert
- „Zurück“ funktioniert
- Fortschrittsanzeige funktioniert
- localStorage funktioniert
- Shuffle funktioniert

---

## Spezialtests

### Abstraktes Denken

- SVG/Grafik sichtbar
- Antwortgrafiken sichtbar
- keine `[object Object]`
- kein HTML als Klartext

### Planung

- Kalender sichtbar
- Termine sichtbar
- Bedingungen sichtbar

### Kontrolle & Genauigkeit

- Referenz sichtbar
- Tabelle sichtbar
- 15–30 Zeilen
- horizontales Scrollen funktioniert
- genau eine korrekte Lösung

---

## Prüfung

- Timer startet bei 02:00:00
- Timer läuft herunter
- alle Fragetypen werden dargestellt
- Tabellen funktionieren
- Matrizen funktionieren
- Planung funktioniert
- Navigation funktioniert
- Abgabe funktioniert
- Auswertung funktioniert

---

# 20. Inhaltliche Leitlinie

Die Aufgaben sollen:

- prüfungsnah wirken
- aber keine angeblich echten Prüfungsfragen darstellen
- verständlich auf Deutsch sein
- C1-Niveau entsprechen
- zunehmende Schwierigkeit ermöglichen
- nicht künstlich kompliziert formuliert sein

Bei neuen Aufgaben bitte möglichst abwechslungsreiche Szenarien verwenden.

---

# 21. Tipps-&-Tricks-Projekt

Zusätzlich existiert ein unabhängiges kleines HTML-Projekt:

`EAG C1 Tipps & Tricks für Katja`

Es enthält:

- Strategien pro Testbereich
- typische Fallen
- Zeitmanagement
- Prüfungsregeln
- Kurzcheck vor dem Start

Dieses Projekt ist unabhängig vom Trainer.

Es muss nicht zwingend mit dem Hauptprojekt gekoppelt werden.

Optional könnte später von der Hauptübersicht darauf verlinkt werden.

---

# 22. Datenschutz

Es gibt:

- kein Backend
- keine Accounts
- keine Serverdatenbank
- kein Tracking

Fortschritt bleibt ausschließlich im Browser:

```js
localStorage
```

Keine persönlichen Daten an externe Dienste senden.

---

# 23. Deployment

Das Projekt läuft vollständig statisch.

GitHub Pages:

```text
Repository:
heybobo31/katja

Branch:
main

Folder:
/ (root)
```

Startseite:

```text
https://heybobo31.github.io/katja/
```

Prüfung:

```text
https://heybobo31.github.io/katja/08_pruefungssimulation.html
```

---

# 24. Prioritäten für weitere Entwicklung

Empfohlene Reihenfolge:

1. Stabilität erhalten
2. bestehende Bugs vermeiden
3. Aufgabenqualität erhöhen
4. visuelle Prüfungsnähe verbessern
5. Schwierigkeitsstufen ergänzen
6. Statistiken lokal speichern
7. gezielte Wiederholung falsch beantworteter Fragen
8. Prüfungsmodus weiter professionalisieren

---

# 25. Sinnvolle zukünftige Features

Optional:

## Lernstatistik

Pro Modul lokal speichern:

- Anzahl Versuche
- Anzahl richtig
- Fehlerquote
- zuletzt trainiert
- stärkste Bereiche
- schwächste Bereiche

---

## Fehlertraining

Button:

```text
Nur meine Fehler üben
```

Dafür falsch beantwortete IDs in localStorage speichern.

---

## Schwierigkeitsstufen

```text
Leicht
Mittel
Schwer
Prüfungsniveau
```

---

## Zufälliger Kurztest

Beispiel:

```text
10 zufällige Aufgaben
20 zufällige Aufgaben
30 zufällige Aufgaben
```

---

## Vollbild-Prüfungsmodus

Assessment-Center-ähnliche Darstellung:

- reduzierte Navigation
- großer Timer
- Konzentrationsmodus
- keine störenden Links

---

# 26. Wichtigste technische Regel für Claude Code

Bitte keine größeren Refactorings durchführen, ohne vorher sicherzustellen, dass:

- `questions.js`
- `trainer.js`
- `exam.js`
- die Spezialtypen
- `localStorage`
- Shuffle
- SVG
- Tabellen
- Kalender

weiter kompatibel bleiben.

Das Projekt ist bewusst simpel gehalten:

```text
HTML + CSS + Vanilla JavaScript
```

Keine Frameworks notwendig.

Bitte React, Vue, Angular oder Build-Systeme nur einführen, wenn es ausdrücklich gewünscht wird.

---

# 27. Kurzfassung

Das Projekt ist ein:

> Deutscher, statischer, interaktiver EAG-C1-Trainer für Katja mit sieben Testbereichen, je 50 Aufgaben, intelligentem Shuffle/Fortschritt, visuellen Assessment-Aufgaben und einer separaten 120-Minuten-Prüfungssimulation.

Oberstes Ziel:

> Katja soll regelmäßig zuhause realistisch üben können, ohne immer dieselben Aufgaben in derselben Reihenfolge zu sehen.
