import * as types from './mutations_type.js'
// import Vue from 'vue'

export const state = {
  count: 0,
  title: '',
  personnlFilter: ''
}

// mutations
export const mutations = {
  [types.INCREASE] (state) {
    state.count += 1
  },
  [types.DECREASE] (state) {
    state.count -= 1
  },

  [types.title] (state, status) {
    state.title = status
  },

  [types.personnlFilter] (state, status) {
    state.personnlFilter = status
  }
}
