import request from '@/utils/request'

// 查询提现订单列表
export function listWithdraw(query) {
  return request({
    url: '/mbpay/withdraw/list',
    method: 'get',
    params: query
  })
}

export function listWithdraw2(query) {
  return request({
    url: '/mbpay/withdraw/list2',
    method: 'get',
    params: query
  })
}

// 查询提现订单详细
export function getWithdraw(id) {
  return request({
    url: '/mbpay/withdraw/' + id,
    method: 'get'
  })
}

// 修改提现订单
export function updateWithdraw(data) {
  return request({
    url: '/mbpay/withdraw',
    method: 'put',
    data: data
  })
}

// 导出提现订单
export function exportWithdraw(query) {
  return request({
    url: '/mbpay/withdraw/export',
    method: 'get',
    params: query
  })
}
