<script setup>
  import { Icon } from '@iconify/vue'
  import { storeToRefs } from 'pinia'
  import { useAudio } from '../store'
  import { MODE } from '@/global.config'
  import { computed } from 'vue'
  const {
    name,
    duration,
    artists,
    mode,
    paused,
    progress,
    imgUrl,
    currentTime
  } = storeToRefs(useAudio())
  const { playBack, playNext, switchMode, pause, playContinue } = useAudio()
  const toggleRandom = () => {
    let newMode
    if (mode.value == MODE.random) {
      newMode = MODE.default
    } else {
      newMode = MODE.random
    }
    switchMode(newMode)
  }
  const toggleLoop = () => {
    let newMode
    if (mode.value == MODE.loop) {
      newMode = MODE.default
    } else {
      newMode = MODE.loop
    }
    switchMode(newMode)
  }
  const togglePlay = () => {
    if (paused.value) {
      playContinue()
    } else {
      pause()
    }
  }
  const playIcon = computed(() =>
    paused.value ? 'fontisto:play' : 'fontisto:pause'
  )
</script>
<template>
  <div class="audio">
    <div class="aidio-cover">
      <el-image
        style="width: 100%; height: 100%"
        :src="imgUrl"
        :fit="fill"
      >
        <template #error>
          <div class="audio-cover__error">
            <Icon icon="ph:music-notes"></Icon>
          </div>
        </template>
      </el-image>
      <div class="audio-cover-mask">
        <Icon icon="fluent:arrow-expand-20-regular"></Icon>
      </div>
    </div>
    <div class="audio-controls">
      <div>
        <Icon
          icon="f7:shuffle"
          :id="mode == MODE.random ? 'audio-controls-random__active' : ''"
          @click="toggleRandom"
        />
      </div>
      <div>
        <Icon
          icon="fontisto:backward"
          @click="playBack"
        />
      </div>
      <div>
        <Icon
          :icon="playIcon"
          class="play"
          @click="togglePlay"
        />
      </div>
      <div>
        <Icon
          icon="fontisto:forward"
          @click="playNext"
        />
      </div>
      <div>
        <Icon
          icon="iconamoon:playlist-repeat-list-fill"
          @click="toggleLoop"
          :id="mode == MODE.singleloop ? 'audio-controls-loop__active' : ''"
        />
      </div>
    </div>
    <div class="audio-songMsg">
      <el-text
        tag="b"
        size="small"
      >
        {{ name }}
      </el-text>
      <el-text
        tag="p"
        size="small"
      >
        {{ artists }}
      </el-text>
      <div class="audio-songMsg-progress">
        <span>{{ currentTime }}</span>
        <el-progress
          :percentage="progress"
          :show-text="false"
          :stroke-width="strokewidth"
          class="audio-songMsg-progress-bar"
          @click="handleProgressClick"
          @mouseenter="strokewidth = 15"
          @mouseleave="strokewidth = 6"
        />
        <span>{{ duration }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .audio {
    flex: 1;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 500px;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    color: #c8c9cc;
    .aidio-cover {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 79px;
      height: 79px;
      overflow: hidden;
      border-radius: 5px;
      border: 1px solid var(--el-border-color);
      &:hover {
        .audio-cover-mask {
          opacity: 1;
        }
      }
      .audio-cover-mask {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 40px;
        color: rgba(255, 255, 255, 0.7);
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(20px);
        transition: all 0.3s;
        cursor: pointer;
      }
    }
    .audio-controls {
      display: flex;
      align-items: center;
      gap: 15px;
      margin: 0 20px;
      font-size: 25px;
      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        .iconify {
          transition: all 0.3s;
          &:hover {
            transform: scale(1.2);
            color: #73767a;
          }
        }
        .cycle,
        random {
          font-size: 30px;
        }
        .play {
          font-size: 35px;
        }
      }
    }
    .audio-songMsg {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 59px;
      margin: 10px;
      justify-content: space-between;
      margin: 0 10px;
      .audio-songMsg-progress {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .el-progress {
          flex: 1;
          margin: 0 10px;
        }
      }
    }
  }
  .audio-cover__error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 77px;
    height: 77px;
    font-size: 40px;
    font-weight: 900;
    background-color: #f4f4f5;
    color: #dedfe0;
  }
  :deep(.el-progress-bar__outer) {
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  #audio-controls-loop__active {
    color: #409eff;
  }
  #audio-controls-random__active {
    color: #409eff;
  }
</style>
