import request from '@/utils/request'

// 新增基础接口信息接口
export function addApi(data) {
  return request({
    url: '/api/add',
    method: 'post',
    data
  })
}

// 修改基础接口信息接口
export function updateApi(data) {
  return request({
    url: '/api/update',
    method: 'post',
    data
  })
}

// 删除基础接口信息接口
export function deleteApi(data) {
  return request({
    url: '/api/delete',
    method: 'post',
    data
  })
}

// 获取基础接口信息列表接口
export function apiList(data) {
  return request({
    url: '/api/list',
    method: 'post',
    data
  })
}

// 获取单个接口信息接口
export function apiInfo(data) {
  return request({
    url: '/api/info',
    method: 'post',
    data
  })
}
