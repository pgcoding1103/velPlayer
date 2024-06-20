import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from '@/router'
import componenets from '@/components'
import 'element-plus/theme-chalk/el-message.css'

const pinia = createPinia()
const app = createApp(App)
import { initLogin } from './utils/user'
app.use(pinia).use(router).use(componenets)
//初始化登录信息后再加载
initLogin().then(() => app.mount('#app'))
