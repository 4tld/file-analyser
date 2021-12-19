import { createStore } from 'vuex'
import png from '../data/png'
import riff from '../data/riff'

export const store = createStore({
  state: {
    blockInfos: [
      ...png,
      ...riff,
    ],
  },
  mutations: {},
  actions: {},
})
