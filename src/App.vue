<template>
  <RouterView />
  <div
    v-if="error"
    class="bordered error"
  >
    An error occurred: {{ error.message }}
  </div>
</template>

<script>
import { RouterView } from 'vue-router'

export default {
  components: {
    RouterView,
  },

  data () {
    return {
      error: false,
    }
  },

  errorCaptured (error) {
    this.error = error
  },
}
</script>
