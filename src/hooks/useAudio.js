import MODE from '@/config/mode'
import { ref, watch, computed } from 'vue'
import { getSongUrl } from '@/api/song'
import { getRandomSonglist } from '@/utils/playlist'
//单例模式
const useAudio = (function () {
  let instance

  function createInstance() {
    const sid = ref(-1) //当前播放的歌曲id
    const mode = ref(MODE.loop)
    const songlist = ref([]) //非随机模式下的歌曲列表
    const audio = ref(new Audio())
    const handleEnded = ref(null) //音频播放结束时的回调函数
    const isAudioPause = ref(true) //当前音频是否暂停
    const currentTime = ref(0) //当前播放时间
    const cover = ref('') //播放封面
    const index = computed(() => {
      if (mode.value == MODE.random) {
        return randomSonglist.value.findIndex(item => item.id == sid.value)
      } else {
        return songlist.value.findIndex(item => item.id == sid.value)
      }
    })
    const randomSonglist = ref([])

    watch(
      () => mode.value,
      newMode => {
        if (newMode == MODE.singleloop) {
          audio.value.loop = true
          handleEnded.value = audio.onended
          audio.onended = null
        } else {
          audio.value.loop = false
          audio.onended = handleEnded.value
        }
      }
    )
    async function play(index = 0, id = 0) {
      if (id) {
        sid.value = id
        audio.value.src = await getSongUrl(id)
        cover.value = songlist.value[index].picUrl
        audio.value.onended = () => {
          play(index + 1) //播放下一首
        }
        isAudioPause.value = false
        audio.value.currentTime = currentTime.value
        audio.value.play()
        return
      }
      if (index < 0) {
        index = songlist.value.length - 1
      }
      if (index >= songlist.value.length) {
        index = 0
      }
      if (mode.value == MODE.random) {
        sid.value = randomSonglist.value[index].id
        audio.value.src = await getSongUrl(randomSonglist.value[index].id)
        cover.value = randomSonglist.value[index].picUrl
      } else {
        sid.value = songlist.value[index].id
        audio.value.src = await getSongUrl(songlist.value[index].id)
        cover.value = songlist.value[index].picUrl
      }
      audio.value.onended = () => {
        play(index + 1) //播放下一首
      }
      isAudioPause.value = false
      audio.value.currentTime = currentTime.value
      audio.value.play()
    }
    function pause() {
      currentTime.value = audio.value.currentTime
      console.log(currentTime.value)
      isAudioPause.value = true
      audio.value.pause()
    }
    function updateSonglist(list) {
      songlist.value = list
    }

    function updateMode(m) {
      mode.value = m
    }
    function handleRandomClick() {
      randomSonglist.value = getRandomSonglist(
        JSON.parse(JSON.stringify(songlist.value)),
        sid.value,
        index.value
      )
    }

    return {
      mode,
      songlist,
      randomSonglist,
      audio,
      isAudioPause,
      index,
      currentTime,
      cover,
      sid,
      play,
      pause,
      updateSonglist,
      updateMode,
      handleRandomClick
    }
  }

  return function () {
    if (!instance) {
      instance = createInstance()
    }
    return instance
  }
})()

export default useAudio
