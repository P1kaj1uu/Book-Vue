// 封装操作token的方法
import Cookies from 'js-cookie'
const key = 'book-school-system'

// 设置token
export const setToken = (token) => Cookies.set(key, token)

// 获取token
export const getToken = () => Cookies.get(key)

// 移除token
export const removeToken = () => Cookies.remove(key)
