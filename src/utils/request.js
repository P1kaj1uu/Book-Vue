// 基于axios封装的请求模块
import theAxios from 'axios'
import Router from '@/router/index'
import { Message } from 'element-ui'
// 导入封装的token方法
import { getToken } from './token'
// 导入进度条效果
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'

const axios = theAxios.create({
  baseURL: '/api',
  // 设置20秒超时时间
  timeout: 20000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 设置请求头
  config.headers['Content-Type'] = 'application/json;charset=utf-8'
  NProgress.start()
  const token = getToken()
  if (token) {
    // 为请求头添加token验证字段
    config.headers['X-Token'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  let res = response.data
  NProgress.done()
  // 如果token过期
  if (res.code === 401) {
    Message.warning(res.msg)
    Router.push('/login')
  }
  // 如果是返回的文件
  if (response.config.responseType === 'blob') {
    return res
  }
  // 兼容服务端返回的字符串数据
  if (typeof res === 'string') {
    res = res ? JSON.parse(res) : res
  }
  return res
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default axios
