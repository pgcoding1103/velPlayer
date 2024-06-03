import MODE from '@/config/mode'
import { ref, watch, computed } from 'vue'
import { getSongUrl } from '@/api/song'
import { getRandomSonglist } from '@/utils/playlist'
//单例模式
const useAudio = (function () {
  let instance

  function createInstance() {
    const mode = ref(MODE.loop)
    const songlist = ref([])
    const audio = ref(new Audio())
    const handleEnded = ref(null)
    const isAudioPause = ref(true)
    const playingIndex = ref(-1)
    const currentTime = ref(0)
    const randomSonglist = computed(() =>
      getRandomSonglist(JSON.parse(JSON.stringify(songlist.value)))
    )
    const cover = computed(() =>
      playingIndex.value != -1 ? songlist.value[playingIndex.value].picUrl : ''
    )
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
    async function play(index = 0) {
      if (index < 0) {
        index = songlist.value.length - 1
      }
      if (index >= songlist.value.length) {
        index = 0
      }

      if (mode.value == MODE.random) {
        audio.value.src = await getSongUrl(randomSonglist.value[index].id)
      } else {
        audio.value.src = await getSongUrl(songlist.value[index].id)
      }
      console.log(randomSonglist.value[index].id, songlist.value[index].id)
      console.log(songlist.value[index].name)
      audio.value.onended = () => {
        // if (index >= songlist.value.length - 1) {
        //   return play() //从头播放
        // }
        play(index + 1) //播放下一首
      }
      playingIndex.value = index
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

    return {
      mode,
      songlist,
      randomSonglist,
      audio,
      isAudioPause,
      playingIndex,
      currentTime,
      cover,
      play,
      pause,
      updateSonglist,
      updateMode
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
