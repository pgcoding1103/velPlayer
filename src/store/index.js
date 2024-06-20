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
  let timer
  const audio = new Audio()
  const mode = ref(MODE.default)
  const sid = ref(0)
  const ct = ref()
  const songlist = ref([])
  const randomSongList = ref([])
  const paused = ref(true)
  const index = computed(() =>
    currentSongList.value.findIndex(item => item.id == sid.value)
  )
  //当前播放歌曲
  const currentSong = computed(() =>
    currentSongList.value.find(item => item.id == sid.value)
  )
  //歌曲封面
  const imgUrl = computed(() => currentSong.value && currentSong.value.imgUrl)
  //当前进度
  const progress = computed(
    () =>
      currentSong.value &&
      parseFloat((ct.value / (currentSong.value.dt / 1000)) * 100).toFixed(2)
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
  //当前播放时长
  const currentTime = computed(() => ct.value && formatTime(ct.value * 1000))
  const currentSongList = computed(() =>
    mode.value === MODE.random ? randomSongList.value : songlist.value
  )
  async function play(id) {
    //先暂停
    audio.pause()
    sid.value = id
    let nextIndex = 0
    const songUrl = await getSongUrl(id)
    if (index.value == currentSongList.value.length - 1) {
      nextIndex = 0
    } else {
      nextIndex = index.value + 1
    }
    await showSongState()
    audio.src = songUrl
    await audio.play()
    paused.value = false
    //开始实时记录播放时长
    timer = setInterval(() => {
      ct.value = audio.currentTime
    }, 1000)
    audio.onended = () => {
      audio.currentTime = 0
      play(currentSongList.value[nextIndex].id)
    }
  }
  function updateSongList(newSongList) {
    songlist.value = parseSongList(newSongList)
  }
  function updateProgress(progress) {
    const newTime = progress * (currentSong.value.dt / 1000)
    audio.currentTime = newTime
    ct.value = newTime
  }
  function switchMode(newMode) {
    if (Object.values(MODE).includes(newMode)) {
      mode.value = newMode
      if (newMode === MODE.random) {
        randomSongList.value = getRandomSonglist(songlist.value)
      }
      if (newMode == MODE.loop) {
        audio.loop = true
      } else {
        audio.loop = false
      }
    }
  }
  function playBack() {
    if (index.value == 0) {
      play(currentSongList.value[currentSongList.value.length - 1].id)
    } else {
      play(currentSongList.value[index.value - 1].id)
    }
  }
  function playNext() {
    if (index.value == currentSongList.value.length - 1) {
      play(currentSongList.value[0].id)
    } else {
      play(currentSongList.value[index.value + 1].id)
    }
  }
  function pause() {
    paused.value = true
    clearInterval(timer)
    audio.pause()
  }
  function playContinue() {
    paused.value = false
    audio.currentTime = ct.value
    //开始实时记录播放时长
    timer = setInterval(() => {
      ct.value = audio.currentTime
    }, 1000)
    audio.play()
  }
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
