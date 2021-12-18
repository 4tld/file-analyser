<template>
  <div
    class="bordered"
  >
    <div class="flex width-50">
      {{ block.start }} : {{ block.type }}
      <div class="flex--align-right">
        <button
          v-if="!block.analysed"
          type="button"
          @click="$emit('analyse', block)"
        >
          Analyse
        </button>
        <button
          type="button"
          @click="showText = !showText"
        >
          {{ showText ? 'Hide text' : 'Show text' }}
        </button>
        <button
          type="button"
          @click="showHex = !showHex"
        >
          {{ showHex ? 'Hide hex' : 'Show hex' }}
        </button>
      </div>
    </div>
    <div class="flex">
      <textarea
        v-if="showText"
        :value="block.contents"
        readonly
      />
      <textarea
        v-if="showHex"
        :value="blockHex"
        readonly
      />
    </div>
  </div>
</template>

<script>
import { stringToHexString } from '../util/converters'

export default {
  props: {
    block: Object,
  },

  emits: ['analyse'],

  data () {
    return {
      showText: false,
      showHex: false,
    }
  },

  computed: {
    blockHex () {
      return stringToHexString(this.block.contents)
    },
  },
}
</script>
