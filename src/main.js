import { createApp } from 'vue'

import App from './App'
import './style/main.css'
import { store } from './store'
import { router } from './routes'

export const Vue = createApp(App)
Vue.use(store)
Vue.use(router)
Vue.mount('#app')
