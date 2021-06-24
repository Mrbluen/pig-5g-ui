import request from '@/router/axios'
//条件查询分页
export function findByCondition(obj) {
  return request({
    url: '/msg/appManage/findByCondition',
    method: 'post',
    data: obj
  })
}
//根据id删除
export function deleteById (id) {
  return request({
    url: '/msg/appManage/deleteById/' + id,
    method: 'get'
  })
}
//保存
export function save(obj) {
  return request({
    url: '/msg/appManage/save',
    method: 'post',
    data: obj
  })
}

//根据id查询详情
export function findById (id) {
  return request({
    url: '/msg/appManage/findById/' + id,
    method: 'get'
  })
}

//修改
export function updateById(obj) {
  return request({
    url: '/msg/appManage/updateById',
    method: 'post',
    data: obj
  })
}