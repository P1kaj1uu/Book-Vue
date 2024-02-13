import axios from '../utils/request'

// 查询所有评论
export const commentListAPI = ({ pageNum, pageSize }) => axios({
  url: `/comment/list`,
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 查询当前图书下的评论
export const commentByBookAPI = ({ bookId, pageNum, pageSize }) => axios({
  url: `/comment/find`,
  method: 'GET',
  params: {
    bookId,
    pageNum,
    pageSize
  }
})

// 模糊查询评论
export const commentByNameAPI = ({ username, content, pageNum, pageSize }) => axios({
  url: `/comment/select`,
  method: 'GET',
  params: {
    username,
    content,
    pageNum,
    pageSize
  }
})

// 新增评论
export const addCommentAPI = (data) => axios({
  url: `/comment/add`,
  method: 'POST',
  data: data
})

// 编辑评论
export const editCommentAPI = (data) => axios({
  url: `/comment/edit`,
  method: 'POST',
  data: data
})

// 删除评论
export const deleteCommentAPI = ({ bookId }) => axios({
  url: `/comment/delete`,
  method: 'DELETE',
  params: {
    bookId
  }
})
