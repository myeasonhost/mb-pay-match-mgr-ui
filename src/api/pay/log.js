import request from '@/utils/request'

// 查询商户钱包日志列表
export function listLog(query) {
  return request({
    url: '/mbpay/log/list',
    method: 'get',
    params: query
  })
}

// 查询商户钱包日志详细
export function getLog(id) {
  return request({
    url: '/mbpay/log/' + id,
    method: 'get'
  })
}

// 新增商户钱包日志
export function addLog(data) {
  return request({
    url: '/mbpay/log',
    method: 'post',
    data: data
  })
}

// 修改商户钱包日志
export function updateLog(data) {
  return request({
    url: '/mbpay/log',
    method: 'put',
    data: data
  })
}

// 删除商户钱包日志
export function delLog(id) {
  return request({
    url: '/mbpay/log/' + id,
    method: 'delete'
  })
}

// 导出商户钱包日志
export function exportLog(query) {
  return request({
    url: '/mbpay/log/export',
    method: 'get',
    params: query
  })
}
