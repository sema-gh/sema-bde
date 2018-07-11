<template>
  <div class="w-100 h-100 flex flex-column overflow-hidden">

    <div class="flex-fix flex items-center pa3 bb b--element-gray">

      <label class="mr-auto nowrap">
        {{ $t('labels.files') }}
      </label>

      <el-button class="mh2"
        size="small"
        type="primary"
        @click="consumeDirtyResources"
        :disabled="!dirtyResources.length || isConsuming">
        {{ $t('buttons.consumeDirty') }}
      </el-button>

      <el-dropdown
        trigger="click"
        @command="callMethod">

        <el-badge
          :hidden="hasDirectory"
          is-dot>
          <el-button
            size="small"
            icon="el-icon-arrow-down">
          </el-button>
        </el-badge>

        <el-dropdown-menu
          slot="dropdown">

          <el-dropdown-item
            command="consumeResources"
            :disabled="!hasDirectory || isConsuming">
            {{ $t('menuItems.import') }}
          </el-dropdown-item>

          <el-dropdown-item
            command="openDialog"
            :disabled="isConsuming">
            <el-badge class="w-100"
              :hidden="hasDirectory"
              is-dot>
              {{ hasDirectory ? $t('menuItems.change') : $t('menuItems.select') }}
            </el-badge>
          </el-dropdown-item>

          <el-dropdown-item
            command="openExplorer"
            v-show="hasDirectory || isConsuming">
            {{ $t('menuItems.open') }}
          </el-dropdown-item>

          <el-dropdown-item
            command="renewDatabase"
            :disabled="isConsuming">
            {{ $t('menuItems.renew') }}
          </el-dropdown-item>

        </el-dropdown-menu>

      </el-dropdown>

    </div>

    <ul class="flex-auto flex flex-column pb1 ph2 overflow-auto">
      <resource-list-item
        ref="resourceItems"
        v-for="resource in resources" :key="resource.id"
        :resource="resource"/>
    </ul>

    <div class="flex-fix flex items-center pa3 bt b--element-gray">
      <el-form label-position="left" label-width="325px" class="w-100">
        <el-form-item :label="$t('switches.auto')" class="mb0">
          <el-switch
            v-model="isAutoConsumeEnabled"
            :disabled="isConsuming">
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('switches.persistence')" class="mb0">
          <el-switch
            v-model="isDatabasePersistent"
            :disabled="isConsuming">
          </el-switch>
        </el-form-item>
        <span class="resource-list__form-item-comment f7 light-silver absolute">
          {{ $t('switches.persistenceComment') }}
        </span>
      </el-form>
    </div>

  </div>
</template>

<script>
import { shell, remote } from 'electron'
import database from '@/database'
import storage from '@/storage'
import ResourceListItem from './resource-list-item'

export default {

  name: 'ResourceList',

  i18n: {
    messages: {
      de: {
        labels: {
          files: 'Dateien'
        },
        buttons: {
          consumeDirty: 'ÄNDERUNGEN IMPORTIEREN'
        },
        switches: {
          auto: 'Änderungen automatisch importieren',
          persistence: 'Persistente Datenbank',
          persistenceComment: 'Änderung wird erst nach Neustart wirksam'
        },
        menuItems: {
          change: 'Quellverzeichnis ändern',
          select: 'Quellverzeichnis auswählen',
          open: 'Quellverzeichnis im Explorer öffnen',
          import: 'Alles importieren',
          renew: 'Datenbank leeren'
        }
      }
    }
  },

  computed: {
    directory: {
      get () {
        return this.$store.state.resources.directory
      },

      set (directory) {
        this.$store.commit('SET_RESOURCES_DIRECTORY', directory)
      }
    },

    isDatabasePersistent: {
      get () {
        return this.$store.state.resources.isDatabasePersistent
      },

      set (isDatabasePersistent) {
        storage.set('isDatabasePersistent', isDatabasePersistent)
        this.$store.commit('SET_IS_DATABASE_PERSISTENT', isDatabasePersistent)
      }
    },

    isAutoConsumeEnabled: {
      get () {
        return this.$store.state.resources.isAutoConsumeEnabled
      },

      set (isAutoConsumeEnabled) {
        storage.set('isAutoImportEnabled', isAutoConsumeEnabled)
        this.$store.commit('SET_IS_AUTO_CONSUME_ENABLED', isAutoConsumeEnabled)
      }
    },

    hasDirectory () {
      return !!this.directory
    },

    resources () {
      return this.$store.getters.resourceList
    },

    dirtyResources () {
      return this.$store.getters.dirtyResourceList
    },

    isConsuming () {
      return this.$store.getters.isConsuming
    }
  },

  watch: {
    dirtyResources (list) {
      if (this.isAutoConsumeEnabled && !this.isConsuming && list.length) {
        this.$nextTick(() => this.consumeDirtyResources())
      }
    }
  },

  methods: {
    openExplorer () {
      shell.openItem(this.directory)
    },

    openDialog () {
      remote.dialog.showOpenDialog(this._win, { properties: ['openDirectory'] }, paths => {
        if (paths && paths.length && this.directory !== paths[0]) {
          this.directory = paths[0]
        }
      })
    },

    async renewDatabase () {
      await database.destroy()

      const dir = this.directory

      this.directory = ''
      this.directory = dir

      remote.app.relaunch()
      remote.app.exit()
    },

    async consumeResources () {
      if (!this.resources.length) return

      for (let resource of this.resources) {
        await this.$store.dispatch('consumeResource', resource)
      }
    },

    async consumeDirtyResources () {
      if (!this.dirtyResources.length) return

      for (let resource of this.dirtyResources) {
        await this.$store.dispatch('consumeResource', resource)
      }

      this.$nextTick(() => {
        if (!this.isConsuming && this.dirtyResources.length) {
          this.consumeDirtyResources()
        }
      })
    },

    callMethod (name) {
      this[name]()
    }
  },

  created () {
    this._win = remote.getCurrentWindow()
  },

  beforeDestroy () {
    if (this._win) {
      delete this._win
    }
  },

  components: {
    ResourceListItem
  }

}
</script>

<style lang="scss">
  .resource-list__form-item-comment {
    margin-top: -.75rem;
  }
</style>
