import { createStore } from 'vuex'
import png from '../data/png'

import { mutations } from './mutations'

export const store = createStore({
  state: {
    blockInfos: [
      ...png,
    ],
  },
  mutations,
  actions: {
    COMMIT_MUTATION ({ commit }, { mutation, params }) {
      commit(mutation, params)
    },
  },
})
