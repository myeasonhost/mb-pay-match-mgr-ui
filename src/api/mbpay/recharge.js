import request from '@/utils/request'

// 查询充值订单列表
export function listRecharge(query) {
  return request({
    url: '/mbpay/recharge/list',
    method: 'get',
    params: query
  })
}

// 查询充值订单详细
export function getRecharge(id) {
  return request({
    url: '/mbpay/recharge/' + id,
    method: 'get'
  })
}

// 修改充值订单
export function updateRecharge(data) {
  return request({
    url: '/mbpay/recharge',
    method: 'put',
    data: data
  })
}

// 订单通知
export function notifyRecharge(id) {
  return request({
    url: '/mbpay/recharge/' + id,
    method: 'put'
  })
}

// 商户首页统计信息 充值订单
export function getCountFishCharge(query) {
  return request({
    url: '/mbpay/recharge/getCountFishCharge',
    method: 'get',
    params: query
  })
}
