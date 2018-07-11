# Entwicklungsumgebung einrichten

## Software installieren

### [Node.js](https://nodejs.org/en/)

JavaScript-Laufzeitumgebung zur serverseitigen Ausführung von JavaScript-Code. Beinhaltet die Installation des Paketmanagers NPM. Nach der Installation ist ein Neustart erforderlich. Anschließend kann über ein Terminal (unter Windows **cmd** oder **PowerShell**) die jeweilige Version abgefragt werden.

```bash
# Node.js-Version
node -v

# NPM-Version
npm -v
```

Werden beide Befehle fehlerfrei ausgeführt, war die Installation erfolgreich und es können die notwendigen Pakete bzw. Node Module installiert werden.

#### [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools)

Unter Windows können beim Kompilieren nativer Node Module Fehler auftreten. Windows-build-tools installiert alle notwendigen Tools, um ein fehlerfreies kompilieren zu ermöglichen. Für die Installation ein Terminal **als Administrator ausführen**.

```bash
npm install --global --production windows-build-tools
```

Anschließend ist ein Neustart empfohlen.

#### [node-gyp](https://github.com/nodejs/node-gyp)

Tool zum Kompilieren nativer Node Module.

```bash
npm install --global node-gyp
```

### [Visual Studio Code](https://code.visualstudio.com)

Individualisierbarer Texteditor mit integriertem Terminal & Git-GUI. Die Standardinstallationseinstellungen können beibehalten werden.

#### Empfohlene Erweiterungen

- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

Anstelle von VS Code kann auch jeder andere Texteditor oder ein vollwertiges IDE genutzt werden.

### [Git](https://git-scm.com)

Software zur Versionsverwaltung. Die Standardinstallationseinstellungen können grundsätzlich beibehalten werden, es empfiehlt sich allerdings im Editorauswahldialog Visual Studio Code auszuwählen.

<br>

## Projekt initialisieren

1. Projektordner in Visual Studio Code öffnen.
2. Das integrierte Terminal mit der Tastenkombination `strg + ö` aufrufen.
3. Abhängigkeiten (Node Module) installieren.

      ```bash
      npm install
      ```

4. App im Entwicklungsumfeld öffnen.

      ```bash
      npm run dev
      ```

Falls die App nicht ordnungsgemäß geöffnet wird, müssen möglicherweise die nativen Node Module neu kompiliert werden. Dies geschieht automatisch, wenn ein neues Build der App erzeugt wird.

```bash
npm run build:dir
```

Anschließend kann die App erneut geöffnet werden.
