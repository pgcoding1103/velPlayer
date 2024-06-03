<script setup>
  import { computed, ref, watch } from 'vue'
  import { Icon } from '@iconify/vue'
  import useElementSize from '@/hooks/useElementSize.js'
  const props = defineProps({
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Number,
      default: 6
    },
    title: {
      type: String,
      default: undefined
    }
  })
  const emits = defineEmits(['click'])
  const { width } = useElementSize('.cardlist')
  const imageLoadedCount = ref(0)
  const skeletonwidth = computed(
    () => (width.value - (props.columns - 1) * 20) / props.columns + 'px'
  )
  const rowcount = computed(() => Math.ceil(props.data.length / props.columns))
  const isloaded = computed(
    () => imageLoadedCount.value && imageLoadedCount.value == props.data.length
  )
  const imagePreLoad = cardlist => {
    cardlist.forEach(item => {
      const img = new Image()
      img.src = item.picUrl
      img.onload = () => {
        imageLoadedCount.value++
      }
    })
  }
  watch(
    () => props.data,
    newvalue => {
      imagePreLoad(newvalue)
    }
  )
</script>
<template>
  <div class="cardlist">
    <el-skeleton
      :loading="!isloaded"
      :count="props.columns"
      animated
      :class="['cardlist-content', props.title ? 'cardlist-skeleton' : '']"
    >
      <!-- 骨架屏 -->
      <template #template>
        <div>
          <el-skeleton-item variant="image" />
          <div style="padding: 14px">
            <el-skeleton-item
              variant="p"
              style="width: 50%"
            />
            <div
              style="
                display: flex;
                align-items: center;
                justify-items: space-between;
              "
            >
              <el-skeleton-item
                variant="text"
                style="margin-right: 16px"
              />
            </div>
          </div>
        </div>
      </template>
      <!-- 实际内容 -->
      <template #default>
        <div class="cardlist-title">
          <h2>{{ props.title }}</h2>
        </div>
        <div class="cardlist-content">
          <el-card
            style="max-width: 480px; border-radius: 20px"
            shadow="hover"
            :body-style="{ padding: '0px' }"
            v-for="({ id, name, picUrl, ar }, index) in data"
            :key="id"
          >
            <div style="height: 100%; aspect-ratio: 1; overflow: hidden">
              <el-image
                style="width: 100%"
                :src="picUrl"
                fit="cover"
              />
            </div>
            <div style="padding: 14px">
              <el-text
                style="font-size: 16px; font-weight: bold"
                line-clamp="1"
                >{{ name }}
              </el-text>
            </div>
            <Icon
              icon="ic:round-play-circle"
              class="cardlist-content-item-playicon"
              @click="$emit('click', index)"
            />
            <div class="cardlist-content-item-mask"></div>
          </el-card>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>
<style scoped>
  .cardlist-content {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(v-bind(columns), 1fr);
    grid-template-rows: repeat(v-bind(rowcount), 1fr);
    gap: 20px;
  }
  .cardlist-skeleton {
    padding-top: 70px;
  }
  .el-skeleton__image {
    width: v-bind(skeletonwidth);
    height: v-bind(skeletonwidth);
  }
  .cardlist-title {
    width: 100%;
    height: 70px;
    padding: 20px;
  }

  .el-card {
    position: relative;
    &:hover {
      cursor: pointer;
      .cardlist-content-item-mask,
      .cardlist-content-item-playicon {
        opacity: 1;
      }
    }
    .cardlist-content-item-playicon {
      position: absolute;
      bottom: 50%;
      left: 50%;
      transform: translate(-50%, 50%);
      font-size: 80px;
      color: #1ed760;
      box-sizing: var(--el-box-shadow-dark);
      z-index: 1;
      opacity: 0;
      transition: all 0.2s;
      box-sizing: border-box;
      &::after {
        position: absolute;
        content: '';
        bottom: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        transform: translate(-50%, 50%);
        background-color: black;
      }
    }
    .cardlist-content-item-mask {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
      /* &::after {
        position: absolute;
        content: '';
        bottom: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        transform: translate(-50%, 50%);
        background-color: black;
      } */
    }
  }
</style>
