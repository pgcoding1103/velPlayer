<script setup>
  import { onActivated, ref } from 'vue'
  import { getRecommendPlaylist } from '@/api/playlist.js'
  import { getRecommendSonglist } from '@/api/song.js'
  import router from '@/router'
  import { useAudio } from '@/store'
  const { updateSongList, play } = useAudio()
  const songlist = ref([])
  const playlist = ref([])
  const loadRecommendSonglist = async () => {
    const recommendSonglist = await getRecommendSonglist()
    songlist.value = recommendSonglist
  }

  const loadRecommendPlaylist = async () => {
    const recommendPlaylist = await getRecommendPlaylist()
    playlist.value = recommendPlaylist
  }

  const playMusic = id => {
    updateSongList(songlist.value)
    play(id)
  }
  const navgetTo = id => {
    router.push('/playlist?id=' + id)
  }
  loadRecommendPlaylist()
  loadRecommendSonglist()
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
