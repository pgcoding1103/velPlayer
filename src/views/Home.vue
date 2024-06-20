<script setup>
  import { ref } from 'vue'
  import { getRecommendPlaylist } from '@/api/playlist.js'
  import { getRecommendSonglist } from '@/api/song.js'
  import router from '@/router'
  import { useAudio } from '@/store'
  const { updateSongList, play } = useAudio()
  const songlist = ref([])
  const playlist = ref([])
  getRecommendSonglist().then(res => {
    console.log(res)
    songlist.value = res
  })
  getRecommendPlaylist().then(res => {
    console.log(res)
    playlist.value = res
  })

  function playMusic(index, id) {
    updateSongList(songlist.value)
    play(id)
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
