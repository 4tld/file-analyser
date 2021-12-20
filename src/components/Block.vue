<template>
  <div
    class="bordered"
  >
    <div class="flex width-50">
      <div class="block-start-end bordered">
        {{ block.start }} <br /> {{ block.start + block.contents.length - 1 }}
      </div>
      <div>
        <div v-if="block.type === 'intbe32'">
          {{ intbe32 }}<br />
        </div>
        <div v-if="block.type === 'intle32'">
          {{ intle32 }}<br />
        </div>
        {{ block.name }} ({{ block.contents.length }})
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
          v-if="['ascii', 'fixed', 'unknown'].includes(block.type)"
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
        v-for="(subBlock, subBlockIndex) in block.subBlocks"
        :key="subBlockIndex"
        :index="subBlockIndex"
        :block="subBlock"
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
  stringToHexArray,
} from '../util/converters'

export default {
  name: 'Block',

  props: {
    block: Object,
    index: Number,
  },

  emits: ['update-blocks'],

  data () {
    return {
      showText: false,
      showHex: false,
      showSubBlocks: false,
    }
  },

  computed: {
    ...mapState({
      blockInfos: 'blockInfos',
    }),

    blockHex () {
      return stringToHexArray(this.block.contents).join('.')
    },

    intbe32 () {
      return bigEndian32StringToNumber(this.block.contents)
    },

    intle32 () {
      return littleEndian32StringToNumber(this.block.contents)
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
