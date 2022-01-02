<template>
  <div
    class="box"
  >
    <div class="flex width-50">
      <div class="block-start-end box">
        {{ block.start }} <br /> {{ block.start + block.contents.length - 1 }}
      </div>
      <div>
        {{ block.name }} ({{ block.contents.length % 1024 ? block.contents.length : `${block.contents.length / 1024} KB` }})<br />
        <div v-if="blockContent[block.type]">
          {{ blockContent[block.type](block.contents) }}
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
        <div class="flex">
          <div
            v-for="(type, key) in blockView"
            :key="key"
          >
            <button
              v-if="type.allow(block.type)"
              type="button"
              class="button-icon"
              @click="type.show = !type.show"
            >
              <img
                :src="require(`../assets/${type.name}${type.show ? '-disabled' : ''}.svg`)"
                :title="type.show ? `Hide ${type.name}` : `Show ${type.name}`"
              />
            </button>
          </div>
        </div>
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
      <div
        v-for="(type, key) in blockView"
        :key="key"
        class="window-container"
      >
        <div
          v-if="type.show && type.allow(block.type)"
          class="window"
        >
          {{ type.content(block.contents) }}
        </div>
      </div>
    </div>
    <div
      v-if="showSubBlocks || unfold"
      class="sub-blocks"
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
      showSubBlocks: false,
      blockContent: {
        intbe32: bigEndian32StringToNumber,
        intle32: littleEndian32StringToNumber,
        intss32: syncsafe32StringToNumber,
      },

      blockView: [
        {
          name: 'text',
          show: false,
          allow: (type) => [ 'ascii', 'fixed', 'unknown' ].includes(type),
          content: (contents) => contents,
        },

        {
          name: 'hex',
          show: false,
          allow: () => true,
          content: (contents) => stringToHexArray(contents).join('.'),
        },

        {
          name: 'binary',
          show: false,
          allow: (type) => ['binary'].includes(type),
          content: stringToBinary,
        },
      ],
    }
  },

  computed: mapState({
    blockInfos: 'blockInfos',
  }),

  methods: {
    analyseBlock () {
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
      const blocksToSplice = newBlock.length
        ? [ ...newBlock, ...blocksToAnalyse ].sort(({ start: start1 }, { start: start2 }) => start1 - start2)
        : [{ ...this.block, analysed: true }]
      this.$emit('update-blocks', blocksToSplice, this.index)
    },

    updateBlocks (blocksToSplice, index) {
      const newBlock = this.block
      newBlock.subBlocks.splice(index, 1, ...blocksToSplice)
      this.$emit('update-blocks', [newBlock], this.index)
    },
  },
}
</script>
