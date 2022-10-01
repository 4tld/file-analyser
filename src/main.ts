import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './style/main.css'
import { router } from './routes'

export const vue = createApp(App)
vue.use(router)
vue.use(createPinia())
vue.mount('#app')
