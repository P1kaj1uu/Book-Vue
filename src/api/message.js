import axios from '../utils/request'

// 查询所有公告
export const messageListAPI = ({ pageNum, pageSize }) => axios({
  url: `/message/list`,
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 根据时间查询公告
export const messageByTimeAPI = ({ createTime, pageNum, pageSize }) => axios({
  url: `/message/find`,
  method: 'GET',
  params: {
    createTime,
    pageNum,
    pageSize
  }
})

// 新增公告
export const addMessageAPI = (data) => axios({
  url: '/message/add',
  method: 'POST',
  data: data
})

// 编辑公告
export const editMessageAPI = (data) => axios({
  url: '/message/edit',
  method: 'POST',
  data: data
})

// 删除公告
export const deleteMessageAPI = ({ messageId }) => axios({
  url: '/message/delete',
  method: 'DELETE',
  params: {
    messageId
  }
})
