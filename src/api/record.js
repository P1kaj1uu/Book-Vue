import axios from '../utils/request'

// 查询所有借阅记录
export const recordListAPI = ({ pageNum, pageSize }) => axios({
  url: `/record/list`,
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 查询当前用户的借阅记录
export const recordByUserAPI = ({ userId, pageNum, pageSize }) => axios({
  url: `/record/find`,
  method: 'GET',
  params: {
    userId,
    pageNum,
    pageSize
  }
})

// 模糊查询借阅记录
export const recordByOtherAPI = ({ username, bookName	, isSend, pageNum, pageSize }) => axios({
  url: `/record/select`,
  method: 'GET',
  params: {
    username,
    bookName,
    isSend,
    pageNum,
    pageSize
  }
})

// 借阅
export const addRecordAPI = (data) => axios({
  url: `/record/add`,
  method: 'POST',
  data: data
})

// 归还
export const sendRecordAPI = (data) => axios({
  url: `/record/send`,
  method: 'POST',
  data: data
})

// 删除借阅记录
export const deleteRecordAPI = ({ recordId }) => axios({
  url: `/record/delete`,
  method: 'DELETE',
  params: {
    recordId
  }
})
