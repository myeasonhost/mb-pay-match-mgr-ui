import request from '@/utils/request'

// 查询VPN用户列表
export function listUser(query) {
  return request({
    url: '/vpn/user/list',
    method: 'get',
    params: query
  })
}

// 查询VPN用户详细
export function getUser(userId) {
  return request({
    url: '/vpn/user/' + userId,
    method: 'get'
  })
}

// 新增VPN用户
export function addUser(data) {
  return request({
    url: '/vpn/user',
    method: 'post',
    data: data
  })
}

// 修改VPN用户
export function updateUser(data) {
  return request({
    url: '/vpn/user',
    method: 'put',
    data: data
  })
}


export function changeStatus(id, status) {
  return request({
    url: '/vpn/user/' + id + "/" + status,
    method: 'put'
  })
}

// 删除VPN用户
export function delUser(userId) {
  return request({
    url: '/vpn/user/' + userId,
    method: 'delete'
  })
}

// 导出VPN用户
export function exportUser(query) {
  return request({
    url: '/vpn/user/export',
    method: 'get',
    params: query
  })
}
