<template>
  <div
    class="bordered"
  >
    <div class="flex width-50">
      <div class="block-start-end bordered">
        {{ block.start }} <br /> {{ block.start + block.contents.length - 1 }}
      </div>
      {{ block.type }}
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
        <button
          v-if="block.subBlocks?.length"
          type="button"
          @click="showSubBlocks = !showSubBlocks"
        >
          {{ showSubBlocks ? 'Hide sub blocks' : 'Show sub blocks' }}
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
    <div
      v-if="showSubBlocks"
      class="subblocks"
    >
      <Block
        v-for="(subBlock, index) in block.subBlocks"
        :key="index"
        :block="subBlock"
      />
    </div>
  </div>
</template>

<script>
import { stringToHexString } from '../util/converters'

export default {
  name: 'Block',

  props: {
    block: Object,
  },

  emits: ['analyse'],

  data () {
    return {
      showText: false,
      showHex: false,
      showSubBlocks: false,
    }
  },

  computed: {
    blockHex () {
      return stringToHexString(this.block.contents)
    },
  },
}
</script>
