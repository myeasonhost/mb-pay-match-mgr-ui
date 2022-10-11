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

// 人工代付
export function daifu(data) {
  return request({
    url: '/mbpay/recharge/daifu',
    method: 'post',
    data: data
  })
}

// 代付合并
export function daifuAll(data) {
  return request({
    url: '/mbpay/recharge/daifuAll',
    method: 'post',
    data: data
  })
}

// 拆单合并
export function fold(data) {
  return request({
    url: '/mbpay/recharge/fold',
    method: 'post',
    data: data
  })
}

// 手动拆单
export function unfold(data) {
  return request({
    url: '/mbpay/recharge/unfold',
    method: 'post',
    data: data
  })
}
