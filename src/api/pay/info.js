import request from '@/utils/request'

// 查询充值管理列表
export function listInfo(query) {
  return request({
    url: '/pay/info/list',
    method: 'get',
    params: query
  })
}

// 查询充值管理详细
export function getInfo(id) {
  return request({
    url: '/pay/info/' + id,
    method: 'get'
  })
}

// 新增充值管理
export function addInfo(data) {
  return request({
    url: '/pay/info',
    method: 'post',
    data: data
  })
}

// 修改充值管理
export function updateInfo(data) {
  return request({
    url: '/pay/info',
    method: 'put',
    data: data
  })
}

// 删除充值管理
export function delInfo(id) {
  return request({
    url: '/pay/info/' + id,
    method: 'delete'
  })
}

// 导出充值管理
export function exportInfo(query) {
  return request({
    url: '/pay/info/export',
    method: 'get',
    params: query
  })
}

// 获取银行卡信息
export function getSiteBanks(query) {
  return request({
    url: '/pay/bank/getSiteBanks',
    method: 'post',
    params: query
  })
}

// 获取虚拟币信息
export function getCurrencys(query) {
  return request({
    url: '/pay/currency/getCurrencys',
    method: 'post',
    params: query
  })
}

