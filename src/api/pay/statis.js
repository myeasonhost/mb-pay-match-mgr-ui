import request from '@/utils/request'

// 查询盈利统计
export function getStatisProfit(query) {
  return request({
    url: '/mbpay/statis/getStatisProfit',
    method: 'post',
    params: query
  })
}

// 查询订单统计
export function getStatisOrder(query) {
  return request({
    url: '/mbpay/statis/getStatisOrder',
    method: 'post',
    params: query
  })
}

// 查询订单统计占比
export function getStatisOrderPro(query) {
  return request({
    url: '/mbpay/statis/getStatisOrderPro',
    method: 'post',
    params: query
  })
}
