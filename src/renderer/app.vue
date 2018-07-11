<template>
  <div id="app">
    <el-container>

      <el-header class="bb b--element-gray shadow-4">
        <main-navigation></main-navigation>
      </el-header>

      <el-container>

        <el-main class="pa0 overflow-hidden">
          <router-view></router-view>
        </el-main>

        <el-aside class="bl b--element-gray noprint"
          width="400px"
          v-show="isSidebarVisible">
          <resource-list></resource-list>
        </el-aside>

      </el-container>

    </el-container>
  </div>
</template>

<script>
import storage from '@/storage'
import { remote } from 'electron'

import MainNavigation from './components/main-navigation'
import ResourceList from './components/resource-list'

export default {

  name: 'App',

  computed: {
    locale () {
      return this.$store.state.locale
    },

    isSidebarVisible () {
      return this.$store.state.isSidebarVisible
    }
  },

  watch: {
    locale () {
      this.$i18n.locale = this.locale
    }
  },

  created () {
    this.$store.dispatch('load', storage.store)

    if (storage.get('isFullScreen')) {
      remote.getCurrentWindow().setFullScreen(true)
    }
  },

  components: {
    MainNavigation,
    ResourceList
  }

}
</script>

<style lang="scss">
  @import '~@/styles/main';

  #app {
    width: 100vw;
    height: 100vh;
    display: flex
  }
</style>
