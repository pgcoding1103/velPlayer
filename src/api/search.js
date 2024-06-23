import request from '@/utils/request'
//获取搜索建议
export const getSearchSuggestions = keywords => {
  return request('/search/suggest', {
    params: {
      keywords
    }
  }).then(res => {
    const { result } = res
    return result || []
  })
}
/* 获取搜索结果
  type取值
  1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 
  1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 
  2000:声音 
*/
export const getSearchResult = keywords => {
  return request('/search', {
    params: {
      keywords,
      type: 1018
    }
  }).then(res => {
    const { song, album, artist, playList, user } = res.result
    return { song, album, artist, playList, user }
  })
}
export const getCloudSearchResult = (keywords, type = '1018') => {
  return request('/cloudsearch', {
    params: {
      keywords,
      type
    }
  }).then(res => {
    return res.result
  })
}
