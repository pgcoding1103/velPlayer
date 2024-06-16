import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { getAccountLoginState, logout } from '@/api/login'
import { ElMessage } from 'element-plus'
export const useUser = defineStore('user', () => {
  const userinfo = ref(null)
  const username = computed(() => userinfo.value && userinfo.value.nickname)
  const avatarUrl = computed(() => userinfo.value && userinfo.value.avatarUrl)
  const islogin = computed(() => userinfo.value !== null)
  const uid = computed(() => (userinfo.value && userinfo.value.userId) || 0)
  async function login(newcookie) {
    newcookie ? localStorage.setItem('cookie', newcookie) : ''
    const userBaseInfo = await getAccountLoginState()
    if (userBaseInfo) {
      //如果返回了账号信息，则表示登录成功，更新用户信息并设置登录状态为已登录
      userinfo.value = userBaseInfo
      ElMessage.success(`欢迎回来，${username.value}`)
      return true
    } else {
      ElMessage.warning('登录以使用更多功能！')
    }
  }
  function logoutAccount() {
    logout().then(() => {
      // 清除用户信息
      userinfo.value = null
      localStorage.removeItem('cookie')
      ElMessage.success('已退出登录')
    })
  }
  return {
    userinfo,
    avatarUrl,
    username,
    islogin,
    uid,
    login,
    logoutAccount
  }
})
