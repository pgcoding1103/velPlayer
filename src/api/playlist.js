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
