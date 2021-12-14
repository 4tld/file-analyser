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
  </div>
</template>

<script>
export default {
  props: {
    block: Object,
  },

  emits: ['analyse'],
}
</script>
