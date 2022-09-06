import request from '@/utils/request'

// 查询商户列表
export function listMember(query) {
  return request({
    url: '/pay/member/list',
    method: 'get',
    params: query
  })
}

// 查询商户详细
export function getMember(id) {
  return request({
    url: '/pay/member/' + id,
    method: 'get'
  })
}

// 新增商户
export function addMember(data) {
  return request({
    url: '/pay/member',
    method: 'post',
    data: data
  })
}

// 修改商户
export function updateMember(data) {
  return request({
    url: '/pay/member',
    method: 'put',
    data: data
  })
}

// 删除商户
export function delMember(id) {
  return request({
    url: '/pay/member/' + id,
    method: 'delete'
  })
}

// 导出商户
export function exportMember(query) {
  return request({
    url: '/pay/member/export',
    method: 'get',
    params: query
  })
}