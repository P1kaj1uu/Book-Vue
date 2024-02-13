import axios from '../utils/request'

// 查询所有图书类别
export const typeListAPI = ({ pageNum, pageSize }) => axios({
  url: `/type/list`,
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 根据类名查询图书类别
export const typeByNameAPI = ({ name, pageNum, pageSize }) => axios({
  url: `/type/find`,
  method: 'GET',
  params: {
    name,
    pageNum,
    pageSize
  }
})

// 编辑图书类别
export const editTypeAPI = (data) => axios({
  url: `/type/edit`,
  method: 'POST',
  data: data
})

// 新增图书类别
export const addTypeAPI = (data) => axios({
  url: `/type/add`,
  method: 'POST',
  data: data
})

// 删除图书类别
export const deleteTypeAPI = ({ typeId }) => axios({
  url: `/type/delete`,
  method: 'DELETE',
  params: {
    typeId
  }
})
