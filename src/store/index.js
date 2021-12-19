import { createStore } from 'vuex'
import png from '../data/png'
import riff from '../data/riff'

import { mutations } from './mutations'

export const store = createStore({
  state: {
    blockInfos: [
      ...png,
      ...riff,
    ],
  },
  mutations,
  actions: {
    COMMIT_MUTATION ({ commit }, { mutation, params }) {
      commit(mutation, params)
    },
  },
})
