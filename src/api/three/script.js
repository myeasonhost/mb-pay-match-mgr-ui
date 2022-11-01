import request from '@/utils/request'

// 查询三方支付脚本列表
export function listScript(query) {
  return request({
    url: '/three/script/list',
    method: 'get',
    params: query
  })
}

// 查询三方支付脚本详细
export function getScript(id) {
  return request({
    url: '/three/script/' + id,
    method: 'get'
  })
}

// 新增三方支付脚本
export function addScript(data) {
  return request({
    url: '/three/script',
    method: 'post',
    data: data
  })
}

// 修改三方支付脚本
export function updateScript(data) {
  return request({
    url: '/three/script',
    method: 'put',
    data: data
  })
}

// 删除三方支付脚本
export function delScript(id) {
  return request({
    url: '/three/script/' + id,
    method: 'delete'
  })
}

// 导出三方支付脚本
export function exportScript(query) {
  return request({
    url: '/three/script/export',
    method: 'get',
    params: query
  })
}