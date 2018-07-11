# Modelle

Modelle werden dazu genutzt die Datenbank zu strukturieren und den Zugriff auf Datenbankinhalte zu systematisieren. Sie repräsentieren jeweils einen bestimmten Typ von Datenbankobjekt bzw. Dokument und umfassen die Logik zur Erzeugung, Veränderung und Abfrage des jeweiligen Dokumententyps.

Das `template` eines Modells bestimmt, welche Eigenschaften ein Dokument hat und in welchen Spalten der CSV-Datei diese jeweils zu finden sind.

Das Modell erweitert ein Dokument um die Eigenschaft `type`, welche das Dokument dem Modell zuordnet, und legt über die Eigenschaft `_id` eine ID fest, anhand derer die Einzigartigkeit eines Dokuments geprüft wird.

Um in der Datenbank einen Namensraum je Dokumententyp zu schaffen, sollte die ID eines Dokuments mit seinem `type` beginnen. Darauf sollte ein `string` folgen, der die gewünschte Einzigartigkeitsbedingung des Dokuments widerspiegelt. So ist es im Falle des Modells `fault.count` die Kombination aus Variablenname (`name`) und der Datum/Zeit des Eintrags (`timestamp`). Um eine ID einfach lesbar zu machen und mögliche, ungewollte Überschneidungen zu verhindern, sollten die logischen Abschnitte der ID jeweils durch ein `/` getrennt werden.

#### Beispiel-Dokument des Typs `fault.count`
```json
{
  "_id": "fault.count/2016-05-21T09:41:51.137Z/BDE_SM_01_Count",
  "type": "fault.count",
  "name": "BDE_SM_01_Count",
  "value": 12,
  "timestamp": "2016-05-21T09:41:51.137Z"
}
```

<br>

## `fault.count`

Anzahl der Störungen seit dem letzten Eintrag. Einzigartigkeitsbedingung ist die Kombination aus `timestamp` und `name`.

### `template`

#### Beispiel
```json
{
  "name": "VarName",
  "value": "VarValue",
  "timestamp": "TimeString"
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `name` | `string`, `number` | Überschrift oder Index der Spalte, in der sich der Name der Variable befindet. Spalte darf nicht leer sein. |
| `value` | `string`, `number` | Überschrift oder Index der Spalte, in der sich der Wert der Variable befindet. Wert muss eine nicht-negative, ganze Zahl sein. |
| `timestamp` | `string`, `number` | Überschrift oder Index der Spalte, in der sich die Datum/Zeit der Eintragserzeugung befindet. Spalte darf nicht leer sein. |

### Options

#### Beispiel
```json
{
  "isUpsert": false
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `isUpsert` | `boolean` | Legt fest, welcher Modus bei dem Erzeugen von Dokumenten in der Datenbank benutzt werden soll. Wenn `true`, werden neue Dokumente eingefügt (`insert`) und Dokumente, die bereits in der Datenbank vorhanden sind werden aktualisiert (`update`). Andernfalls werden Duplikate ignoriert.  |

<br>

## `fault.time`

Dauer der Störungen seit dem letzten Eintrag. Einzigartigkeitsbedingung ist die Kombination aus `timestamp` und `name`.

### `template`

#### Beispiel
```json
{
  "name": "VarName",
  "value": "VarValue",
  "timestamp": "TimeString"
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `name` | `string`, `number` | Überschrift oder Index der Spalte, in der sich der Name der Variable befindet. Spalte darf nicht leer sein. |
| `value` | `string`, `number` | Überschrift oder Index der Spalte, in der sich der Wert der Variable befindet. Wert muss eine nicht-negative, ganze Zahl sein. |
| `timestamp` | `string`, `number` | Überschrift oder Index der Spalte, in der sich die Datum/Zeit der Eintragserzeugung befindet. Spalte darf nicht leer sein. |

### Options

#### Beispiel
```json
{
  "isUpsert": false
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `isUpsert` | `boolean` | Legt fest, welcher Modus bei dem Erzeugen von Dokumenten in der Datenbank benutzt werden soll. Wenn `true`, werden neue Dokumente eingefügt (`insert`) und Dokumente, die bereits in der Datenbank vorhanden sind werden aktualisiert (`update`). Andernfalls werden Duplikate ignoriert. |

<br>

## `ready.time`

Dauer der Anlagenverfügbarkeit seit dem letzten Eintrag. Einzigartigkeitsbedingung ist die Kombination aus `timestamp` und `name`.

### `template`

#### Beispiel
```json
{
  "name": "VarName",
  "value": "VarValue",
  "timestamp": "TimeString"
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `name` | `string`, `number` | Überschrift oder Index der Spalte, in der sich der Name der Variable befindet. Spalte darf nicht leer sein. |
| `value` | `string`, `number` | Überschrift oder Index der Spalte, in der sich der Wert der Variable befindet. Wert muss eine nicht-negative, ganze Zahl sein. |
| `timestamp` | `string`, `number` | Überschrift oder Index der Spalte, in der sich die Datum/Zeit der Eintragserzeugung befindet. Spalte darf nicht leer sein. |

### Options

#### Beispiel
```json
{
  "isUpsert": false
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `isUpsert` | `boolean` | Legt fest, welcher Modus bei dem Erzeugen von Dokumenten in der Datenbank benutzt werden soll. Wenn `true`, werden neue Dokumente eingefügt (`insert`) und Dokumente, die bereits in der Datenbank vorhanden sind werden aktualisiert (`update`). Andernfalls werden Duplikate ignoriert. |

<br>

## `output.count`

Produzierte Menge seit dem letzten Eintrag. Einzigartigkeitsbedingung ist der `timestamp`.

### `template`

#### Beispiel
```json
{
  "value": "VarValue",
  "timestamp": "TimeString"
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `value` | `string`, `number` | Überschrift oder Index der Spalte, in der sich der Wert der Variable befindet. Wert muss eine nicht-negative, ganze Zahl sein. |
| `timestamp` | `string`, `number` | Überschrift oder Index der Spalte, in der sich die Datum/Zeit der Eintragserzeugung befindet. Spalte darf nicht leer sein. |

### Options

#### Beispiel
```json
{
  "isUpsert": false
}
```

#### Eigenschaften

| Eigenschaft | Typ | Beschreibung |
| --- | --- | --- |
| `isUpsert` | `boolean` | Legt fest, welcher Modus bei dem Erzeugen von Dokumenten in der Datenbank benutzt werden soll. Wenn `true`, werden neue Dokumente eingefügt (`insert`) und Dokumente, die bereits in der Datenbank vorhanden sind werden aktualisiert (`update`). Andernfalls werden Duplikate ignoriert. |
