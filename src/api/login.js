import request from '../utils/request'
//返回一个用于生成QR码的key
export const createQRKey = () =>
  request('/login/qr/key', {}).then(res => res.data.unikey)
//返回一个QR码图片的base64
export const getBase64QRImage = key =>
  request(`/login/qr/create?key=${key}&qrimg=true`).then(res => res.data.qrimg)
/* 
  检测QR码是否过期
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
// 获取验证码,返回true/false
export const sendCaptcha = phone =>
  request('/captcha/sent', {
    params: {
      phone
    }
  }).then(res => res.data)
// 验证验证码,返回true/false
export const verifyCaptcha = (phone, captcha) =>
  request('/captcha/verify', {
    params: {
      phone,
      captcha
    }
  })
    .then(res => res.data)
    .catch(() => false)
//手机验证码登录
export const loginByCaptcha = (phone, captcha) =>
  request('/login/cellphone', {
    params: {
      phone,
      captcha
    }
  }).then(res => ({
    cookie: res.cookie,
    account: res.account
  }))

//获取登录状态
export const getAccountLoginState = () =>
  request('/login/status', {
    params: {
      cookie: localStorage.getItem('cookie')
    }
  }).then(res => res.data.profile)
//退出登录
export const logout = () =>
  request('/logout', {
    params: {
      cookie: localStorage.getItem('cookie')
    }
  }).then(res => {
    console.log(res)
  })
