<script setup>
  import { ref } from 'vue'
  import { guestlogin } from '@/api/user.js'
  import { getRecommendPlaylist } from '@/api/playlist.js'
  import { getRecommendSonglist } from '@/api/song.js'
  import router from '@/router'
  // import { usePlayer } from '@/store'
  // const player = usePlayer()
  import useAudio from '../hooks/useAudio'
  const { updateSonglist, play } = useAudio()
  const songlist = ref({})
  const playlist = ref({})
  getRecommendSonglist().then(res => {
    console.log(res)
    songlist.value = res
  })
  getRecommendPlaylist().then(res => {
    console.log(res)
    playlist.value = res
  })
  guestlogin()
  function playMusic(index, id) {
    updateSonglist(JSON.parse(JSON.stringify(songlist.value)))
    play(index, id)
  }
  function navgetTo(index, id) {
    router.push('/playlist?id=' + id)
  }
</script>
<template>
  <CardList
    :data="playlist"
    title="每日歌单推荐"
    @click="navgetTo"
  />
  <CardList
    :data="songlist"
    title="每日歌曲推荐"
    @click="playMusic"
  />
</template>
<style scoped></style>
