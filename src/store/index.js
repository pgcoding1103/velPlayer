import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getAccountLoginState, logout } from '@/api/login'
import { ElMessage } from 'element-plus'
export const useUser = defineStore('user', () => {
  const userinfo = ref(null)
  const username = computed(() => userinfo.value && userinfo.value.nickname)
  const avatarUrl = computed(() => userinfo.value && userinfo.value.avatarUrl)
  const islogin = computed(() => userinfo.value !== null)
  const uid = computed(() => (userinfo.value && userinfo.value.userId) || 0)
  async function initUserInfo() {
    userinfo.value = await getAccountLoginState()
  }
  async function removeUserInfo() {
    await logout()
    // 清除用户信息
    userinfo.value = null
    localStorage.removeItem('cookie')
    ElMessage.success('已退出登录')
  }
  return {
    userinfo,
    avatarUrl,
    username,
    islogin,
    uid,
    initUserInfo,
    removeUserInfo
  }
})
