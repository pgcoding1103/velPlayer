import { guestlogin } from '../api/user'
import { useUser } from '../store'
/* 初始化登录信息
如果localStorage中没有cookie，则调用guestlogin方法进行登录，并存储cookie到localStorage中。
如果localStorage中有cookie，则直接返回。 */
export const initLogin = () => {
  return new Promise(async resolve => {
    if (!localStorage.getItem('cookie')) {
      await guestlogin()
    } else {
      const { initUserInfo } = useUser()
      await initUserInfo()
    }
    resolve()
  })
}
