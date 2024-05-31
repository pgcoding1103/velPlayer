import request from '@/utils/request'
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
