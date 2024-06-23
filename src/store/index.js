import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { getAccountLoginState, logout } from '@/api/login'
import { ElMessage } from 'element-plus'
import { MODE } from '../global.config'
import {
  getRandomSonglist,
  parseSongList,
  showSongState,
  formatTime
} from '../utils/songlist'
import { getSongUrl } from '../api/song'
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
export const useAudio = defineStore('audio', () => {
  const audio = new Audio()
  const mode = ref(MODE.default) //播放模式
  const sid = ref(0) //歌曲id
  const ct = ref() // 当前播放时间（秒）
  const songlist = ref([]) //正常顺序歌曲列表
  const randomSongList = ref([]) //随机播放歌曲列表
  const paused = ref(true) //当前是否停止播放
  const draging = ref(false) //判断是否在跳转播放进度
  //当前播放歌曲下标
  const index = computed(() =>
    currentSongList.value.findIndex(item => item.id == sid.value)
  )
  //当前播放歌曲信息
  const currentSong = computed(() =>
    currentSongList.value.find(item => item.id == sid.value)
  )
  //歌曲封面
  const imgUrl = computed(() => currentSong.value && currentSong.value.imgUrl)
  //当前进度
  const progress = computed(
    () =>
      0 ||
      (currentSong.value &&
        Number(
          parseFloat((ct.value / (currentSong.value.dt / 1000)) * 100).toFixed(
            2
          )
        ))
  )
  //当前歌名
  const name = computed(() => currentSong.value && currentSong.value.name)
  //当前歌曲总时长
  const duration = computed(
    () => currentSong.value && currentSong.value.duration
  )
  //当前歌曲艺人
  const artists = computed(
    () => currentSong.value && currentSong.value.artistName
  )
  //歌曲状态
  const state = computed(() => currentSong.value && currentSong.value.fee)
  //当前播放时长
  const currentTime = computed(() => ct.value && formatTime(ct.value * 1000))
  const currentSongList = computed(() =>
    mode.value === MODE.random ? randomSongList.value : songlist.value
  )
  //开始播放
  async function play(id) {
    sid.value = id
    //获取歌曲Url
    const songUrl = await getSongUrl(id)
    await showSongState() //显示歌曲状态
    audio.src = songUrl
    await audio.play()
    paused.value = false
  }
  //初始化播放器
  function initAudio() {
    audio.ontimeupdate = () => {
      if (!draging.value) {
        ct.value = audio.currentTime
      }
    }
    audio.onended = () => {
      audio.currentTime = 0
      setTimeout(() => {
        let nextIndex = 0
        if (index.value == currentSongList.value.length - 1) {
          nextIndex = 0
        } else {
          nextIndex = index.value + 1
        }
        play(currentSongList.value[nextIndex].id)
      }, 500)
    }
  }
  //更新播放列表
  function updateSongList(newSongList) {
    songlist.value = parseSongList(newSongList)
    randomSongList.value = getRandomSonglist(newSongList)
  }
  //更新播放进度
  async function updateProgress(progress) {
    const newTime = progress * (currentSong.value.dt / 1000)
    audio.currentTime = newTime
  }
  //切换播放模式
  function switchMode(newMode) {
    if (Object.values(MODE).includes(newMode)) {
      mode.value = newMode
      if (newMode === MODE.random) {
        randomSongList.value = getRandomSonglist(songlist.value)
      }
      if (newMode == MODE.loop) {
        audio.loop = true
        ElMessage.success('单曲循环')
      } else if (newMode == MODE.random) {
        audio.loop = false
        ElMessage.success('随机播放')
      } else {
        audio.loop = false
        ElMessage.success('列表循环')
      }
    }
  }
  //上一曲
  function playBack() {
    if (currentSongList.value.length == 0) return
    if (index.value == 0) {
      play(currentSongList.value[currentSongList.value.length - 1].id)
    } else {
      play(currentSongList.value[index.value - 1].id)
    }
  }
  //下一曲
  function playNext() {
    if (currentSongList.value.length == 0) return
    if (index.value == currentSongList.value.length - 1) {
      play(currentSongList.value[0].id)
    } else {
      play(currentSongList.value[index.value + 1].id)
    }
  }
  //暂停播放
  function pause() {
    paused.value = true
    audio.pause()
  }
  //继续播放
  function playContinue() {
    if (!currentSong.value) return
    paused.value = false
    audio.currentTime = ct.value
    audio.play()
  }
  initAudio()
  return {
    sid,
    audio,
    ct,
    paused,
    mode,
    currentSongList,
    progress,
    currentSong,
    imgUrl,
    name,
    duration,
    artists,
    currentTime,
    draging,
    state,
    songlist,
    randomSongList,
    play,
    pause,
    switchMode,
    updateSongList,
    playBack,
    playNext,
    playContinue,
    updateProgress
  }
})
