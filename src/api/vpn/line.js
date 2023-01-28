import request from '@/utils/request'

// 查询线路管理列表
export function listLine(query) {
  return request({
    url: '/vpn/line/list',
    method: 'get',
    params: query
  })
}

// 查询线路管理详细
export function getLine(id) {
  return request({
    url: '/vpn/line/' + id,
    method: 'get'
  })
}

// 新增线路管理
export function addLine(data) {
  return request({
    url: '/vpn/line',
    method: 'post',
    data: data
  })
}

// 修改线路管理
export function updateLine(data) {
  return request({
    url: '/vpn/line',
    method: 'put',
    data: data
  })
}

// 删除线路管理
export function delLine(id) {
  return request({
    url: '/vpn/line/' + id,
    method: 'delete'
  })
}

// 导出线路管理
export function exportLine(query) {
  return request({
    url: '/vpn/line/export',
    method: 'get',
    params: query
  })
}