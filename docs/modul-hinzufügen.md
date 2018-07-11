# Modul hinzufügen

### 1. Hauptkomponente erstellen

Jedes Modul braucht eine Haupt- bzw. Container-Komponente. Diese enthält alle Unterkomponenten und das grundlegende Layout der Modul-Ansicht. Komponenten werden durch `.vue`-Dateien repräsentiert und befinden sich in dem Ordner `src/renderer/components`. Der Name der Datei sollte der Modulbezeichnung entsprechen. Gleiches gilt für die CSS-Klasse des HTML-Wurzelelements sowie den Namen der Vue-Komponente.

#### Beispiel einer leeren Hauptkomponente `src/renderer/components/example-module.vue`

```html
<template>
  <div class="example-module">
    <!-- Layout + Unterkomponenten -->
  </div>
</template>

<script>
export default {
  name: 'ExampleModule'
}
</script>

<style lang="scss">
.example-module {}
</style>
```

### 2. Store erweitern

Damit mehrere Unterkomponenten Daten miteinander austauschen können, wird im Store der App unter `src/renderer/store/modules` ein neues [Vuex-Modul](https://vuex.vuejs.org/guide/modules.html) hinzugefügt. Zur besseren Zuordnung sollte die Datei den Modulnamen tragen.

#### Beispiel eines leeren Vuex-Modules `src/renderer/store/modules/example-module.js`

```js
const state = {}
const mutations = {}
const actions = {}
const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
```

### 3. Service-Ordner anlegen

Für den Fall, dass Logik aus den Unterkomponenten oder dem Store ausgelagert werden kann, sollte ein gleichnamiger Service-Ordner unter `src/renderer/services` angelegt werden, der diese aufnimmt. Der Service kann anschließend bei Bedarf in die Komponenten/den Store importiert werden.

### 4. Unterkomponenten erstellen

Unterkomponenten teilen das Interface in funktionale Blöcke ein. Gemeinsam genutzte Daten und Methoden können in das zuvor erstellte Vuex-Module integriert und komplexe Logik in den angelegten Service ausgelagert werden. Anschließend werden die Unterkomponenten in die Hauptkomponente importiert und ins Layout eingefügt.

### 7. Konfiguration einbinden

Falls Konfigurationsparameter aus der Datei `AppConfig.json` bei Appstart in das Modul geladen werden sollen, muss die Funktion `actions.load` in der Index-Datei des Stores (`src/renderer/store/index.js`) erweitert werden. Um auch beim unkonfigurierten Appstart die Funktion des Moduls sicherzustellen, sollte die Standardkonfiguration in `src/renderer/storage/defaults` entsprechend angepasst werden.

### 5. Router erweitern

Die neue Hauptkomponente muss im Router der App registriert werden. Dazu wird ein neues `route`-Objekt eingefügt. Für weitere Informationen zum `route`-Objekt siehe [hier](https://router.vuejs.org/api/#the-route-object).

#### Beispiel einer neuen Route in `src/renderer/router/index.js`

```js
export default new Router({
  routes: [
    ...,
    {
      path: '/example-module',
      name: 'ExampleModule',
      component: require('@/components/example-module').default
    },
    ...
  ]
})
```

### 6. Modulauswahl-Dropdown erweitern

Damit das Modul über das Interface aufrufbar ist, muss dem Modulauswahl-Dropdown in der Komponente `main-navigation` eine entsprechende Auswahloption hinzugefügt werden.

#### Beispiel einer neuen Route-Option in `src/renderer/components/main-navigation.vue`

```html
<script>
export default {
  ...,
  i18n: {
    de: {
      ...,
      options: {
        ...,
        exampleModule: 'Beispiel Modul'
      }
    }
  },
  computed: {
    ...,
    routeOptions () {
      return [
        ...,
        { label: this.$t('options.exampleModule'), name: 'ExampleModule' }
      ]
    },
    ...
  },
  ...
}
</script>
```
