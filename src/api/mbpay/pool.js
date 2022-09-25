import request from '@/utils/request'

// 查询撮合池列表
export function listPool(query) {
  return request({
    url: '/mbpay/pool/list',
    method: 'get',
    params: query
  })
}

// 查询充值订单详细
export function getPool(id) {
  return request({
    url: '/mbpay/pool/' + id,
    method: 'get'
  })
}

// 查询撮合池详细
export function daifu(data) {
  return request({
    url: '/mbpay/recharge/daifu',
    method: 'post',
    data: data
  })
}
