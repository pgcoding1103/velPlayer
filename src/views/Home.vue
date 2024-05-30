<script setup>
  import { ref } from 'vue'
  import CardList from '@/components/CardList.vue'
  import { guestlogin } from '@/api/user.js'
  import { getRecommendPlaylist } from '@/api/playlist.js'
  import { getRecommendSongs } from '@/api/song.js'
  const songs = ref({})
  getRecommendSongs().then(res => {
    console.log(res)
    songs.value = res
  })
  const playlist = ref({})
  getRecommendPlaylist().then(res => {
    console.log(res)
    playlist.value = res
  })
  guestlogin()
</script>
<template>
  <CardList
    :cardlist="playlist"
    title="每日歌单推荐"
  />
  <CardList
    :cardlist="songs"
    title="每日歌曲推荐"
  />
</template>
<style scoped></style>
