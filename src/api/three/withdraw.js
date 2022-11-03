import request from '@/utils/request'

// 查询三方代付订单列表
export function listWithdraw(query) {
  return request({
    url: '/three/withdraw/list',
    method: 'get',
    params: query
  })
}

// 查询三方代付订单详细
export function getWithdraw(id) {
  return request({
    url: '/three/withdraw/' + id,
    method: 'get'
  })
}

// 新增三方代付订单
export function addWithdraw(data) {
  return request({
    url: '/three/withdraw',
    method: 'post',
    data: data
  })
}

// 修改三方代付订单
export function updateWithdraw(data) {
  return request({
    url: '/three/withdraw',
    method: 'put',
    data: data
  })
}

// 删除三方代付订单
export function delWithdraw(id) {
  return request({
    url: '/three/withdraw/' + id,
    method: 'delete'
  })
}

// 导出三方代付订单
export function exportWithdraw(query) {
  return request({
    url: '/three/withdraw/export',
    method: 'get',
    params: query
  })
}