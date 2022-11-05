import request from '@/utils/request'

// 查询三方渠道列表
export function listInfo(query) {
  return request({
    url: '/three/info/list',
    method: 'get',
    params: query
  })
}
export function listInfo2(query) {
  return request({
    url: '/three/info/list2',
    method: 'get',
    params: query
  })
}

// 查询三方渠道详细
export function getInfo(id) {
  return request({
    url: '/three/info/' + id,
    method: 'get'
  })
}

// 新增三方渠道
export function addInfo(data) {
  return request({
    url: '/three/info',
    method: 'post',
    data: data
  })
}

// 修改三方渠道
export function updateInfo(data) {
  return request({
    url: '/three/info',
    method: 'put',
    data: data
  })
}

// 删除三方渠道
export function delInfo(id) {
  return request({
    url: '/three/info/' + id,
    method: 'delete'
  })
}

// 导出三方渠道
export function exportInfo(query) {
  return request({
    url: '/three/info/export',
    method: 'get',
    params: query
  })
}
