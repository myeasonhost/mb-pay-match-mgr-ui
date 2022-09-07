import request from '@/utils/request'

// 查询商户账变记录列表
export function listDetail(query) {
  return request({
    url: '/pay/acctdetail/list',
    method: 'get',
    params: query
  })
}

// 查询商户账变记录详细
export function getDetail(id) {
  return request({
    url: '/pay/acctdetail/' + id,
    method: 'get'
  })
}

// 新增商户账变记录
export function addDetail(data) {
  return request({
    url: '/pay/acctdetail',
    method: 'post',
    data: data
  })
}

// 修改商户账变记录
export function updateDetail(data) {
  return request({
    url: '/pay/acctdetail',
    method: 'put',
    data: data
  })
}

// 删除商户账变记录
export function delDetail(id) {
  return request({
    url: '/pay/acctdetail/' + id,
    method: 'delete'
  })
}

// 导出商户账变记录
export function exportDetail(query) {
  return request({
    url: '/pay/acctdetail/export',
    method: 'get',
    params: query
  })
}
