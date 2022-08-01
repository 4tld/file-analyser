<template>
  <div
    class="box"
  >
    <div class="flex width-50">
      <div class="block-start-end box">
        {{ block.start }} <br /> {{ block.end }}
      </div>
      <div>
        {{ block.name }} ({{ block.length % 1024 ? block.length : `${block.length / 1024} KB` }})<br />
        <div v-if="block.type in blockContent">
          {{ blockContent[block.type as keyof typeof blockContent](file.contents.slice(block.start, block.end + 1)) }}
        </div>
        <div v-if="block.description">
          {{ block.description }}
        </div>
      </div>
      <div class="flex--align-right">
        <button
          v-if="!block.analysed"
          type="button"
          class="button-icon"
          @click="analyseBlock"
        >
          <img src="/assets/analyse.svg" />
          <span>Analyse</span>
        </button>
        <div class="flex flex--align-right">
          <div
            v-for="(type, key) in blockView"
            :key="key"
          >
            <button
              v-if="type.allow(block.type)"
              type="button"
              class="button-icon"
              :title="type.show ? `Hide ${type.name}` : `Show ${type.name}`"
              @click="type.show = !type.show"
            >
              <img :src="`/assets/${type.name}${type.show ? '-disabled' : ''}.svg`" />
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
          {{ type.content(file.contents.slice(block.start, block.end + 1)) }}
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

<script lang="ts">
import { Block } from '../classes'
import {
  bigEndian32StringToNumber,
  littleEndian32StringToNumber,
  stringToBinary,
  stringToHexArray,
  syncsafe32StringToNumber,
} from '../util/converters'
import { blockInfos } from '../data'
import { ChunkTypes } from '../util/types'
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { store } from '../store'

export default defineComponent({
  name: 'BlockCell',

  props: {
    block: { type: Block, required: true },
    index: Number,
    unfold: Boolean,
  },

  emits: ['updateBlocks'],

  data () {
    return {
      blockInfos,
      showSubBlocks: false,
      blockContent: {
        [ChunkTypes.intbe32]: bigEndian32StringToNumber,
        [ChunkTypes.intle32]: littleEndian32StringToNumber,
        [ChunkTypes.intss32]: syncsafe32StringToNumber,
      },

      blockView: [
        {
          name: 'text',
          show: false,
          allow: (type: ChunkTypes) => [ ChunkTypes.ascii, ChunkTypes.fixed, ChunkTypes.unknown ].includes(type),
          content: (contents: string) => contents,
        },
        {
          name: 'hex',
          show: false,
          allow: () => true,
          content: (contents: string) => stringToHexArray(contents).join('.'),
        },
        {
          name: 'binary',
          show: false,
          allow: (type: ChunkTypes) => [ChunkTypes.binary].includes(type),
          content: stringToBinary,
        },
      ],
    }
  },

  computed: {
    ...mapState(store, ['file']),
  },

  methods: {
    analyseBlock () {
      this.block.update({ analysed: true })
      const matches: Block[] = []
      this.blockInfos.forEach((blockInfo) => {
        matches.push(...blockInfo.findMatches(this.file, [ this.block.start, this.block.end ]))
      })
      if (matches.length) {
        const blocksToSplice = this.findBlocksFromMatches(this.block, matches)
        this.$emit('updateBlocks', blocksToSplice, this.index)
      }
    },

    findBlocksFromMatches (block: Block, matches: Block[]) {
      const blocks = []
      matches.sort((b1, b2) => b1.start - b2.start)
      let pointer = block.start
      for (const match of matches) {
        if (match.start > pointer) {
          blocks.push(new Block({
            start: pointer,
            name: 'unknown',
            length: match.start - pointer,
          }))
          pointer = match.start
        } else if (match.start < pointer) {
          // eslint-disable-next-line no-console
          console.warn('Duplicate block found: ', match)
          continue
        }
        blocks.push(match)
        pointer += match.length
      }
      if (pointer < block.end) {
        blocks.push(new Block({
          start: pointer,
          name: 'unknown',
          length: block.end + 1 - pointer,
        }))
      }
      return blocks
    },

    updateBlocks (blocksToSplice: Block[], index: number) {
      const newBlock = this.block
      newBlock.subBlocks.splice(index, 1, ...blocksToSplice)
      this.$emit('updateBlocks', [newBlock], this.index)
    },
  },
})
</script>
