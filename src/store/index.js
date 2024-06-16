import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { getAccountLoginState, logout } from '@/api/login'
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
      return true
    } else {
      //如果返回了账号信息，则表示登录失败，设置登录状态为未登录
      throw new Error('登录失败')
    }
  }
  function logoutAccount() {
    logout().then(() => {
      // 清除用户信息
      userinfo.value = null
      localStorage.removeItem('cookie')
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
