import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      ignored: ['**/coverage/**'],
    },
  },
  test: {
    include: ['__tests__/**'],
    coverage: {
      all: true,
      enabled: true,
      include: ['src'],
    },
  },
})
