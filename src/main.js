import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from '@/router'
import { Icon } from '@iconify/vue'
import componenets from '@/components'
import 'element-plus/theme-chalk/el-message.css'

const pinia = createPinia()
const app = createApp(App)
import { initLogin } from './utils/user'
app.use(componenets).use(Icon).use(pinia).use(router)
//初始化登录信息后再加载
await initLogin()
app.mount('#app')
