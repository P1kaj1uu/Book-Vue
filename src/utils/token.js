// 封装操作token的方法
const key = 'book-school-system'

// 设置token
export const setToken = (token) => localStorage.setItem(key, token)

// 获取token
export const getToken = () => localStorage.getItem(key)

// 移除token
export const removeToken = () => localStorage.removeItem(key)
