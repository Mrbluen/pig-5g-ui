import request from '@/router/axios'
//条件查询分页
export function findByCondition(obj) {
  return request({
    url: '/messages/ads/findByCondition',
    method: 'post',
    data: obj
  })
}

//条件查询分页
export function deleteFile(query) {
  return request({
    url: '/upload/deleteFile',
    method: 'get',
    params: query
  })
}

//保存
export function save(obj) {
  return request({
    url: '/messages/ads/save',
    method: 'post',
    data: obj
  })
}

//详情
export function findById(id) {
  return request({
    url: `/messages/ads/findById/${id}`,
    method: 'get'
  })
}

//修改
export function updateById(obj) {
  return request({
    url: '/messages/ads/updateById',
    method: 'post',
    data: obj
  })
}
//删除
export function deleteById(id) {
  return request({
    url: `/messages/ads/deleteById/${id}`,
    method: 'get'
  })
}
