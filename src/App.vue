<template>
  <Main />
  <div
    v-if="error"
    class="bordered error"
  >
    An error occurred: {{ error.message }}
  </div>
</template>

<script>
import Main from './components/Main'

export default {
  components: {
    Main,
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
