import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from '@/router'
import { Icon } from '@iconify/vue'
import componenets from '@/components'

const pinia = createPinia()
createApp(App).use(componenets).use(Icon).use(pinia).use(router).mount('#app')
