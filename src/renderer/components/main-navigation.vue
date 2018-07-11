<template>
  <nav class="w-100 h-100 flex items-center">

    <img class="h-75 w-auto mr4"
      src="~@/assets/images/logo.png">

    <el-select class="main-navigation__select mr-auto"
      size="small"
      v-model="currentRouteName"
      @change="navigateTo">
      <el-option
        v-for="route in routeOptions"
        :key="route.name"
        :label="route.label"
        :value="route.name">
      </el-option>
    </el-select>

    <el-badge class="main-navigation__import ml2 noprint"
      :hidden="(!dirtyResourceCount && hasDirectory) || isSidebarVisible"
      :value="dirtyResourceCount"
      :is-dot="!dirtyResourceCount">
      <el-button
        size="small"
        :type="isSidebarVisible ? '' : 'primary'"
        @click="toggleIsSidebarVisible">
        {{ $t('buttons.import') }}
      </el-button>
    </el-badge>

    <el-button class="ml2 noprint"
      size="small"
      icon="el-icon-document"
      v-show="!isFullScreen"
      @click="printWindow">
      PDF
    </el-button>

    <el-button class="ml2 noprint"
      size="small"
      icon="el-icon-close"
      @click="minimizeApp"
      v-show="isFullScreen">
    </el-button>

    <span class="ml2 f6 dn print mid-gray">
      {{ currentDatetime }}
    </span>

  </nav>
</template>

<script>
import fs from 'fs'
import moment from 'moment'
import { remote, shell } from 'electron'

export default {

  name: 'MainNavigation',

  i18n: {
    messages: {
      de: {
        buttons: {
          import: 'DATENIMPORT'
        },
        options: {
          malfunctionAnalysis: 'Fehleranalyse',
          productionAnalysis: 'Produktionsanalyse'
        }
      }
    }
  },

  data () {
    return {
      currentRouteName: '',
      currentDatetime: moment().format('DD.MM.YYYY HH:mm')
    }
  },

  computed: {
    dirtyResourceCount () {
      return this.$store.getters.dirtyResourceList.length
    },

    hasDirectory () {
      return !!this.$store.state.resources.directory
    },

    isSidebarVisible () {
      return this.$store.state.isSidebarVisible
    },

    isFullScreen () {
      return this.$store.state.isFullScreen
    },

    isConsuming () {
      return this.$store.getters.isConsuming
    },

    routeOptions () {
      return [
        { label: this.$t('options.malfunctionAnalysis'), name: 'MalfunctionAnalysis' },
        { label: this.$t('options.productionAnalysis'), name: 'ProductionAnalysis' }
      ]
    }
  },

  methods: {
    navigateTo (routeName) {
      this.$router.push({ name: routeName })
    },

    toggleIsSidebarVisible () {
      this.$store.commit('SET_IS_SIDEBAR_VISIBLE', !this.isSidebarVisible)
    },

    minimizeApp () {
      this._win.minimize()
    },

    printWindow () {
      remote.dialog.showSaveDialog(this._win, { filters: [{ name: 'PDF', extensions: ['pdf'] }] }, path => {
        if (!path) return

        this._win.webContents.printToPDF({ marginsType: 2, pageSize: 'A4', landscape: true }, (error, data) => {
          if (error) {
            console.log(error)
            return
          }

          fs.writeFile(path, data, error => {
            if (error) console.log(error)
            else shell.openItem(path)
          })
        })
      })
    }
  },

  created () {
    this.currentRouteName = this.$route.name

    this._timer = setInterval(() => {
      this.currentDatetime = moment().format('DD.MM.YYYY HH:mm')
    }, 60000)

    this._win = remote.getCurrentWindow()
  },

  beforeDestroy () {
    if (this._timer) {
      clearInterval(this._timer)
      delete this._timer
    }

    if (this._win) {
      delete this._win
    }
  }

}
</script>

<style lang="scss">
  .main-navigation__select {
    min-width: 300px;
  }

  .main-navigation__import {
    .el-badge__content {
      top: -5px;
      left: -5px;
      right: auto;
      transform: none;
    }
  }
</style>
