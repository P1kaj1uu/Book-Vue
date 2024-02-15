import axios from '../utils/request'

// 查询所有图书
export const bookListAPI = ({ pageNum, pageSize }) => axios({
  url: `/book/list`,
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 模糊查询图书
export const bookByNameAPI = ({ name, author, type, pageNum, pageSize }) => axios({
  url: `/book/select`,
  method: 'GET',
  params: {
    name,
    author,
    type,
    pageNum,
    pageSize
  }
})

// 新增图书
export const addBookAPI = (data) => axios({
  url: `/book/add`,
  method: 'POST',
  data: data
})

// 编辑图书
export const editBookAPI = (data) => axios({
  url: `/book/edit`,
  method: 'POST',
  data: data
})

// 借阅/归还改变当前图书数量
export const editBookNumAPI = (data) => axios({
  url: `/book/change`,
  method: 'POST',
  data: data
})

// 图书图片上传
export const bookImgAPI = (bookId, data) => axios({
  url: `/book/uploadImg?bookId=${bookId}`,
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  data: data,
})

// 删除图书
export const deleteBookAPI = ({ bookId }) => axios({
  url: `/book/delete`,
  method: 'DELETE',
  params: {
    bookId
  }
})
