# Konfiguration

Die App wird über die Datei `AppConfig.json` konfiguriert. Diese befindet sich unter Windows im Ordner `C:\Users\[BENUTZERNAME]\AppData\Roaming\sema-bde`. Der Order `AppData` ist standardmäßig ausgeblendet, entsprechend müssen gegebenenfalls in den Explorer-Ordneroptionen die Einstellungen für die Anzeige ausgeblendeter Dateien und Ordner geändert werden.

Die Konfiguration wird zum Appstart abgefragt und sollte zur Laufzeit der App nicht verändert werden. Einige der Konfigurationsparameter können zur Laufzeit über das User-Interface verändert werden.

#### Beispiel

```json
{
  "isDatabasePersistent": false,
  "isAutoImportEnabled": false,
  "isFullScreen": false,  
  "importConfigs": [],
  "faultSignalsChartConfig": {},
  "readySignalsChartConfig": {}
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `isDatababasePersistent` | `boolean` | Legt fest, ob die Datenbank über den Appneustart hinaus unverändert bestehen bleibt oder nur in-memory erzeugt wird. Änderung hat nicht zur Folge, dass die gespeicherte Datenbank zerstört wird. Bei jedem Appstart mit dem Wert `true` wird, falls vorhanden, die ursprünglich gespeicherte Datenbank geöffnet. |
| `isAutoImportEnabled` | `boolean` | Legt fest, ob CSV-Dateien, die noch nicht importiert wurden oder die sich seit dem letzten Import verändert haben automatisch importiert werden oder manuell importiert werden müssen. |
| `isFullScreen` | `boolean` | Legt fest, ob die App im FullScreen-Modus geöffnet wird. Bei Appstart im normalen Fenster-Modus werden Fenstergröße/-position der letzten Session nach Möglichkeit wiederhergestellt. Im FullScreen-Modus wird auf der Navigationsleiste eine neue Schaltfäche zum Minimieren der App eingeblendet. |
| `importConfigs` | `array` | Enthält `importConfig`-Objekte. |
| `faultSignalsChartConfig` | `object` | Ist `faultSignalsChartConfig`-Objekt. |
| `readySignalsChartConfig` | `object` | Ist `readySignalsChartConfig`-Objekt. |

<br>

## Objekte

### `importConfig`

Definiert CSV-Datei. Legt fest wie eine Datei eingelesen und ihre Inhalte zu Datenbank-Dokumenten konvertiert werden.

#### Beispiel

```json
{
  "pattern": "BDE_Stoermeldungen*",
  "delimiter": ";",
  "hasHeader": true,
  "columns": [],
  "contents": []
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `pattern` | `string` | Muster zur Prüfung von Dateinamen. Wird der Name einer CSV-Datei im Quellverzeichnis positiv getestet, wird der Datei die entsprechende `importConfig` zugeordnet. Das Testverfahren unterstützt [globbing](https://github.com/micromatch/micromatch#matching-features). |
| `delimiter` | `string` | Das in der CSV-Datei benutzte Trennzeichen. Mögliche Werte sind: `","`, `";"` und `"\t"` (Tab). |
| `hasHeader` | `boolean` | Gibt an, ob die CSV-Datei Spaltenüberschriften enthält. Hat Einfluss darauf, ob in der `importConfig` der Bezug zu den entsprechenden Spalten über ihre Überschriften oder Indizes hergestellt werden muss. Indizes sind 0-basiert, d.h. die erste Spalte hat den Index 0. |
| `columns` | `array` | Enthält `column`-Objekte. |
| `contents` | `array` | Enthält `content`-Objekte. |

<br>

### `column`

Definition einer relevanten Spalte einer CSV-Datei. Eine Spalte, auf die in der `importConfig` kein Bezug genommen wird, muss nicht definiert werden.

#### Beispiel (in dieser Form nicht sinnvoll)

```json
{
  "key": "VarName",
  "type": "string",
  "separators": {
    "thousands": " ",
    "decimal": "."
  },
  "format": "DD.MM.YYYY HH:mm:ss"
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `key` | `string`, `number` | Spaltenbezug anhand der Überschrift (`hasHeader = true`) oder des Index (`hasHeader = false`). |
| `type` | `string` | Gibt an, in welchen Datentyp die Werte der Spalte beim einlesen konvertiert werden sollen. Mögliche Werte sind `"string"`, `"boolean"` (Spaltenwerte dürfen nur `"true"` oder `"false"` sein), `"number"` und `"datetime"`. |
| `separators` | `object` | Spezifiziert die Trennzeichen der Zahlengruppen. Bleibt unberücksichtigt, falls der Datentyp der Spalte nicht `number` ist. Standardmäßig werden Zahlen der Form `12345.67`, d.h. ohne Tausendertrennzeichen und, soweit Dezimalstellen vorhanden sind, mit einem Punkt als Dezimaltrennzeichen erwartet. Erhält ein Objekt mit den Eigenschaften `thousands` und/oder `decimal`, mit den jeweils möglichen Werten: `"."`, `","` und `" "` (Leerzeichen). |
| `format` | `string` | Bleibt unberücksichtigt, falls der Datentype der Spalte nicht `datetime` ist. Spezifiziert das in der Spalte verwendete Datum/Zeit-Format. Standardmäßig werden Datum/Zeit-Angaben in der Form `"2016-07-21T10:36:27.123Z"` erwartet. Für eine Auflistung der Möglichkeiten zur Beschreibung des Formats siehe [hier](https://momentjs.com/docs/#/parsing/string-format/). |

<br>

### `content`

Definition eines möglichen Inhaltes einer CSV-Datei. Ob eine Definition auf einen Datensatz in der CSV-Datei angewendet werden soll, wird zeilenweise der Reihe nach getestet. Wird eine Zeile einmal zugeordnet, wird für die folgendenen Definitionen nicht mehr getestet. Kann eine Zeile nicht zugeordnet werden, wird sie beim Import ignoriert. Für Details zu den modellspezifischen Bestandteilen siehe [hier](./modelle.md).

#### Beispiel

```json
{
  "model": "fault.count",
  "test": {
    "key": "VarName",
    "pattern": "BDE_SM_*_Count"
  },
  "template": {
    "name": "VarName",
    "value": "VarValue",
    "timestamp": "TimeString"
  },
  "options": {
    "isUpsert": false
  }
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `model` | `string` | Name des Modells, dem eine Zeile zuzuordnen ist, falls sie positiv getestet wird. Für mögliche Werte siehe [hier](./modelle.md). |
| `test` | `object` | Spezifiziert den Test zur Zeilenzuordnung. Erhält ein Objekt mit den Eigenschaften `key` und `pattern`. Die Eigenschaft `key` enthält den Spaltenbezug (Überschrift/Index, abhängig von `hasHeader`) für die Anwendung des Musters, welches über die Eigenschaft `pattern` spezifiziert wird. Testverfahren unterstützt [globbing](https://github.com/micromatch/micromatch#matching-features). |
| `template` | `object` | Modellspezifische Zuordnung der Spalten der CSV-Datei zu den Dokumenteigenschaften. |
| `options` | `object` | Modellspezifische Optionen zur Erzeugung der Dokumente. |

<br>

### `faultSignalsChartConfig`

Konfiguration des Störungsdiagramms der Fehleranalyse.

#### Beispiel

```json
{
  "graphs": []
}
```

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `graphs` | `array` | Enthält `faultSignalsChartGraph`-Objekte. |

<br>

### `readySignalsChartConfig`

Konfiguration des Verfügbarkeitsdiagramms der Produktionsanalyse.

#### Beispiel

```json
{
  "graphs": []
}
```

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `graphs` | `array` | Enthält `readySignalsChartGraph`-Objekte. |

<br>

### `faultSignalsChartGraph`

Definition eines Graphen, der im Störungsdiagramm der Fehleranalyse enthalten sein soll. 

#### Beispiel

```json
{
  "pattern": "BDE_SM_01*",
  "label": {
    "de": "1. Meldung"
  },
  "bullet": "square",
  "lineColor": "#ff6347",
  "dashLength": 5
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `pattern` | `string` | Testmuster zur Zuordnung von Dokumenten des Typs `fault.count` oder `fault.time`. Test prüft, ob der Wert der Eigenschaft `name` des Dokuments dem Muster entspricht. |
| `label` | `object` | Objekt mit den Graph-Beschriftungen je Sprache. Eigenschaften entsprechen den Kürzeln der von der App unterstützen Sprachen. Beispielobjekt: `{ "de": "1. Meldung" }`. |
| `bullet` | `string` | Datenpunktmarkierungn des Graphen. Mögliche Werte sind: `"none"`, `"round"`, `"square"`, `"triangleUp"`, `"triangleDown"`, `"triangleLeft"`, `"triangleRight"`, `"bubble"`, `"diamond"`, `"xError"` und `"yError"`. Eigenschaft ist optional. Standardmäßig wird keine Datenpunktmarkierung angezeigt. |
| `lineColor` | `string` | Farbe des Graphen. Die Farbe kann als HTML-Farbenname (`"tomato"`), HEX (`"#ff6347"`), RGB (`"rgb(255, 99, 71)"`), RGBA (`"rgb(255, 99, 71, 1)"`), HSL (`"hsl(9, 100%, 64%)"`) oder als HSLA (`"hsl(9, 100%, 64%, 1)"`) spezifiziert werden. Eigenschaft ist optional. Es werden automatisch unterschiedliche Farben für alle Graphen eines Diagramms generiert. |
| `dashLength` | `number` | Ist der Wert größer als `0`, wird die Graphenlinie gestrichelt dargestellt. Je größer der Wert, desto länger sind die Striche. Eigenschaft ist optional. Standardmäßig wird die Linie ungestrichelt dargestellt. |

<br>

### `readySignalsChartGraph`

Definition eines Graphen, der im Verfügbarkeitsdiagramm der Produktionsanalyse enthalten sein soll. 

#### Beispiel

```json
{
  "pattern": "BDE_ready_option1*",
  "label": {
    "de": "1. Option"
  },
  "bullet": "square",
  "lineColor": "#ff6347",
  "dashLength": 5
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `pattern` | `string` | Testmuster zur Zuordnung von Dokumenten des Typs `ready.time`. Test prüft, ob der Wert der Eigenschaft `name` des Dokuments dem Muster entspricht.|
| `label` | `object` | Objekt mit den Graph-Beschriftungen je Sprache. Eigenschaften entsprechen den Kürzeln der von der App unterstützen Sprachen. Beispielobjekt: `{ "de": "1. Option" }`.  |
| `bullet` | `string` | Datenpunktmarkierungn des Graphen. Mögliche Werte sind: `"none"`, `"round"`, `"square"`, `"triangleUp"`, `"triangleDown"`, `"triangleLeft"`, `"triangleRight"`, `"bubble"`, `"diamond"`, `"xError"` und `"yError"`. Eigenschaft ist optional. Standardmäßig wird keine Datenpunktmarkierung angezeigt. |
| `lineColor` | `string` | Farbe des Graphen. Die Farbe kann als HTML-Farbenname (`"tomato"`), HEX (`"#ff6347"`), RGB (`"rgb(255, 99, 71)"`), RGBA (`"rgb(255, 99, 71, 1)"`), HSL (`"hsl(9, 100%, 64%)"`) oder als HSLA (`"hsl(9, 100%, 64%, 1)"`) spezifiziert werden. Eigenschaft ist optional. Es werden automatisch unterschiedliche Farben für alle Graphen eines Diagramms generiert. |
| `dashLength` | `number` | Ist der Wert größer als `0`, wird die Graphenlinie gestrichelt dargestellt. Je größer der Wert, desto länger sind die Striche. Eigenschaft ist optional. Standardmäßig wird die Linie ungestrichelt dargestellt. |
