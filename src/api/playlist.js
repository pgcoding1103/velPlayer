import request from '../utils/request'
export const getRecommendPlaylist = () => {
  return request
    .get('/recommend/resource', {
      params: {
        cookie: localStorage.getItem('cookie')
      }
    })
    .then(res => res.recommend)
}
export const getPlaylistSongs = (id, offset, limit) => {
  return request('/playlist/track/all', {
    params: {
      id,
      limit,
      offset
    }
  }).then(res => res.songs)
}
export const getPlaylistDetail = id => {
  return request('/playlist/detail', {
    params: {
      id
    }
  }).then(res => {
    console.log(res)
    const { id, trackIds, name, tags, playCount, description, coverImgUrl } =
      res.playlist
    return {
      id,
      trackIds,
      name,
      tags,
      playCount,
      description,
      coverImgUrl
    }
  })
}
