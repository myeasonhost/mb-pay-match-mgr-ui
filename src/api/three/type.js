import request from '@/utils/request'

// 查询三方支付类型列表
export function listType(query) {
  return request({
    url: '/three/type/list',
    method: 'get',
    params: query
  })
}

// 查询三方支付类型详细
export function getType(id) {
  return request({
    url: '/three/type/' + id,
    method: 'get'
  })
}

// 新增三方支付类型
export function addType(data) {
  return request({
    url: '/three/type',
    method: 'post',
    data: data
  })
}

// 修改三方支付类型
export function updateType(data) {
  return request({
    url: '/three/type',
    method: 'put',
    data: data
  })
}

// 删除三方支付类型
export function delType(id) {
  return request({
    url: '/three/type/' + id,
    method: 'delete'
  })
}

// 导出三方支付类型
export function exportType(query) {
  return request({
    url: '/three/type/export',
    method: 'get',
    params: query
  })
}