import { createStore } from 'vuex'

import { mutations } from './mutations'

export const store = createStore({
  state: {
    blockInfos: [
      {
        name: 'png',
        pattern: '\x89PNG\r\n\x1A\n',
      },
    ],
  },
  mutations,
  actions: {
    COMMIT_MUTATION ({ commit }, { mutation, params }) {
      commit(mutation, params)
    },
  },
})
