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
      id,
      realIP: '116.25.146.177'
    }
  }).then(res => res.data[0].url)
//返回true/false
export const getSongCanPlay = id =>
  request('/check/music', {
    params: {
      id,
      realIP: '116.25.146.177'
    }
  }).then(res => res.success)
