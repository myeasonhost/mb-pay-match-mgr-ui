import request from '@/utils/request'

// 查询地区列表
export function listArea(query) {
  return request({
    url: '/vpn/area/list',
    method: 'get',
    params: query
  })
}

// 查询地区详细
export function getArea(id) {
  return request({
    url: '/vpn/area/' + id,
    method: 'get'
  })
}

// 新增地区
export function addArea(data) {
  return request({
    url: '/vpn/area',
    method: 'post',
    data: data
  })
}

// 修改地区
export function updateArea(data) {
  return request({
    url: '/vpn/area',
    method: 'put',
    data: data
  })
}

// 删除地区
export function delArea(id) {
  return request({
    url: '/vpn/area/' + id,
    method: 'delete'
  })
}

// 导出地区
export function exportArea(query) {
  return request({
    url: '/vpn/area/export',
    method: 'get',
    params: query
  })
}