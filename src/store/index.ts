import { defineStore } from 'pinia'
import type { Block } from '../classes'

export const store = defineStore('file', {
  state: () => ({
    file: {
      name: '',
      contents: '',
      type: '',
      size: 0,
      lastModified: new Date(),
    },
    blocks: [] as Block[],

  }),
  actions: {
    updateBlocks (blocksToSplice: Block[], index: number) {
      this.blocks.splice(index, 1, ...blocksToSplice)
    },
  },
})
