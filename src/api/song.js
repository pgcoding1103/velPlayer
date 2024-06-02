import request from '@/utils/request'
export const getRecommendSonglist = () =>
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
export const getSongUrl = id =>
  request('/song/url', {
    params: {
      id
    }
  }).then(res => res.data[0].url)
