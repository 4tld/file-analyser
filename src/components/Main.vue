<template>
  <input
    type="file"
    @change="load"
  />
  <br />
  <div
    v-if="loading"
  >
    <label for="loading">Loading...</label>
    <progress
      id="loading"
      max="100"
      :value="loadingProgress"
    />
  </div>
  <h3
    v-if="fileInfos.set"
  >
    File infos:
  </h3>
  <div
    v-if="fileInfos.set"
    class="bordered"
  >
    NAME: {{ fileInfos.name }}<br />
    TYPE: {{ fileInfos.type }}<br />
    SIZE: {{ fileInfos.size }} bytes<br />
    DATE: {{ fileInfos.lastModifiedDate }}
  </div>
  <button
    v-if="fileString && !blocks.length"
    type="button"
    @click="generateBlocks"
  >
    Generate blocks
  </button>
  <h3
    v-if="blocks.length"
  >
    Blocks :
  </h3>
  <Block
    v-for="(block, index) in blocks"
    :key="index"
    :block="block"
    @analyse="analyseBlock"
  />
</template>

<script>
import { mapState } from 'vuex'
import { uint8ToHexString, uint8ToString } from '../util/converters'
import Block from './Block'

export default {
  components: {
    Block,
  },

  data () {
    return {
      loading: false,
      loadingProgress: 0,
      hexDump: '',
      fileString: '',
      blocks: [],
      fileInfos: {
        set: false,
        name: '',
        type: '',
        size: '',
        lastModifiedDate: '',
      },
    }
  },

  computed: mapState({
    blockInfos: 'blockInfos',
  }),

  methods: {
    load ({ target: { files } }) {
      this.loading = true

      this.fileInfos = {
        set: true,
        name: files[0].name,
        type: files[0].type,
        size: files[0].size,
        lastModifiedDate: files[0].lastModifiedDate,
      }

      const reader = new FileReader()
      reader.onload = ({ target }) => {
        const uint = new Uint8Array(target.result)
        this.fileString = uint8ToString(uint)
        this.hexDump = uint8ToHexString(uint)
        this.loading = false
      }
      reader.readAsArrayBuffer(files[0])
    },

    generateBlocks () {
      this.blocks = [
        {
          start: 0,
          type: 'binary',
          analysed: false,
          contents: this.fileString,
        },
      ]
    },

    analyseBlock (block) {
      this.loading = true
      const newBlock = []
      let blocksToAnalyse = [block]
      for (const blockInfo of this.blockInfos) {
        const newBTA = blocksToAnalyse
        for (const blockToAnalyse of blocksToAnalyse) {
          const index = blockToAnalyse.contents.indexOf(blockInfo.pattern)
          if (index >= 0) {
            newBlock.push({
              start: index + blockToAnalyse.start,
              type: blockInfo.name,
              analysed: true,
              contents: blockToAnalyse.contents.slice(index, index + blockInfo.pattern.length),
            })
            const leftBlock = {
              start: blockToAnalyse.start,
              type: 'binary',
              analysed: false,
              contents: blockToAnalyse.contents.slice(0, index),
            }
            const rightBlock = {
              start: index + blockInfo.pattern.length,
              type: 'binary',
              analysed: false,
              contents: blockToAnalyse.contents.slice(index + blockInfo.pattern.length),
            }
            const blocksToPush = []
            if (leftBlock.contents.length) {
              blocksToPush.push(leftBlock)
            }
            if (rightBlock.contents.length) {
              blocksToPush.push(rightBlock)
            }
            newBTA.splice(newBTA.findIndex((el) => blockToAnalyse === el), 1, ...blocksToPush)
          }
        }
        blocksToAnalyse = newBTA
      }
      if (newBlock.length) {
        const blocksToSplice = [ ...newBlock, ...blocksToAnalyse ].sort(({ start: start1 }, { start: start2 }) => start1 - start2)
        this.blocks.splice(this.blocks.findIndex((el) => block === el), 1, ...blocksToSplice)
      }
      this.loading = false
    },
  },
}
</script>
