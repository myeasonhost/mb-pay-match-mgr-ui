import request from '@/utils/request'

// 查询商户列表
export function listSiteInfo(query) {
  return request({
    url: '/pay/siteinfo/list',
    method: 'get',
    params: query
  })
}
// 角色状态修改
export function changeSiteStatus(id,siteId, status) {
  const data = {
    id,
    siteId,
    status
  }
  return request({
    url: '/pay/siteinfo/changeStatus',
    method: 'put',
    data: data
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
// 重置密码 type=1是登录密码 2是交易密码
export function updPwdSiteInfo(id,type) {
  return request({
    url: '/pay/siteinfo/updPwd/'+id+"/"+type,
    method: 'put'
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
//校验用户名是否存在
export function userRules(query) {
  return request({
    url: '/pay/siteinfo/userRules',
    method: 'get',
    params: query
  })
}

