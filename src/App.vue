<template>
  <RouterView />
  <div
    v-if="error"
    class="box error"
  >
    An error occurred: {{ error.message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  components: {
    RouterView,
  },

  data () {
    return {
      error: false as false|Error,
    }
  },

  errorCaptured (error) {
    this.error = error as Error
  },
})
</script>
