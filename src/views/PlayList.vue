<script setup>
  import { getPlaylistDetail, getPlaylistSongs } from '../api/playlist'
  import { ref, computed } from 'vue'
  import { parseSongList } from '../utils/songlist'
  const props = defineProps({
    id: {
      type: String,
      default: ''
    }
  })
  const playlistData = ref()
  const songlist = ref([])
  const songlistLoading = ref(true)
  const playlistLoading = computed(
    () => playlistData.value && songlistLoading.value
  )
  const loadPlaylist = async () => {
    const playlistDetail = await getPlaylistDetail(props.id)
    const { id, description, name, playCount, tags, trackIds, coverImgUrl } =
      playlistDetail
    playlistData.value = {
      id,
      description,
      name,
      playCount,
      tags,
      trackIds,
      coverImgUrl
    }
  }
  // 加载歌曲
  const loadSonglist = (() => {
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
      songlist.value = [...songlist.value, ...songs]
      offset += 100
      loading = falses
      songlistLoading.value = false
    }
  })()
  loadPlaylist()
  loadSonglist()
</script>
<template>
  <el-skeleton
    style="--el-skeleton-circle-size: 100px"
    animated
    :loading="playlistLoading"
  >
    <!-- 骨架屏 -->
    <template #template>
      <div style="width: 100%; height: 300px; padding: 20px">
        <el-skeleton-item
          variant="image"
          style="width: 260px; height: 260px"
        />
      </div>
      <div
        style="display: flex; padding: 10px 10px 10px 20px"
        v-for="i of 6"
        :key="i"
      >
        <el-skeleton-item
          variant="image"
          style="width: 50px; height: 50px; padding: 10px"
        />
        <div
          style="
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            margin-left: 10px;
          "
        >
          <el-skeleton-item
            variant="text"
            style="width: 50%"
          />
          <el-skeleton-item
            variant="text"
            style="width: 100%"
          />
        </div>
      </div>
    </template>
    <template #default>
      <SongList
        :originId="props.id"
        :data="songlist"
        :scrollLoad="loadSonglist"
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
  </el-skeleton>
</template>
<style scoped></style>
