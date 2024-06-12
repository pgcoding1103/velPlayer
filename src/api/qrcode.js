import request from '../utils/request'
//返回一个用于生成QR码的key
export const createQRKey = () =>
  request('/login/qr/key').then(res => res.data.unikey)
//返回一个QR码图片的base64
export const getBase64QRImage = key =>
  request(`/login/qr/create?key=${key}&qrimg=true`).then(res => res.data.qrimg)
//检测QR码是否过期
/* 
  800: 二维码过期
  801: 等待扫码
  802: 扫码成功，等待确认
  803: 授权成功
  */
export const checkQRKey = key =>
  request('/login/qr/check', {
    params: {
      key,
      //带上时间戳, 防止缓存
      timestamp: Date.now()
    }
  }).then(res => ({
    code: res.code,
    cookie: res.cookie
  }))
