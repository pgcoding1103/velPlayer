import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import { Icon } from '@iconify/vue'
createApp(App).use(Icon).use(router).mount('#app')
