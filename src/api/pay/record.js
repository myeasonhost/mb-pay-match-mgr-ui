import request from '@/utils/request'

// 查询收款记录列表
export function listRecord(query) {
  return request({
    url: '/pay/record/list',
    method: 'get',
    params: query
  })
}

// 查询收款记录详细
export function getRecord(id) {
  return request({
    url: '/pay/record/' + id,
    method: 'get'
  })
}

// 新增收款记录
export function addRecord(data) {
  return request({
    url: '/pay/record',
    method: 'post',
    data: data
  })
}

// 修改收款记录
export function updateRecord(data) {
  return request({
    url: '/pay/record',
    method: 'put',
    data: data
  })
}

// 删除收款记录
export function delRecord(id) {
  return request({
    url: '/pay/record/' + id,
    method: 'delete'
  })
}

// 导出收款记录
export function exportRecord(query) {
  return request({
    url: '/pay/record/export',
    method: 'get',
    params: query
  })
}