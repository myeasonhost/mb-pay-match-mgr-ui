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

// 查询提现订单详细
export function getWithdraw2(id,matchId) {
  return request({
    url: '/mbpay/withdraw/' + id+'/'+matchId,
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

// 通知提现订单
export function notifyWithdraw(id) {
  return request({
    url: '/mbpay/withdraw/' + id,
    method: 'put'
  })
}

// 取消提现订单
export function notifyCancel(id) {
  return request({
    url: '/mbpay/withdraw/cancel/' + id,
    method: 'put'
  })
}

// 商户首页统计信息 提现订单
export function getCountFishWithdraw(query) {
  return request({
    url: '/mbpay/withdraw/getCountFishWithdraw',
    method: 'get',
    params: query
  })
}

