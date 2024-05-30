import request from '../utils/request'

export const guestlogin = () => {
  request('/register/anonimous').then(res => {
    const { cookie } = res
    localStorage.setItem('cookie', cookie)
  })
}
