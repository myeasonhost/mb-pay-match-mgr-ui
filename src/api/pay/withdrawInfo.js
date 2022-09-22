import request from '@/utils/request'

// 查询提现管理列表
export function listWithdrawInfo(query) {
  return request({
    url: '/pay/withdrawInfo/list',
    method: 'get',
    params: query
  })
}

// 查询提现管理详细
export function getWithdrawInfo(id) {
  return request({
    url: '/pay/withdrawInfo/' + id,
    method: 'get'
  })
}

// 新增提现管理
export function addWithdrawInfo(data) {
  return request({
    url: '/pay/withdrawInfo',
    method: 'post',
    data: data
  })
}

// 修改提现管理
export function updateWithdrawInfo(data) {
  return request({
    url: '/pay/withdrawInfo',
    method: 'put',
    data: data
  })
}

// 删除提现管理
export function delWithdrawInfo(id) {
  return request({
    url: '/pay/withdrawInfo/' + id,
    method: 'delete'
  })
}

// 导出提现管理
export function exportWithdrawInfo(query) {
  return request({
    url: '/pay/withdrawInfo/export',
    method: 'get',
    params: query
  })
}