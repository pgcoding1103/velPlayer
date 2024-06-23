<script setup>
  import { getCloudSearchResult, getSearchResult } from '../api/search'
  import { computed, onMounted, ref, watchEffect } from 'vue'
  import { parseSongList } from '../utils/songlist'
  import { parsePlaylist } from '../utils/playlist'
  const props = defineProps({
    keywords: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 1018
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
  const searchType = ref()
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
  async function search() {
    searchResult.value = null
    let _searchResult
    switch (searchType.value) {
      case '1':
        _searchResult = await getCloudSearchResult(
          props.keywords,
          searchType.value
        )
        searchResult.value = {
          song: {
            songs: parseSongList(_searchResult.songs)
          }
        }
        break
      case '10':
        _searchResult = await getCloudSearchResult(
          props.keywords,
          searchType.value
        )
        searchResult.value = {
          album: {
            albums: _searchResult.albums
          }
        }
        break
      case '1000':
        _searchResult = await getCloudSearchResult(
          props.keywords,
          searchType.value
        )
        searchResult.value = {
          playList: {
            playLists: _searchResult.playlists
          }
        }
        break
      default:
        _searchResult = await getSearchResult(props.keywords, props.type)
        searchResult.value = _searchResult
        break
    }
  }
  onMounted(() => {
    searchType.value = props.type
    watchEffect(() => {
      search() //searchType改变后自动搜索
    })
  })
</script>
<template>
  <el-radio-group
    v-model="searchType"
    style="margin-bottom: 30px"
  >
    <el-radio-button value="1018">综合</el-radio-button>
    <el-radio-button value="1">歌曲</el-radio-button>
    <el-radio-button value="10">专辑</el-radio-button>
    <el-radio-button value="1000">歌单</el-radio-button>
  </el-radio-group>
  <SongList
    :data="songlist"
    :config="config"
    height="350"
    title="歌曲"
    v-show="searchType == '1' || searchType == '1018'"
  >
    <template #header>
      <!-- 标题 -->
      <h2 style="padding: 20px">歌曲</h2>
    </template>
  </SongList>
  <CardList
    :data="album"
    title="专辑"
    v-show="searchType == '10' || searchType == '1018'"
  />
  <CardList
    :data="playlist"
    title="歌单"
    v-show="searchType == '1000' || searchType == '1018'"
  />
</template>
<style scoped></style>
