<script setup>
  import { ref, computed, watch } from 'vue'
  import { Icon } from '@iconify/vue'
  import { getSearchSuggestions } from '@/api/search'
  import debounce from '@/utils/debounce'
  const keywords = ref()

  const suggestions = ref({})
  const suggestionOrder = computed(() => {
    return suggestions.value['order']
  })
  const isShowSuggestions = ref(false)
  const Order = {
    albums: '专辑',
    artists: '歌手',
    playlists: '歌单',
    songs: '歌曲'
  }
  const handleKeywordsChange = debounce(async () => {
    suggestions.value = await getSearchSuggestions(keywords.value)
    Object.keys(suggestions.value).length != 0
      ? (isShowSuggestions.value = true)
      : (isShowSuggestions.value = false)
  }, 300)
  const handleFocus = () => {
    Object.keys(suggestions.value).length != 0
      ? (isShowSuggestions.value = true)
      : (isShowSuggestions.value = false)
  }
</script>
<template>
  <div class="searchbar">
    <div class="searchbar-input">
      <Icon icon="mdi:search"></Icon>
      <el-input
        v-model="keywords"
        style="width: 220px"
        placeholder="请输入搜索内容"
        @input="handleKeywordsChange"
        @blur="isShowSuggestions = false"
        @focus="handleFocus"
      />
    </div>
    <div
      v-show="isShowSuggestions"
      class="searchbar-suggestions"
    >
      <el-card
        shadow="never"
        style="width: 500px"
      >
        <template #default>
          <div
            v-for="orderItem in suggestionOrder"
            :key="orderItem"
          >
            <h5>{{ Order[orderItem] }}</h5>

            <a href="">
              <el-text
                tag="p"
                v-for="suggestionItem in suggestions[orderItem]"
                :key="suggestionItem.id"
              >
                {{ suggestionItem.name }}
              </el-text>
            </a>
          </div>
        </template>
      </el-card>
    </div>
  </div>
</template>
<style scoped>
  .searchbar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    .searchbar-input {
      position: relative;
      .iconify {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--el-color-info-light-3);
        font-size: 20px;
        z-index: 1;
      }
    }
    .searchbar-suggestions {
      position: absolute;
      left: 25px;
      top: 75px;
      /* transform: translateX(-50%); */

      z-index: 10000;

      a {
        p {
          margin: 5px 0;
          &:hover {
            font-weight: 900;
          }
        }
      }
    }
  }
  :deep(.el-input__wrapper) {
    padding: 0 40px;
  }
  .el-card {
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(60px);
    box-shadow: var(--el-box-shadow);
  }
</style>
