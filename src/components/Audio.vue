<script setup>
  import { Icon } from '@iconify/vue'
  import useAudio from '../hooks/useAudio'
  import MODE from '@/config/mode'
  const {
    audio,
    updateMode,
    mode,
    isAudioPause,
    play,
    pause,
    playingIndex,
    currentTime,
    randomSonglist,
    songlist,
    cover
  } = useAudio()
  function playOrPause() {
    if (audio.value.paused) {
      play(playingIndex.value)
    } else {
      pause()
    }
  }
  function loop() {
    if (!audio.value.loop) {
      console.log('loop')
      updateMode(MODE.singleloop)
    } else {
      console.log('noloop')
      updateMode(MODE.loop)
    }
  }
  function playNext() {
    currentTime.value = 0
    play(playingIndex.value + 1)
  }
  function playBack() {
    currentTime.value = 0
    play(playingIndex.value - 1)
  }
  function playRandom() {
    if (mode.value == MODE.random) {
      console.log('noRandom')
      updateMode(MODE.loop)
    } else {
      console.log('random')
      updateMode(MODE.random)
    }
  }
</script>
<template>
  <div class="audio">
    <div class="aidio-cover">
      <el-image
        style="width: 100%; height: 100%"
        :src="cover"
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
        <Icon
          icon="f7:shuffle"
          :class="mode == MODE.random ? 'audio-controls-random__active' : ''"
          @click="playRandom"
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
          :icon="isAudioPause ? 'fontisto:play' : 'fontisto:pause'"
          class="play"
          @click="playOrPause"
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
          @click="loop"
          :class="mode == MODE.singleloop ? 'audio-controls-loop__active' : ''"
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
  .audio-controls-random__active {
    color: #409eff;
  }
</style>
