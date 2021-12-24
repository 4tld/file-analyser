<template>
  <div
    class="bordered"
  >
    <div class="flex width-50">
      <div class="block-start-end bordered">
        {{ block.start }} <br /> {{ block.start + block.contents.length - 1 }}
      </div>
      <div>
        {{ block.name }} ({{ block.contents.length % 1024 ? block.contents.length : `${block.contents.length / 1024} kb` }})<br />
        <div v-if="block.type === 'intbe32'">
          {{ intbe32 }}
        </div>
        <div v-if="block.type === 'intle32'">
          {{ intle32 }}
        </div>
        <div v-if="block.type === 'intss32'">
          {{ intss32 }}
        </div>
        <div v-if="block.description">
          {{ block.description }}
        </div>
      </div>
      <div class="flex--align-right">
        <button
          v-if="!block.analysed"
          type="button"
          @click="analyseBlock"
        >
          Analyse
        </button>
        <button
          v-if="allowText"
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
          v-if="allowBinary"
          type="button"
          @click="showBinary = !showBinary"
        >
          {{ showBinary ? 'Hide binary' : 'Show binary' }}
        </button>
        <button
          v-if="!unfold && block.subBlocks?.length"
          type="button"
          @click="showSubBlocks = !showSubBlocks"
        >
          {{ showSubBlocks ? 'Hide sub blocks' : 'Show sub blocks' }}
        </button>
      </div>
    </div>
    <div class="flex">
      <textarea
        v-if="allowText && showText"
        :value="block.contents"
        readonly
      />
      <textarea
        v-if="showHex"
        :value="blockHex"
        readonly
      />
      <textarea
        v-if="allowBinary && showBinary"
        :value="blockBinary"
        readonly
      />
    </div>
    <div
      v-if="showSubBlocks || unfold"
      class="subblocks"
    >
      <BlockCell
        v-for="(subBlock, subBlockIndex) in block.subBlocks"
        :key="subBlockIndex"
        :index="subBlockIndex"
        :block="subBlock"
        :unfold="unfold"
        @update-blocks="updateBlocks"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  bigEndian32StringToNumber,
  littleEndian32StringToNumber,
  stringToBinary,
  stringToHexArray,
  syncsafe32StringToNumber,
} from '../util/converters'

export default {
  name: 'BlockCell',

  props: {
    block: Object,
    index: Number,
    unfold: Boolean,
  },

  emits: ['update-blocks'],

  data () {
    return {
      showText: false,
      showHex: false,
      showBinary: false,
      showSubBlocks: false,
    }
  },

  computed: {
    ...mapState({
      blockInfos: 'blockInfos',
    }),

    allowText () {
      return [ 'ascii', 'fixed', 'unknown' ].includes(this.block.type)
    },

    allowBinary () {
      return ['binary'].includes(this.block.type)
    },

    blockHex () {
      return stringToHexArray(this.block.contents).join('.')
    },

    blockBinary () {
      return stringToBinary(this.block.contents)
    },

    intbe32 () {
      return bigEndian32StringToNumber(this.block.contents)
    },

    intle32 () {
      return littleEndian32StringToNumber(this.block.contents)
    },

    intss32 () {
      return syncsafe32StringToNumber(this.block.contents)
    },
  },

  methods: {
    analyseBlock () {
      this.loading = true
      const newBlock = []
      let blocksToAnalyse = [this.block]
      for (const blockInfo of this.blockInfos) {
        const newBTA = blocksToAnalyse
        let continueAnalyse = true
        while (continueAnalyse) {
          continueAnalyse = false
          for (const blockToAnalyse of blocksToAnalyse) {
            const match = blockToAnalyse.contents.match(blockInfo.pattern)
            if (match) {
              let theBlock = {}
              if (blockInfo.createBlock) {
                theBlock = blockInfo.createBlock(match)
              }
              const { index: matchIndex } = match
              const matchLength = match[0]?.length
              continueAnalyse = true
              const contents = theBlock.contents || blockToAnalyse.contents.slice(matchIndex, matchIndex + matchLength)
              newBlock.push({
                start: matchIndex + blockToAnalyse.start,
                name: blockInfo.name,
                type: blockInfo.type || 'unknown',
                analysed: true,
                contents,
                ...theBlock,
              })
              const leftBlock = {
                start: blockToAnalyse.start,
                name: 'unknown',
                type: 'unknown',
                analysed: false,
                contents: blockToAnalyse.contents.slice(0, matchIndex),
              }
              const rightBlock = {
                start: blockToAnalyse.start + matchIndex + contents.length,
                name: 'unknown',
                type: 'unknown',
                analysed: false,
                contents: blockToAnalyse.contents.slice(matchIndex + contents.length),
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
      }
      if (newBlock.length) {
        const blocksToSplice = [ ...newBlock, ...blocksToAnalyse ].sort(({ start: start1 }, { start: start2 }) => start1 - start2)
        this.$emit('update-blocks', blocksToSplice, this.index)
      } else {
        this.$emit('update-blocks', [{ ...this.block, analysed: true }], this.index)
      }
      this.loading = false
    },

    updateBlocks (blocksToSplice, index) {
      const newBlock = this.block
      newBlock.subBlocks.splice(index, 1, ...blocksToSplice)
      this.$emit('update-blocks', [newBlock], this.index)
    },
  },
}
</script>
