<script setup>
  import { ref } from 'vue'
  import CardList from '@/components/CardList.vue'
  import { guestlogin } from '@/api/user.js'
  import { getRecommendPlaylist } from '@/api/playlist.js'
  import { getRecommendSonglist } from '@/api/song.js'
  import { usePlayer } from '@/store'
  const player = usePlayer()
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
  function play(e, e2) {
    console.log(e, e2)
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
    @click="play"
  />
</template>
<style scoped></style>
