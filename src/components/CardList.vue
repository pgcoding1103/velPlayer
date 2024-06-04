<script setup>
  import { computed, ref, watchEffect } from 'vue'
  import useElementSize from '@/hooks/useElementSize.js'
  const { width } = useElementSize('.cardlist')
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
  const itemwidth = computed(
    () => (width.value - (props.columns - 1) * 20) / props.columns
  )
  const rows = computed(() => Math.ceil(props.data.length / props.columns))

  const imgLoadedCount = ref(0)
  const loading = computed(
    () => imgLoadedCount.value == 0 || imgLoadedCount.value != props.data.length
  )
  watchEffect(() => {
    Object.keys(props.data).length &&
      props.data.forEach(item => {
        const image = new Image()
        image.src = item.picUrl + `?param=${itemwidth}y${itemwidth}`
        image.onload = () => {
          imgLoadedCount.value++
        }
      })
  })
</script>
<template>
  <div class="cardlist">
    <el-skeleton
      :count="columns"
      :loading="loading"
      animated
      class="cardlist-skeleton"
    >
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
              <el-skeleton-item
                variant="text"
                style="width: 30%"
              />
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <div class="cardlist-title">
          <h2>{{ props.title }}</h2>
        </div>
        <div class="cardlist-content">
          <div
            v-for="({ id, name, picUrl }, index) in data"
            :key="id"
            class="cardlist-content-item"
            @click="emits('click', index)"
          >
            <img
              :src="picUrl + `?param=${itemwidth}y${itemwidth}`"
              alt=""
              class="cardlist-content-item-cover"
            />
            <div class="cardlist-content-item-name">
              <el-text
                tag="h2"
                size="large"
                line-clamp="1"
                >{{ name }}</el-text
              >
            </div>
            <div class="cardlist-content-item-playicon"></div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>
<style scoped>
  .cardlist-title {
    padding: 20px;
  }
  .cardlist-content {
    display: grid;
    grid-template-columns: repeat(v-bind(columns), 1fr);
    gap: 20px;
    .cardlist-content-item {
      position: relative;
      transition: all 0.3s;
      &:hover {
        cursor: pointer;
        .cardlist-content-item-mask {
          opacity: 1;
        }
        .cardlist-content-item-cover {
          transform: translateY(-10px);
          box-shadow: var(--el-box-shadow);
        }
        .cardlist-content-item-playicon {
          transform: translateY(-20px);
          opacity: 1;
        }
      }
      .cardlist-content-item-cover {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 20px;
        transition: all 0.3s;
      }
      .cardlist-content-item-playicon {
        position: absolute;
        right: 10px;
        bottom: -10px;
        z-index: 1;
        width: 50px;
        height: 50px;
        color: #409eff;
        background-image: url('@/assets/play.svg');
        border-radius: 50%;
        box-shadow: var(--el-box-shadow-dark);
        transition: all 0.3s;
        opacity: 0;
      }
      .cardlist-content-item-name {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .el-skeleton {
    display: grid;
    grid-template-columns: repeat(v-bind(columns), 1fr);
    grid-template-rows: repeat(v-bind(rows), 1fr);
    gap: 20px;
    padding-top: 71px;
    .el-skeleton__image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      svg {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
