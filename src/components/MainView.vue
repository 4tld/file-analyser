<template>
  <div class="flex">
    <img
      width="48"
      src="/favicon.svg"
    />
    <h1>&nbsp;4tld File Analyser</h1>
  </div>
  <label class="upload-label">
    Choose file
    <input
      type="file"
      class="upload-input"
      @change="load"
    />
  </label>
  <br />
  <div
    v-if="loading"
  >
    <label for="loading">Loading...&nbsp;</label>
    <progress
      id="loading"
      max="100"
      :value="loadingProgress"
    />
  </div>
  <h3
    v-if="fileInfos.name"
  >
    File infos:
  </h3>
  <div
    v-if="fileInfos.name"
    class="file-info"
  >
    NAME: {{ fileInfos.name }}<br />
    TYPE: {{ fileInfos.type }}<br />
    SIZE: {{ fileInfos.size }} bytes<br />
    DATE: {{ fileInfos.lastModified }}
  </div>
  <h3
    v-if="blocks.length"
  >
    Blocks :
  </h3>
  <button
    v-if="blocks.length"
    type="button"
    @click="unfold = !unfold"
  >
    {{ unfold ? 'Stop unfolding' : 'Unfold all blocks' }}
  </button>
  <br />
  <BlockCell
    v-for="(block, index) in blocks"
    :key="index"
    :index="index"
    :block="block"
    :unfold="unfold"
    @update-blocks="updateBlocks"
  />
</template>

<script lang="ts">
import { uint8ToString } from '../util/converters'
import { Block } from '../classes'
import BlockCell from './BlockCell.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    BlockCell,
  },

  data () {
    return {
      loading: false,
      loadingProgress: 0,
      fileString: '',
      blocks: [] as Block[],
      unfold: false,
      fileInfos: {
        name: '',
        type: '',
        size: 0,
        lastModified: new Date(),
      },
    }
  },

  methods: {
    load (event: Event) {
      const eventTarget = event.target as HTMLInputElement
      const { files } = eventTarget
      this.loading = true

      if (!files?.length) {
        throw new Error('File not found')
      }

      this.fileInfos = {
        name: files[0].name,
        type: files[0].type,
        size: files[0].size,
        lastModified: new Date(files[0].lastModified),
      }

      const reader = new FileReader()
      reader.onload = ({ target }) => {
        if (!target?.result || typeof target.result === 'string') {
          throw new Error('Unreadable file')
        }
        const uint = new Uint8Array(target.result)
        this.fileString = uint8ToString(uint)
        this.loading = false
        this.blocks = [
          new Block(
            {
              name: 'file',
              contents: this.fileString,
            },
          ),
        ]
      }
      reader.readAsArrayBuffer(files[0])
    },

    updateBlocks (blocksToSplice: Block[], index: number) {
      this.blocks.splice(index, 1, ...blocksToSplice)
    },
  },
})
</script>
