<script setup>
  import { ref, watchEffect } from 'vue'
  import { getUserPlaylist } from '../api/user'
  import { useUser } from '../store'
  import { storeToRefs } from 'pinia'
  import router from '../router'
  import { parsePlaylist } from '../utils/playlist'
  const { uid } = storeToRefs(useUser())
  const playlist = ref([])
  watchEffect(async () => {
    playlist.value.splice(
      0,
      playlist.value.length,
      ...parsePlaylist(
        await getUserPlaylist(uid.value, localStorage.getItem('cookie'))
      )
    )
  })
</script>
<template>
  <ul class="userPlayList">
    <li
      v-for="{ id, name, picUrl, trackCount } in playlist"
      :key="id"
    >
      <div
        :class="[
          'userPlayList-item',
          id == $route.query.id ? 'userPlayList-item__active' : ''
        ]"
        @click="router.push(`/playlist?id=${id}`)"
      >
        <el-image
          :src="picUrl"
          alt=""
          style="width: 50px; height: 50px; border-radius: 5px"
        ></el-image>
        <div class="userPlayList-item-info">
          <el-text
            tag="b"
            line-clamp="1"
            >{{ name }}</el-text
          >
          <el-text
            tag="p"
            line-clamp="1"
            >{{ `${trackCount} 首歌曲` }}</el-text
          >
        </div>
      </div>
    </li>
  </ul>
</template>
<style scoped>
  .userPlayList {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    padding: 15px;
    .userPlayList-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        background-color: #f2f3f5;
      }
      .userPlayList-item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .el-text {
          align-self: flex-start;
        }
      }
    }
  }
  .userPlayList-item__active {
    background-color: #ebedf0 !important;
  }
</style>
