import { createRouter, createWebHistory } from 'vue-router'
import Main from './components/Main'
import Progress from './components/Progress'

const routes = [
  { path: '/', component: Main },
  { path: '/progress', component: Progress },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
