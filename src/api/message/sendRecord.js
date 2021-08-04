import request from '@/router/axios'
//条件查询分页
export function findRecordByCondition(obj) {
  return request({
    url: '/messages/sendRecord/findByCondition',
    method: 'post',
    data: obj
  })
}