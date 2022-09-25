import request from '@/utils/request'

// 查询商户列表
export function listSiteInfo(query) {
  return request({
    url: '/pay/siteinfo/list',
    method: 'get',
    params: query
  })
}
//下拉框 绑定用户使用
export function userList(type) {
  return request({
    url: '/system/user/userList/'+type,
    method: 'get'
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

export function updateSiteInfoBalance(query) {
  return request({
    url: '/pay/siteinfo/updateSiteInfoBalance',
    method: 'put',
    params: query
  })
}

// 删除商户
export function delSiteInfo(id) {
  return request({
    url: '/pay/siteinfo/' + id,
    method: 'delete'
  })
}
// 重置登录密码，登录密码使用的sys_user里面的
export function updLoginPwdSiteInfo(id) {
  return request({
    url: '/system/user/updPwd/'+id,
    method: 'put'
  })
}
// 重置交易密码
export function updPwdSiteInfo(id) {
  return request({
    url: '/pay/siteinfo/updPwd/'+id,
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

//修改交易密碼
export function updAcctPwd(query) {
  return request({
    url: '/pay/siteinfo/updAcctPwd',
    method: 'put',
    params: query
  })
}

//校验交易密码
export function checkPassword(query) {
  return request({
    url: '/pay/siteinfo/checkPassword',
    method: 'get',
    params: query
  })
}

// 商户首页统计信息 我的余额
export function getCountFishBalance(query) {
  return request({
    url: '/pay/siteinfo/getCountFishBalance',
    method: 'get',
    params: query
  })
}

