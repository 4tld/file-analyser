import { createStore } from 'vuex'
import png from '../data/png'
import riff from '../data/riff'
import magic from '../data/magic'
import mp4 from '../data/mp4'

export const store = createStore({
  state: {
    blockInfos: [
      ...png,
      ...riff,
      ...magic,
      ...mp4,
    ],
    types: [
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
