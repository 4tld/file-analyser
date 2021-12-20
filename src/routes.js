import { createRouter, createWebHistory } from 'vue-router'
import MainView from './components/MainView'

const routes = [
  { path: '/', component: MainView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
