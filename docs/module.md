# Module

Module sind funktionale Einheiten der App. Sie sind nicht zentralisiert angelegt, sondern werden an verschiedenen Punkten der App eingebunden. Näheres zum Vorgehen beim Hinzufügen eines neuen Moduls [hier](./modul-hinzufügen.md).

<br>

## Fehleranalyse (`malfunction-analysis`)

Auswertung der Anzahl und Dauer von Störungen.

#### Parameter

| Parameter | Beschreibung |
| --- | --- |
| Daten | Auswahl des Datensatzes (Störungsanzahl oder Störungsdauer). |
| Zeitraum | Start- und Enddatum (einschließlich) der Diagramme. |
| Aggregat | Legt die Einheit der Datengruppierung fest. |
| Diagrammtyp | Auswahl zwischen Linien- und Balkendiagramm. |

#### Algorithmus des Störungsdiagramms

1. Abfrage aller Dokumente des Typs `fault.count` (Störungsanzahl) oder `fault.time` (Störungsdauer, `value`-Werte werden als Minuten interpretiert) mit einem `timestamp` zwischen Startdatum (`00:00:00`) und Enddatum (`23:59:59`). Start- und Enddatum sind einschließlich.

2. Normalisierung der `timestamp`-Werte der Dokumente gemäß des gewählten Aggregats. So wird beim Aggregat 'Stunde' der `timestamp` eines Dokuments auf die nächste volle Stunde abgerundet (`2016-05-21T09:41:51.137Z` wird zu `2016-05-21T09:00:00.000Z`).

3. Die `value`-Werte der Dokumente mit dem gleichen normalisierten `timestamp` werden zu einem Datenpunkt aufaddiert.

#### Algorithmus des Outputdiagramms

1. Abfrage aller Dokumente des Typs `output.count` (Produzierte Menge) mit einem `timestamp` zwischen Startdatum (`00:00:00`) und Enddatum (`23:59:59`). Start- und Enddatum sind einschließlich.

2. Normalisierung der `timestamp`-Werte der Dokumente gemäß des gewählten Aggregats. So wird beim Aggregat 'Stunde' der `timestamp` eines Dokuments auf die nächste volle Stunde abgerundet (`2016-05-21T09:41:51.137Z` wird zu `2016-05-21T09:00:00.000Z`).

3. Die `value`-Werte der Dokumente mit dem gleichen normalisierten `timestamp` werden zu einem Datenpunkt aufaddiert.

<br>

## Produktionsanalyse (`production-analysis`)

Auswertung der Anlagenverfügbarkeit.

#### Parameter

| Parameter | Beschreibung |
| --- | --- |
| Daten | Anzeige des Datensatzes (Verfügbarkeit). |
| Zeitraum | Start- und Enddatum (inklusive) des Diagramms. |
| Aggregat | Legt die Einheit der Datengruppierung fest. |
| Diagrammtyp | Auswahl zwischen Linien- und Balkendiagramm. |

#### Algorithmus des Verfügbarkeitsdiagramms

1. Abfrage aller Dokumente des Typs `ready.time` (`value`-Werte werden als Minuten interpretiert) mit einem `timestamp` zwischen Startdatum (`00:00:00`) und Enddatum (`23:59:59`). Start- und Enddatum sind einschließlich.

2. Normalisierung der `timestamp`-Werte der Dokumente gemäß des gewählten Aggregats. So wird beim Aggregat 'Stunde' der `timestamp` eines Dokuments auf die nächste volle Stunde abgerundet (`2016-05-21T09:41:51.137Z` wird zu `2016-05-21T09:00:00.000Z`).

3. Die `value`-Werte der Dokumente mit dem gleichen normalisierten `timestamp` werden zu einem Datenpunkt aufaddiert.

4. Die Anzahl der Minuten in einer Einheit des gewählten Aggregats (maximale Verfügbarkeit) wird ermittelt (z.B. `60` in einer Stunde).

5. Der Wert eines jedes Datenpunkts wird durch die maximale Verfügbarkeit geteilt und auf zwei Nachkommastellen gerunden.

#### Algorithmus des Outputdiagramms

1. Abfrage aller Dokumente des Typs `output.count` (Produzierte Menge) mit einem `timestamp` zwischen Startdatum (`00:00:00`) und Enddatum (`23:59:59`). Start- und Enddatum sind einschließlich.

2. Normalisierung der `timestamp`-Werte der Dokumente gemäß des gewählten Aggregats. So wird beim Aggregat 'Stunde' der `timestamp` eines Dokuments auf die nächste volle Stunde abgerundet (`2016-05-21T09:41:51.137Z` wird zu `2016-05-21T09:00:00.000Z`).

3. Die `value`-Werte der Dokumente mit dem gleichen normalisierten `timestamp` werden zu einem Datenpunkt aufaddiert.
