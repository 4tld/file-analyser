import { createStore } from 'vuex'
import png from '../data/png'
import riff from '../data/riff'
import magic from '../data/magic'

export const store = createStore({
  state: {
    blockInfos: [
      ...png,
      ...riff,
      ...magic,
    ],
    type: [
      'chunk',
      'binary',
      'fixed',
      'intbe32',
      'intle32',
      'ascii',
      'unknown',
    ],
  },
  mutations: {},
  actions: {},
})
