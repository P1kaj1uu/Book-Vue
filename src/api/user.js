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

// 删除用户
export const deleteUserAPI = ({ userId }) => axios({
  url: '/user/delete',
  method: 'DELETE',
  params: {
    userId
  }
})

// 查询所有用户
export const userListAPI = ({ pageNum, pageSize }) => axios({
  url: '/user/list',
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 模糊查询用户
export const userByConditionAPI = ({ username, name, role, pageNum, pageSize }) => axios({
  url: '/user/select',
  method: 'GET',
  params: {
    username,
    name,
    role,
    pageNum,
    pageSize
  }
})
