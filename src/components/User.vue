<script setup>
  import { computed, ref, watch } from 'vue'
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

  let timer = null //定时器ID，用于定时检查二维码状态
  const { islogin, avatarUrl, username } = storeToRefs(useUser())
  const { initUserInfo, removeUserInfo } = useUser()
  const dialogVisible = ref(false)
  const QRImage = ref(null)
  const QRKey = ref('')
  const QRState = ref(801) //800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功
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
      const { cookie } = await loginByCaptcha(phone.value, captcha.value)
      localStorage.setItem('cookie', cookie) //存储登录后的cookie
      await initUserInfo()
      dialogVisible.value = false
    }
  }
  //处理登录按钮点击
  async function handleLoginBtnClick() {
    dialogVisible.value = true
    QRKey.value = await createQRKey()
    startCheckQRState()
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
  //清除检测二维码状态定时器
  function clearTimer() {
    clearInterval(timer)
  }
  //开始定时检测二维码状态
  function startCheckQRState() {
    timer = setInterval(async () => {
      const { code, cookie } = await checkQRKey(QRKey.value)
      switch (code) {
        case 800:
          QRState.value = 800
          createQRKey()
          break //二维码过期
        case 802:
          QRState.value = 802
          break //待确认
        case 803:
          QRState.value = 803
          dialogVisible.value = false
          localStorage.setItem('cookie', cookie) //存储登录后的cookie
          await initUserInfo()
          clearInterval(timer)
          break //授权成功
        default:
          QRState.value = 801
          break //等待扫码
      }
    }, 1000)
  }
  //切换登录方式
  function toggleloginWay() {
    loginWay.value = !loginWay.value
    if (!loginWay.value) {
      startCheckQRState()
    } else {
      clearTimer()
    }
  }
  //刷新二维码
  async function refreshQR() {
    QRKey.value = await createQRKey()
  }
  watch(
    () => QRKey.value,
    async newval => {
      loading.value = true
      const base64Url = await getBase64QRImage(newval)
      const img = new Image()
      img.src = base64Url
      img.onload = () => {
        loading.value = false
      }
      QRImage.value = base64Url
    }
  )
</script>
<template>
  <div class="user">
    <div class="user-info">
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
              @click="removeUserInfo"
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
      @close="clearTimer"
    >
      <template #footer>
        <div class="user-dialog">
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
          <div
            v-else
            class="user-dialog-qrcode"
          >
            <el-image
              :src="QRImage"
              alt=""
              v-loading="loading"
              style="width: 100%; height: 100%"
            >
            </el-image>
            <div
              class="user-dialog-qrcode-state"
              v-show="QRState != 801 && !loading"
            >
              <div style="display: flex; flex-direction: column; gap: 10px">
                <el-text tag="b">
                  {{ QRStateText }}
                </el-text>
                <el-button
                  type="primary"
                  v-if="QRState == 800"
                  @click="refreshQR"
                  >刷新二维码
                </el-button>
              </div>
            </div>
          </div>
          <el-text v-if="!loginWay">使用手机APP扫码登录</el-text>
          <!-- 切换登录方式 -->
          <el-button
            text
            type="primary"
            @click="toggleloginWay"
            >{{ !loginWay ? '账号登录?' : '扫码登录?' }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
  .user {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 500px;
    height: 80px;
    transition: all 0.3s;
    border-radius: 10px;
    .user-info {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .user-dialog {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 5px;

      .user-dialog-qrcode {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 250px;
        height: 250px;
      }
      .user-dialog-qrcode-state {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
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
