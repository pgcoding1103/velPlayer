import request from '@/utils/request'
export const getRecommendSongs = () =>
  request('/recommend/songs', {
    params: {
      cookie: localStorage.getItem('cookie')
    }
  }).then(res => {
    const { dailySongs: songs } = res.data
    return songs.map(songitem => {
      const { picUrl } = songitem.al
      return {
        picUrl,
        ...songitem
      }
    })
  })
