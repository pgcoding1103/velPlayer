<script setup>
  import { ref, computed } from 'vue'
  import { Icon } from '@iconify/vue'
  import { getSearchSuggestions } from '@/api/search'
  import debounce from '@/utils/debounce'
  import router from '../router'
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
  const navigateToSearchResult = async (_keywords, type = 'all') => {
    keywords.value = _keywords
    isShowSuggestions.value = false
    switch (type) {
      case 'songs':
        router.push(`/search?keywords=${_keywords}&type=1`)
        break
      case 'albums':
        router.push(`/search?keywords=${_keywords}&type=10`)
        break
      case 'playlists':
        router.push(`/search?keywords=${_keywords}&type=1000`)
        break
      default:
        router.push(`/search?keywords=${_keywords}&type=1018`)
        break
    }
  }
</script>
<template>
  <div class="searchbar">
    <!-- 搜索输入框 -->
    <div class="searchbar-input">
      <Icon icon="mdi:search"></Icon>
      <el-input
        v-model="keywords"
        style="width: 220px"
        placeholder="请输入搜索内容"
        @input="handleKeywordsChange"
        @focus="handleFocus"
        @blur="isShowSuggestions = false"
        @keydown.enter="navigateToSearchResult(keywords)"
      />
    </div>
    <!-- 搜索建议 -->
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

            <div
              tag="p"
              v-for="suggestionItem in suggestions[orderItem]"
              :key="suggestionItem.id"
              @mousedown="
                navigateToSearchResult(suggestionItem.name, orderItem)
              "
            >
              <div class="searchbar-suggestions-item">
                <el-text tag="p">{{ suggestionItem.name }}</el-text>
              </div>

              <a href=""></a>
            </div>
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
      left: 15px;
      top: 75px;
      /* transform: translateX(-50%); */
      z-index: 3;
      .searchbar-suggestions-item {
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s;
        &:hover {
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.05);
          transform: scale(1.05);
        }
      }
    }
  }
  :deep(.el-input__wrapper) {
    padding: 0 40px;
  }
  .el-card {
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(40px);
    box-shadow: var(--el-box-shadow);
  }
</style>
