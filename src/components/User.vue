<script setup>
  import { computed, ref } from 'vue'
  import { createQRKey, getBase64QRImage, checkQRKey } from '../api/qrcode'
  import { Icon } from '@iconify/vue'
  const dialogVisible = ref(false)
  const QRImage = ref(null)
  const QRKey = ref('')
  const QRState = ref(0)
  const QRStateText = computed(() => {
    switch (QRState.value) {
      case 800:
        return '二维码过期'
      case 801:
        return '等待扫码'
      case 802:
        return '待确认'
      default:
        return '授权成功'
    }
  })
  async function login() {
    dialogVisible.value = true
    const key = await createQRKey()
    const base64Url = await getBase64QRImage(key)
    QRImage.value = base64Url
  }
  const timer = setInterval(async () => {
    const { code, cookie } = await checkQRKey(QRKey.value)
    switch (code) {
      case 800:
        QRState.value = 800
        break //二维码过期
      case 801:
        QRState.value = 801
        break //等待扫码
      case 802:
        QRState.value = 802
        break //待确认
      case 803:
        QRState.value = 803
        localStorage.setItem('cookie', cookie)
        clearInterval(timer)
        break //授权成功
      default:
        break
    }
  }, 1000)
</script>
<template>
  <div
    class="aside-user"
    @click="login"
  >
    <div class="aside-user-content">
      <el-avatar
        :size="50"
        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      />
    </div>
    <!-- 扫码对话框 -->
    <el-dialog
      v-model="dialogVisible"
      width="250"
      align-center
      center
    >
      <template #footer>
        <div class="aside-user-qrcode">
          <el-image
            :src="QRImage"
            alt=""
          >
          </el-image>
          <div
            class="aside-user-qrcode-mask"
            v-if="QRState != 801"
          >
            <el-text tag="h1">{{ QRStateText }}</el-text>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
  .aside-user {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80px;
    transition: all 0.3s;
    border-radius: 10px;
    .aside-user-qrcode {
      position: relative;
      .aside-user-qrcode-mask {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 50px;
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
  }
</style>
