import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";
// 查询用户个人信息
export function getSiteInfoProfile() {
  return request({
    url: '/pay/siteinfo/profile/',
    method: 'get'
  })
}

export function updateMemberProfile(data) {
  return request({
    url: '/pay/siteinfo',
    method: 'put',
    data: data
  })
}
