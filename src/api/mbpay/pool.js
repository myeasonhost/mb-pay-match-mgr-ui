import request from '@/utils/request'

// 查询撮合池列表
export function listPool(query) {
  return request({
    url: '/mbpay/pool/list',
    method: 'get',
    params: query
  })
}

// 查询撮合池详细
export function getPool(matchId) {
  return request({
    url: '/mbpay/pool/' + matchId,
    method: 'get'
  })
}

// 新增撮合池
export function addPool(data) {
  return request({
    url: '/mbpay/pool',
    method: 'post',
    data: data
  })
}

// 修改撮合池
export function updatePool(data) {
  return request({
    url: '/mbpay/pool',
    method: 'put',
    data: data
  })
}

// 删除撮合池
export function delPool(matchId) {
  return request({
    url: '/mbpay/pool/' + matchId,
    method: 'delete'
  })
}

// 导出撮合池
export function exportPool(query) {
  return request({
    url: '/mbpay/pool/export',
    method: 'get',
    params: query
  })
}
