<script setup>
  import useAudio from '../hooks/useAudio'
  const props = defineProps({
    cover: {
      type: String,
      default: ''
    },
    bgCover: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    }
  })
  const { play } = useAudio()
  const playAll = () => {
    play(0)
  }
</script>
<template>
  <div class="description">
    <div
      v-if="props.bgCover"
      class="description-bgcover"
    >
      <el-image
        :src="props.bgCover"
        alt=""
        fit="cover"
        style="width: 100%"
      ></el-image>
      <div class="description-mask"></div>
    </div>
    <div
      v-else
      class="description-cover"
    >
      <el-image
        :src="props.cover"
        alt=""
      ></el-image>
    </div>
    <div class="description-content">
      <el-text
        tag="h2"
        size="large"
        style="font-size: 25px"
        class="description-content-title"
      >
        {{ props.title }}
      </el-text>

      <el-text
        tag="h2"
        size="large"
        class="description-content-subtitle"
        style="font-size: 25px"
      >
        {{ props.subtitle }}
      </el-text>

      <el-text
        tag="p"
        type="info"
        class="description-content-info"
        >{{ props.info }}</el-text
      >

      <el-text
        tag="p"
        type="info"
        class="description-content-desc"
        >{{ props.desc }}</el-text
      >
      <div>
        <el-button
          type="primary"
          @click="playAll"
          >播放全部</el-button
        >
      </div>
    </div>
  </div>
</template>
<style scoped>
  .description {
    position: relative;
    /* display: flex;
    justify-content: space-evenly; */
    width: 100%;
    height: 300px;
    .description-bgcover {
      position: absolute;
      z-index: -2;
      width: 100%;
      height: 300px;
      overflow: hidden;
    }
    .description-mask {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 50%;
      /* 从下到上0-50% 从白色渐变到透明 */
      background: linear-gradient(to top, #ffffff, transparent);
      z-index: 0;
    }
    .description-cover {
      float: left;
      width: 300px;
      height: 300px;
      padding: 20px;
      .el-image {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 20px;
      }
    }
    .description-content {
      float: left;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 500px;
      height: 300px;
      padding: 20px;
      .el-text {
        align-self: flex-start;
        margin: 10px 0;
      }
      .description-content-subtitle {
        color: #409eff;
        margin: 0;
      }
    }
  }
</style>
