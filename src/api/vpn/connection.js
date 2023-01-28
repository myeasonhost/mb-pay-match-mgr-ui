import request from '@/utils/request'

// 查询链接管理列表
export function listConnection(query) {
  return request({
    url: '/vpn/connection/list',
    method: 'get',
    params: query
  })
}

// 查询链接管理详细
export function getConnection(id) {
  return request({
    url: '/vpn/connection/' + id,
    method: 'get'
  })
}

// 新增链接管理
export function addConnection(data) {
  return request({
    url: '/vpn/connection',
    method: 'post',
    data: data
  })
}

// 修改链接管理
export function updateConnection(data) {
  return request({
    url: '/vpn/connection',
    method: 'put',
    data: data
  })
}

// 删除链接管理
export function delConnection(id) {
  return request({
    url: '/vpn/connection/' + id,
    method: 'delete'
  })
}

// 导出链接管理
export function exportConnection(query) {
  return request({
    url: '/vpn/connection/export',
    method: 'get',
    params: query
  })
}