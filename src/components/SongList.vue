<script setup>
  import { Icon } from '@iconify/vue'
  import { parseSongList } from '../utils/songlist'
  import { getPlaylistSongs } from '../api/playlist'
  import useAudio from '../hooks/useAudio'
  import { ref, computed } from 'vue'
  const props = defineProps({
    config: {
      type: Object,
      default: {
        image: 1,
        playcount: 0,
        alltime: 1
      }
    },
    height: {
      type: String,
      default: '700px'
    },
    originId: {
      type: String,
      default: 0
    }
  })
  const { updateSonglist, play, sid } = useAudio()
  const songlist = ref([])
  const offset = ref(0)
  const dataParsed = computed(() => parseSongList(songlist.value))
  const loading = ref(false)
  function loadSongList() {
    if (!props.originId) return
    if (!loading.value) {
      console.log('加载')
      loading.value = true
      getPlaylistSongs(props.originId, offset.value, 100).then(res => {
        songlist.value.push(...res)
        offset.value += 100
        loading.value = false
      })
    }
  }
  function playMusic(id) {
    updateSonglist(songlist.value)
    play(undefined, id)
  }
  // loadSongList()
</script>
<template>
  <ul
    v-infinite-scroll="loadSongList"
    infinite-scroll-distance="3500"
    class="songlist"
  >
    <li
      v-for="(
        { id, name, alltime, albumName, cover, addtime, artistName }, index
      ) in dataParsed"
      :key="id"
      class="songlist-item"
      @dblclick="() => playMusic(id)"
    >
      <div class="songlist-item-index">
        <el-text tag="p">
          {{ index + 1 }}
        </el-text>
      </div>
      <div class="songlist-item-body">
        <div
          class="songlist-item-body-cover"
          v-if="props.config.image"
        >
          <el-image
            :src="cover + `?param=${50}y${50}`"
            alt=""
            style="width: 50px; aspect-ratio: 1"
            lazy
          ></el-image>
        </div>
        <div class="songlist-item-body-msg">
          <el-text
            tag="b"
            size="large"
            :class="sid == id ? 'songlist-item-body-msg__playing' : ''"
          >
            {{ name }}
          </el-text>
          <el-text tag="p">{{ artistName }}</el-text>
        </div>
      </div>
      <div class="songlist-item-album">
        <el-text tag="p">{{ albumName }}</el-text>
      </div>
      <div
        class="songlist-item-playcount"
        v-if="props.config.playcount"
      >
        <el-text tag="p">{{ playcount }}</el-text>
      </div>
      <div
        class="songlist-item-addtime"
        v-if="props.config.addtime"
      >
        <el-text tag="p">{{ addtime }}</el-text>
      </div>
      <div class="songlist-item-like">
        <Icon icon="material-symbols:favorite-outline"></Icon>
      </div>
      <div class="songlist-item-alltime">
        <el-text tag="p">
          {{ alltime }}
        </el-text>
      </div>
      <div class="songlist-item-more">
        <Icon icon="mingcute:more-1-fill"></Icon>
        <!-- <el-popover
          placement="top-start"
          :width="200"
          trigger="click"
        >
          <template #reference>
            <el-button text>
              
            </el-button>
          </template>

          <el-button text>加入歌单</el-button>
        </el-popover> -->
      </div>
    </li>
  </ul>
</template>
<style scoped>
  .songlist {
    height: v-bind(height);
    width: 100%;
    overflow-y: scroll;
    .songlist-item {
      display: flex;
      /* border-top: 1px solid var(--el-border-color); */
      padding: 10px;
      border-radius: 10px;
      transition: all 0.5s;
      cursor: pointer;
      &:hover {
        background-color: #f2f3f5;
        .songlist-item-like {
          opacity: 1;
        }
      }
      & > div {
        display: flex;
        min-width: 100px;
        justify-content: center;
        align-items: center;
      }
      .songlist-item-index {
        min-width: 50px;
      }
      .songlist-item-body {
        display: flex;
        flex: 1;
        .songlist-item-body-cover {
          width: 50px;
          height: 50px;
          border-radius: 5px;
          overflow: hidden;
        }
        .songlist-item-body-msg {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          height: 100%;
          padding: 5px 50px 5px 20px;
          & > * {
            align-self: self-start;
          }
        }
      }
      .songlist-item-like {
        font-size: 20px;
        opacity: 0;
        transition: all 0.3s;
        cursor: pointer;
      }
      .songlist-item-album {
        flex: 1;
        padding: 0 50px;
      }
      .songlist-item-more {
      }
    }
  }

  .songlist-item-body-msg__playing {
    color: #409eff;
  }
</style>
