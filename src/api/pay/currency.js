import request from '@/utils/request'

// 查询虚拟币收款列表
export function listCurrency(query) {
  return request({
    url: '/pay/currency/list',
    method: 'get',
    params: query
  })
}

// 查询虚拟币收款详细
export function getCurrency(id) {
  return request({
    url: '/pay/currency/' + id,
    method: 'get'
  })
}

// 新增虚拟币收款
export function addCurrency(data) {
  return request({
    url: '/pay/currency',
    method: 'post',
    data: data
  })
}

// 修改虚拟币收款
export function updateCurrency(data) {
  return request({
    url: '/pay/currency',
    method: 'put',
    data: data
  })
}

// 删除虚拟币收款
export function delCurrency(id) {
  return request({
    url: '/pay/currency/' + id,
    method: 'delete'
  })
}

// 导出虚拟币收款
export function exportCurrency(query) {
  return request({
    url: '/pay/currency/export',
    method: 'get',
    params: query
  })
}

//校验虚拟币地址是否存在
export function checkAddress(address,id) {
  return request({
    url: '/pay/currency/checkAddress/' + address + '/' + id,
    method: 'get',
  })
}
