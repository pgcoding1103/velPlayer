<script setup>
  import { getSearchResult } from '../api/search'
  import { computed, ref } from 'vue'
  import { parseSongList } from '../utils/songlist'
  import { parsePlaylist } from '../utils/playlist'
  const props = defineProps({
    keywords: {
      type: String,
      default: ''
    }
  })
  const config = {
    image: 1,
    playcount: 0,
    alltime: 1,
    liheader: 0,
    title: 1,
    index: 0
  }
  const searchResult = ref()
  const songlist = computed(
    () =>
      (searchResult.value &&
        searchResult.value.song &&
        parseSongList(searchResult.value.song.songs)) ||
      []
  )
  const album = computed(
    () =>
      (searchResult.value &&
        searchResult.value.album &&
        searchResult.value.album.albums) ||
      []
  )
  const artist = computed(
    () =>
      (searchResult.value &&
        searchResult.value.artist &&
        searchResult.value.artist.artists) ||
      []
  )
  const playlist = computed(
    () =>
      (searchResult.value &&
        searchResult.value.playList &&
        parsePlaylist(searchResult.value.playList.playLists)) ||
      []
  )

  const user = computed(
    () =>
      (searchResult.value &&
        searchResult.value.user &&
        searchResult.value.user.users) ||
      []
  )
  function search() {
    getSearchResult(props.keywords).then(res => {
      searchResult.value = res
    })
  }
  search()
</script>
<template>
  <SongList
    :data="songlist"
    :config="config"
    height="350"
    title="歌曲"
  />
  <CardList
    :data="playlist"
    title="歌单"
  />
</template>
<style scoped></style>
