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
  name: 'App',
  expose: [],
  components: { RouterView },

  data () {
    return {
      error: false as Error|false,
    }
  },

  errorCaptured (error) {
    this.error = error as Error
  },
})
</script>
