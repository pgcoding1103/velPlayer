<script setup>
  import { Icon } from '@iconify/vue'
  import { usePlayer } from '@/store'
  import { watch, ref, computed } from 'vue'
  import MODE from '@/config/mode'
  const player = usePlayer()
  function play() {
    if (player.audio && player.paused) {
      player.playAudio()
    } else {
      player.pauseAudio()
    }
  }

  watch(
    () => player.songUrl,
    newVal => {
      url.value = newVal
    }
  )
</script>
<template>
  <div class="audio">
    <div class="aidio-cover">
      <el-image
        style="width: 100%; height: 100%"
        :src="player.cover"
        :fit="fill"
      >
        <template #error>
          <div class="audio-cover__error">
            <Icon icon="ph:music-notes"></Icon>
          </div>
        </template>
      </el-image>
      <div class="audio-cover-mask">
        <Icon icon="ri:expand-diagonal-2-line"></Icon>
      </div>
    </div>
    <div class="audio-controls">
      <div>
        <Icon icon="f7:shuffle" />
      </div>
      <div>
        <Icon icon="fontisto:backward" />
      </div>
      <div>
        <Icon
          :icon="player.paused ? 'fontisto:play' : 'fontisto:pause'"
          class="play"
          @click="play"
        />
      </div>
      <div>
        <Icon icon="fontisto:forward" />
      </div>
      <div>
        <Icon
          icon="iconamoon:playlist-repeat-list-fill"
          @click="player.loop"
          :class="[
            player.audio.mode == MODE.singleloop
              ? 'audio-controls-loop__active'
              : ''
          ]"
        />
      </div>
    </div>
    <!-- <audio :src="url"></audio> -->
  </div>
</template>
<style scoped>
  .audio {
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
        font-size: 20px;
        color: white;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.3);
        transition: all 0.3s;
      }
    }
    .audio-controls {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 15px;
      margin-left: 10px;
      font-size: 20px;
      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        & > .iconify:hover {
          color: #73767a;
          transition: color 0.3s;
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
  .audio-controls-loop__active {
    color: #409eff;
  }
</style>
