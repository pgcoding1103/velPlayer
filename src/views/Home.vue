<script setup>
  import { ref } from 'vue'
  import CardList from '@/components/CardList.vue'
  import { guestlogin } from '@/api/user.js'
  import { getRecommendPlaylist } from '@/api/playlist.js'
  import { getRecommendSonglist } from '@/api/song.js'
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
  function playMusic(index) {
    updateSonglist(JSON.parse(JSON.stringify(songlist.value)))
    play(index)
  }
</script>
<template>
  <CardList
    :data="playlist"
    title="每日歌单推荐"
  />
  <CardList
    :data="songlist"
    title="每日歌曲推荐"
    @click="playMusic"
  />
</template>
<style scoped></style>
