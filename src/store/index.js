import { createStore } from 'vuex'
import png from '../data/png'
import riff from '../data/riff'
import magic from '../data/magic'
import mp4 from '../data/mp4'
import id3 from '../data/id3'

export const store = createStore({
  state: {
    blockInfos: [
      ...id3,
      ...magic,
      ...mp4,
      ...png,
      ...riff,
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
