# Human or Robot? – Word Lab (Version 2)

Eine einzige, vollständig lauffähige `index.html` ohne notwendige externe Skripte oder Bibliotheken. Die Google-Schriftarten sind optional; bei fehlendem Internet wird die Systemschrift verwendet.

## GitHub Pages

`index.html` ins Stammverzeichnis des Repositories hochladen und unter **Settings → Pages** veröffentlichen.

## Bedienung

- Runde 1–3: jeweils alle Karten (EN und DE) zufällig auf dem Tisch. Alle lassen sich frei verschieben. Berühren sich Karten in unterschiedlicher Sprache, verbinden sie sich, *ohne* auf inhaltliche Richtigkeit zu prüfen. Ein einfacher Klick auf eine verbundene Karte trennt das Paar.
- Check: zeigt nur die Anzahl Fehler einschliesslich noch nicht zusammengeführter Karten.
- Bei null Fehlern erscheint Next. Vorher keine Auflösung.
- Schlussrunde: 47 englische Karten in ein Venn-Diagramm ziehen (Humans, Both, Robots). Check zeigt nur Fehlerzahl.

## LearningView

Die Schnittstelle nach https://learningview.org/embed-api.php ist eingebaut. Die App sendet **erst bei komplett bestandenem Finale** ein xAPI-Ergebnis `result.score.scaled = 1` an das Elternfenster (`https://learningview.org`). LearningView dokumentiert, dass externe interaktive Aufgaben dadurch ihren Ergebnis- bzw. Erledigtstatus übernehmen. Dazu in LearningView als **Interaktiv (extern)** einbinden, nicht bloss als Link. In LearningView eingebundene HTML- oder ZIP-Inhalte können ausserdem die abgeschlossene Lernrunde über `saveAnswerData` speichern; dieser Mechanismus verlangt das LearningView-Elternfenster. Bei gewöhnlichen GitHub-Pages-Aufrufen entfällt die Speicherung.

Zur Absicherung sollte die automatische Erledigt-Markierung einmal mit einem Testschülerkonto in der tatsächlichen LearningView-Einbettung geprüft werden; lokal ist die externe Plattform nicht testbar.
