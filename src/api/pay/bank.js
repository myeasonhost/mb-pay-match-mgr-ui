import request from '@/utils/request'

// 查询收款银行列表
export function listBank(query) {
  return request({
    url: '/pay/bank/list',
    method: 'get',
    params: query
  })
}

// 查询收款银行详细
export function getBank(id) {
  return request({
    url: '/pay/bank/' + id,
    method: 'get'
  })
}

// 新增收款银行
export function addBank(data) {
  return request({
    url: '/pay/bank',
    method: 'post',
    data: data
  })
}

// 修改收款银行
export function updateBank(data) {
  return request({
    url: '/pay/bank',
    method: 'put',
    data: data
  })
}

// 删除收款银行
export function delBank(id) {
  return request({
    url: '/pay/bank/' + id,
    method: 'delete'
  })
}

// 导出收款银行
export function exportBank(query) {
  return request({
    url: '/pay/bank/export',
    method: 'get',
    params: query
  })
}

//校验银行卡号是否存在
export function checkBankNum(bankNum,id) {
  return request({
    url: '/pay/bank/checkBankNum/' + bankNum + '/' + id,
    method: 'get',
  })
}
