<script setup>
  const props = defineProps({
    cover: {
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
</script>
<template>
  <div class="description">
    <div class="description-cover">
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
    </div>
  </div>
</template>
<style scoped>
  .description {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    height: 300px;
    .description-cover {
      width: 300px;
      height: 300px;
      padding: 0 20px;
      .el-image {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 20px;
      }
    }
    .description-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
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
