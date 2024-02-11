// 统一封装接口方法
// 每个方法负责请求一个url地址

// 导入封装的axios
import axios from '../utils/request'

// 用户登录
export const userLoginAPI = (data) => axios({
  url: '/user/login',
  method: 'POST',
  data: data
})

// 注册
export const userRegisterAPI = (data) => axios({
  url: '/user/add',
  method: 'POST',
  data: data
})

// 获取当前用户信息
export const userInfoAPI = ({ userId }) => axios({
  url: `/user/find`,
  method: 'GET',
  params: {
    userId
  }
})

// 修改密码
export const userPasswordAPI = (data) => axios({
  url: '/user/reset',
  method: 'POST',
  data: data
})

// 编辑用户信息
export const editUserInfoAPI = (data) => axios({
  url: '/user/edit',
  method: 'POST',
  data: data
})
