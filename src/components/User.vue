<script setup>
  import { computed, ref } from 'vue'
  import {
    createQRKey,
    getBase64QRImage,
    checkQRKey,
    sendCaptcha,
    verifyCaptcha,
    loginByCaptcha
  } from '../api/login'
  import { useUser } from '../store'
  import { storeToRefs } from 'pinia'

  const { islogin, avatarUrl, username } = storeToRefs(useUser())
  const { login, logoutAccount: logout } = useUser()
  const dialogVisible = ref(false)
  const QRImage = ref(null)
  const QRKey = ref('')
  const QRState = ref(801)
  const loading = ref(true) //二维码加载状态
  const loginWay = ref(0) //0:二维码登录 1:手机验证码登录
  const phone = ref('') //电话号
  const captcha = ref('') //验证码
  const isCounting = ref(false) //验证码是否在倒计时中
  const countdown = ref(60) //验证码倒计时
  const sendBtnText = computed(() =>
    isCounting.value ? `重新发送${countdown.value}` : '发送验证码'
  ) //发送验证码按钮文字
  const QRStateText = computed(() => {
    switch (QRState.value) {
      case 800:
        return '二维码过期'
      case 802:
        return '待确认'
      case 803:
        return '授权成功'
      default:
        return '等待扫码'
    }
  })
  //验证码登录
  async function captchaLogin() {
    const isRealCaptcha = await verifyCaptcha(phone.value, captcha.value)
    if (isRealCaptcha) {
      const { cookie, account } = await loginByCaptcha(
        phone.value,
        captcha.value
      )
      console.log(cookie, account)
      login(cookie)
      if (islogin) {
        dialogVisible.value = false //关闭弹窗
      } else {
        ElMessage.error('登录失败') //登录失败提示
      }
    }
    console.log(isRealCaptcha)
  }
  //处理登录按钮点击
  async function handleLoginBtnClick() {
    dialogVisible.value = true
    const key = await createQRKey()
    const base64Url = await getBase64QRImage(key)
    const img = new Image()
    img.src = base64Url
    img.onload = () => {
      loading.value = false
    }
    QRImage.value = base64Url
    // debugger
  }
  //获取验证码
  function getCaptcha() {
    sendCaptcha(phone.value)
    isCounting.value = true
    setTimeout(() => {
      isCounting.value = false
      countdown.value = 60 // 重置倒计时时间
    }, 60000)
    let timer2 = setInterval(() => {
      countdown.value--
      if (countdown.value === 0) {
        clearInterval(timer2)
      }
    }, 1000)
  }
  const timer = setInterval(async () => {
    const { code, cookie } = await checkQRKey(QRKey.value)
    switch (code) {
      case 800:
        QRState.value = 800
        break //二维码过期
      case 802:
        QRState.value = 802
        break //待确认
      case 803:
        QRState.value = 803
        localStorage.setItem('cookie', cookie)
        clearInterval(timer)
        break //授权成功
      default:
        QRState.value = 801
        break //等待扫码
    }
  }, 1000)
</script>
<template>
  <div class="aside-user">
    <div class="aside-user-info">
      <el-popover
        placement="top-start"
        :width="200"
        trigger="hover"
        v-if="islogin"
      >
        <template #reference>
          <div style="display: flex; align-items: center; gap: 20px">
            <el-text
              tag="b"
              size="large"
            >
              {{ username }}
            </el-text>
            <el-avatar
              :size="50"
              :src="avatarUrl"
            />
          </div>
        </template>
        <template #default>
          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 10px;
              justify-content: center;
            "
          >
            <el-text>{{ username }}</el-text>
            <el-button
              type="primary"
              @click="logout"
            >
              退出登录
            </el-button>
          </div>
        </template>
      </el-popover>

      <el-button
        type="primary"
        v-else
        @click="handleLoginBtnClick"
      >
        登录
      </el-button>
    </div>
    <!-- 扫码对话框 -->
    <el-dialog
      v-model="dialogVisible"
      width="350"
      align-center
    >
      <template #footer>
        <div class="aside-user-dialog">
          <!-- 手机号登录 -->
          <el-form
            v-if="loginWay"
            label-position="top"
            style="width: 280px"
          >
            <el-form-item
              prop="phone"
              label="手机号"
            >
              <el-input
                v-model="phone"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>

            <el-form-item
              prop="captcha"
              label="验证码"
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  width: 100%;
                "
              >
                <el-input
                  v-model="captcha"
                  placeholder="请输入验证码"
                ></el-input>
                <el-button
                  style="margin-left: 10px"
                  @click="getCaptcha"
                  :disabled="isCounting"
                  >{{ sendBtnText }}
                  <template #dot></template>
                </el-button>
              </div>
            </el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              @click="captchaLogin"
              >登录
            </el-button>
          </el-form>
          <!-- 二维码登录 -->
          <el-image
            v-else
            :src="QRImage"
            alt=""
            class="aside-user-dialog-qrcode"
            v-loading="loading"
          >
          </el-image>
          <!-- 切换登录方式 -->
          <el-button
            text
            @click="loginWay = !loginWay"
            >{{ !loginWay ? '账号登录' : '扫码登录' }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
  .aside-user {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 500px;
    height: 80px;
    transition: all 0.3s;
    border-radius: 10px;
    .aside-user-info {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .aside-user-dialog {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 5px;

      .aside-user-dialog-qrcode {
        width: 100%;
        aspect-ratio: 1;
      }
    }
  }
  :deep(.el-dialog) {
    border-radius: 15px;
  }
  :deep(.el-image__wrapper) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 100px;
    color: #606266;
  }
</style>
