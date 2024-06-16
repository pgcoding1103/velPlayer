import request from '../utils/request'
export const guestlogin = () => {
  request('/register/anonimous').then(res => {
    const { cookie } = res
    localStorage.setItem('cookie', cookie)
  })
}
//获取用户歌单
export const getUserPlaylist = (uid, cookie) => {
  return request('/user/playlist', {
    params: {
      uid,
      cookie
    }
  }).then(res => res.playlist)
}
