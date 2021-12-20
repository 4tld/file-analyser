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
  <BlockCell
    v-for="(block, index) in blocks"
    :key="index"
    :index="index"
    :block="block"
    @update-blocks="updateBlocks"
  />
</template>

<script>
import { mapState } from 'vuex'
import { uint8ToHexString, uint8ToString } from '../util/converters'
import BlockCell from './BlockCell'

export default {
  components: {
    BlockCell,
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

      this.hexDump = ''
      this.fileString = ''
      this.blocks = []

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
          name: 'unknown',
          type: 'unknown',
          analysed: false,
          contents: this.fileString,
        },
      ]
    },

    updateBlocks (blocksToSplice, index) {
      this.blocks.splice(index, 1, ...blocksToSplice)
    },
  },
}
</script>
