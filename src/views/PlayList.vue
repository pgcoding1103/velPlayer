<script setup>
  import { getPlaylistDetail, getPlaylistSongs } from '../api/playlist'
  import { ref } from 'vue'
  import { parseSongList } from '../utils/songlist'
  const props = defineProps({
    id: {
      type: String,
      default: ''
    }
  })
  const playlistData = ref()
  const songlist = ref([])
  getPlaylistDetail(props.id).then(res => {
    const { id, description, name, playCount, tags, trackIds, coverImgUrl } =
      res
    playlistData.value = {
      id,
      description,
      name,
      playCount,
      tags,
      trackIds,
      coverImgUrl
    }
  })
  const load = (() => {
    let offset = 0
    let limit = 100
    let loading = false
    let finished = false
    return async () => {
      if (loading || finished) return
      console.log('刷新')
      loading = true
      const songs = parseSongList(
        await getPlaylistSongs(props.id, offset, limit)
      )
      if (songs.length < limit) finished = true
      offset += 100
      songlist.value = [...songlist.value, ...songs]
      loading = false
    }
  })()
</script>
<template>
  <SongList
    :originId="props.id"
    :data="songlist"
    :scrollLoad="load"
  >
    <template #header>
      <Description
        v-if="playlistData"
        :cover="playlistData.coverImgUrl"
        :title="playlistData.tags.join('、')"
        :subtitle="playlistData.name"
        :info="`播放量：${playlistData.playCount}`"
        :desc="playlistData.description"
      />
    </template>
  </SongList>
</template>
<style scoped></style>
