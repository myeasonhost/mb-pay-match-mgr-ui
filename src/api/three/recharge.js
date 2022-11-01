import request from '@/utils/request'

// 查询三方代收订单列表
export function listRecharge(query) {
  return request({
    url: '/three/recharge/list',
    method: 'get',
    params: query
  })
}

// 查询三方代收订单详细
export function getRecharge(id) {
  return request({
    url: '/three/recharge/' + id,
    method: 'get'
  })
}

// 新增三方代收订单
export function addRecharge(data) {
  return request({
    url: '/three/recharge',
    method: 'post',
    data: data
  })
}

// 修改三方代收订单
export function updateRecharge(data) {
  return request({
    url: '/three/recharge',
    method: 'put',
    data: data
  })
}

// 删除三方代收订单
export function delRecharge(id) {
  return request({
    url: '/three/recharge/' + id,
    method: 'delete'
  })
}

// 导出三方代收订单
export function exportRecharge(query) {
  return request({
    url: '/three/recharge/export',
    method: 'get',
    params: query
  })
}