import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import { Icon } from '@iconify/vue'
import componenets from '@/components'
createApp(App).use(componenets).use(Icon).use(router).mount('#app')
