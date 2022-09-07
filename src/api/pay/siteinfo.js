import request from '@/utils/request'

// 查询商户列表
export function listSiteInfo(query) {
  return request({
    url: '/pay/siteinfo/list',
    method: 'get',
    params: query
  })
}

// 查询商户详细
export function getSiteInfo(id) {
  return request({
    url: '/pay/siteinfo/' + id,
    method: 'get'
  })
}

// 新增商户
export function addSiteInfo(data) {
  return request({
    url: '/pay/siteinfo',
    method: 'post',
    data: data
  })
}

// 修改商户
export function updateSiteInfo(data) {
  return request({
    url: '/pay/siteinfo',
    method: 'put',
    data: data
  })
}

// 删除商户
export function delSiteInfo(id) {
  return request({
    url: '/pay/siteinfo/' + id,
    method: 'delete'
  })
}

// 导出商户
export function exportSiteInfo(query) {
  return request({
    url: '/pay/siteinfo/export',
    method: 'get',
    params: query
  })
}
