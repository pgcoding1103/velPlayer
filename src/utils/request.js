import axios from 'axios'
const request = axios.create({
  baseURL: 'https://music.cpgmusic1103.asia/'
})
request.interceptors.request.use(config => {
  return config
})

request.interceptors.response.use(response => {
  return response.data
})
export default request
