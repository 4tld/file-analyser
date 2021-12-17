import { createStore } from 'vuex'

import { mutations } from './mutations'

export const store = createStore({
  state: {
    blockInfos: [
      {
        name: 'PNG Magic Number',
        pattern: /\x89PNG\r\n\x1A\n/u,
        length: 8,
      },
      {
        name: 'PNG IHDR Header',
        pattern: /.{4}IHDR/su,
        length: 8,
      },
      {
        name: 'PNG PLTE Header',
        pattern: /.{4}PLTE/su,
        length: 8,
      },
      {
        name: 'PNG IDAT Header',
        pattern: /.{4}IDAT/su,
        length: 8,
      },
      {
        name: 'PNG IEND Header',
        pattern: /.{4}IEND/su,
        length: 8,
      },
      {
        name: 'PNG bKGD Header',
        pattern: /.{4}bKGD/su,
        length: 8,
      },
      {
        name: 'PNG cHRM Header',
        pattern: /.{4}cHRM/su,
        length: 8,
      },
      {
        name: 'PNG dSIG Header',
        pattern: /.{4}eXIF/su,
        length: 8,
      },
      {
        name: 'PNG gAMA Header',
        pattern: /.{4}gAMA/su,
        length: 8,
      },
      {
        name: 'PNG hIST Header',
        pattern: /.{4}hIST/su,
        length: 8,
      },
      {
        name: 'PNG iCCP Header',
        pattern: /.{4}iCCP/su,
        length: 8,
      },
      {
        name: 'PNG iTXt Header',
        pattern: /.{4}iTXt/su,
        length: 8,
      },
      {
        name: 'PNG pHYs Header',
        pattern: /.{4}pHYs/su,
        length: 8,
      },
      {
        name: 'PNG sBIT Header',
        pattern: /.{4}sBIT/su,
        length: 8,
      },
      {
        name: 'PNG sPLT Header',
        pattern: /.{4}sPLT/su,
        length: 8,
      },
      {
        name: 'PNG sRGB Header',
        pattern: /.{4}sRGB/su,
        length: 8,
      },
      {
        name: 'PNG sTER Header',
        pattern: /.{4}sTER/su,
        length: 8,
      },
      {
        name: 'PNG tEXt Header',
        pattern: /.{4}tEXt/su,
        length: 8,
      },
      {
        name: 'PNG tIME Header',
        pattern: /.{4}tIME/su,
        length: 8,
      },
      {
        name: 'PNG tRNS Header',
        pattern: /.{4}tRNS/su,
        length: 8,
      },
      {
        name: 'PNG zTXt Header',
        pattern: /.{4}zTXt/su,
        length: 8,
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
