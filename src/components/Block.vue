<template>
  <div
    class="bordered"
  >
    {{ block.start }} : {{ block.type }}
    <button
      v-if="!block.analysed"
      type="button"
      @click="$emit('analyse', block)"
    >
      Analyse block
    </button>
    <button
      type="button"
      @click="showContent = !showContent"
    >
      {{ showContent ? 'Hide' : 'Show' }}
    </button>
    <textarea
      v-if="showContent"
      :value="block.contents"
      readonly
    />
  </div>
</template>

<script>
export default {
  props: {
    block: Object,
  },

  emits: ['analyse'],

  data () {
    return {
      showContent: false,
    }
  },
}
</script>
