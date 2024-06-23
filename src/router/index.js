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
  },
  {
    path: '/search',
    component: () => import('../views/Search.vue'),
    props: route => ({ keywords: route.query.keywords, type: route.query.type })
  }
]
export default createRouter({
  history: createWebHistory(),
  routes
})
