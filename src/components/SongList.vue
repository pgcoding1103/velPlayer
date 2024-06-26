<script setup>
  import { Icon } from '@iconify/vue'
  import { parseSongList } from '../utils/songlist'
  import { ref, computed, onMounted, watchEffect } from 'vue'
  import { useAudio } from '../store'
  import { storeToRefs } from 'pinia'
  const { sid } = storeToRefs(useAudio())
  const { updateSongList, play } = useAudio()
  const props = defineProps({
    config: {
      type: Object,
      default: {
        image: 1,
        playcount: 0,
        alltime: 1,
        liheader: 1,
        index: 1
      }
    },
    height: {
      type: String,
      default: 'auto'
    },
    data: {
      type: Array,
      default: () => [0]
    },
    scrollLoad: {
      type: Function,
      default: () => {}
    }
  })
  function load() {
    props.scrollLoad()
  }
  function playMusic(id) {
    updateSongList(props.data)
    play(id)
  }
</script>
<template>
  <ul
    v-infinite-scroll="load"
    :infinite-scroll-distance="3500"
    class="songlist"
  >
    <slot name="header">
      <div style="width: 100%; height: 300px"></div>
    </slot>
    <!-- 列头 -->
    <li
      class="songlist-item songlist-item__header"
      v-if="props.config.liheader"
    >
      <div class="songlist-item-index"><el-text tag="p">#</el-text></div>
      <div class="songlist-item-body"><el-text tag="p">标题</el-text></div>
      <div class="songlist-item-album"><el-text tag="p">专辑</el-text></div>
      <div
        class="songlist-item-playcount"
        v-if="props.config.playcount"
      >
        <el-text tag="p">播放量</el-text>
      </div>

      <div
        class="songlist-item-addtime"
        v-if="props.config.addtime"
      >
        <el-text tag="p">添加时间</el-text>
      </div>
      <div class="songlist-item-like"></div>
      <div class="songlist-item-alltime">
        <el-text tag="p">总时长</el-text>
      </div>

      <div class="songlist-item-more"></div>
    </li>

    <!-- 列表内容 -->
    <li
      v-for="(
        { id, name, duration, albumName, imgUrl, addtime, artistName }, index
      ) in props.data"
      :key="id"
      class="songlist-item"
      @dblclick="() => playMusic(id)"
    >
      <div
        class="songlist-item-index"
        v-if="props.config.index"
      >
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
            :src="imgUrl + `?param=${50}y${50}`"
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
            line-clamp="1"
          >
            {{ name }}
          </el-text>
          <el-text
            tag="p"
            line-clamp="1"
            >{{ artistName }}</el-text
          >
        </div>
      </div>
      <div class="songlist-item-album">
        <el-text
          tag="p"
          line-clamp="1"
          >{{ albumName }}</el-text
        >
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
          {{ duration }}
        </el-text>
      </div>
      <div class="songlist-item-more">
        <Icon icon="mingcute:more-1-fill"></Icon>
      </div>
    </li>
  </ul>
</template>
<style scoped>
  .songlist {
    height: v-bind(height);
    width: 100%;
    .songlist-item {
      display: flex;
      /* border-top: 1px solid var(--el-border-color); */
      padding: 10px;
      border-radius: 10px;
      transition: all 0.5s;
      &:hover {
        background-color: #f2f3f5;
        cursor: pointer;
        .songlist-item-like {
          opacity: 1;
        }
      }

      & > div {
        display: flex;
        width: 100px;
        justify-content: center;
        align-items: center;
      }
      .songlist-item-index {
        width: 50px;
      }
      .songlist-item-body {
        display: flex;
        width: 500px;
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
        width: 500px;
        padding: 0 50px;
      }
    }
    .songlist-item__header:hover {
      background: none;
    }
    .songlist-item__header {
      position: sticky;
      top: -20px;
      background: linear-gradient(
        to bottom,
        white 50%,
        rgba(255, 255, 255, 0) 100%
      );
      z-index: 2;
    }
  }
  .songlist-item-body-msg__playing {
    color: #409eff;
  }
</style>
