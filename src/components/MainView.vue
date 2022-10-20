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
    v-if="file.name"
  >
    File infos:
  </h3>
  <div
    v-if="file.name"
    class="file-info"
  >
    NAME: {{ file.name }}<br />
    TYPE: {{ file.type }}<br />
    SIZE: {{ file.size }} bytes<br />
    DATE: {{ file.lastModified }}
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
import { mapActions, mapWritableState } from 'pinia'
import { store } from '../store'

export default defineComponent({
  name: 'MainView',
  expose: [],
  components: { BlockCell },

  data () {
    return {
      loading: false,
      loadingProgress: 0,
      unfold: false,
    }
  },

  computed: {
    ...mapWritableState(store, [ 'file', 'blocks' ]),
  },

  methods: {
    ...mapActions(store, ['updateBlocks']),

    load (event: Event) {
      const eventTarget = event.target as HTMLInputElement
      const { files } = eventTarget
      this.loading = true

      if (!files?.[0]) throw new Error('File not found')

      this.file = {
        name: files[0].name,
        type: files[0].type,
        size: files[0].size,
        lastModified: new Date(files[0].lastModified),
        contents: '',
      }

      const reader = new FileReader()
      reader.onload = ({ target }) => {
        if (!target?.result || typeof target.result === 'string') {
          throw new Error('Unreadable file')
        }
        const uint = new Uint8Array(target.result)
        this.file.contents = uint8ToString(uint)
        this.loading = false
        this.blocks = [
          new Block({
            name: 'file',
            length: this.file.contents.length,
          }),
        ]
      }
      reader.readAsArrayBuffer(files[0])
    },
  },
})
</script>
