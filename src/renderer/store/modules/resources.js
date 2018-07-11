import Vue from 'vue'
import mm from 'micromatch'
import { merge } from 'lodash'
import service from '@/services/resources'

const state = {
  directory: '',

  files: {},
  fileIDList: [],

  configList: [],

  isDatabasePersistent: false,
  isAutoConsumeEnabled: false
}

const mutations = {
  SET_RESOURCES_DIRECTORY (state, directory) {
    state.directory = directory
  },

  ADD_FILE (state, file) {
    Vue.set(state.files, file.id, file)
    state.fileIDList.push(file.id)
  },

  REMOVE_FILE (state, id) {
    Vue.delete(state.files, id)
    state.fileIDList = state.fileIDList.filter(e => e !== id)
  },

  EDIT_FILE (state, { id, edits }) {
    merge(state.files[id], edits)
  },

  CLEAR_FILES (state) {
    state.files = {}
    state.fileIDList = []
  },

  RECEIVE_CONFIGS (state, configs) {
    state.configList = configs
  },

  SET_IS_DATABASE_PERSISTENT (state, isDatabasePersistent) {
    state.isDatabasePersistent = isDatabasePersistent
  },

  SET_IS_AUTO_CONSUME_ENABLED (state, isAutoConsumeEnabled) {
    state.isAutoConsumeEnabled = isAutoConsumeEnabled
  }
}

const actions = {
  async createFile ({ state, commit }, path) {
    commit('ADD_FILE', await service.createFile(path, state.fileIDList))
  },

  async refreshFileHash ({ commit }, file) {
    try {
      const hash = await service.createHash(file.path)

      if (hash !== file.hash) {
        commit('EDIT_FILE', { id: file.id, edits: { hash } })
      }
    } catch (error) {
      console.log(error)
    }
  },

  async consumeResource ({ commit }, resource) {
    const { id, hash } = resource

    commit('EDIT_FILE', { id, edits: { consume: { hash, status: 'pending', response: null, error: null } } })

    try {
      const response = await service.consumeResource(resource)
      console.log(response.filter(e => e.ok).length)
      commit('EDIT_FILE', { id, edits: { consume: { status: 'successful', response: response.filter(e => e.ok).length } } })
    } catch (error) {
      commit('EDIT_FILE', { id, edits: { consume: { status: 'failed', error } } })
    }
  }
}

const getters = {
  fileList (state) {
    return state.fileIDList.map(e => state.files[e])
  },

  fileConfig (state) {
    return file => {
      return state.configList.find(e => mm.isMatch(file.name, e.pattern))
    }
  },

  resourceList (state, getters) {
    const resources = []

    let file, config

    for (file of getters.fileList) {
      config = getters.fileConfig(file)

      if (config) {
        resources.push({ ...file, config })
      }
    }

    return resources
  },

  dirtyResourceList (state, getters) {
    return getters.resourceList.filter(e => e.hash !== e.consume.hash)
  },

  isConsuming (state, getters) {
    return !!getters.fileList.find(e => e.consume.status === 'pending')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
