import { createRouter, createWebHistory } from 'vue-router'
import Main from './components/Main'

const routes = [
  { path: '/', component: Main },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
