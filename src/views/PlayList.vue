<script setup>
  import { getPlaylistDetail } from '../api/playlist'
  import { ref } from 'vue'
  const props = defineProps({
    id: {
      type: String,
      default: ''
    }
  })
  const playlistData = ref()
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
</script>
<template>
  <Description
    :cover="playlistData.coverImgUrl"
    :title="playlistData.tags.join('&')"
    :subtitle="playlistData.name"
    :info="`播放量：${playlistData.playCount}`"
    :desc="playlistData.description"
  />
  <SongList :originId="props.id" />
</template>
<style scoped></style>
