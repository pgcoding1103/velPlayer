import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/playlist',
    component: () => import('../views/PlayList.vue'),
    props: route => ({ id: route.query.id })
  }
]
export default createRouter({
  history: createWebHistory(),
  routes
})
