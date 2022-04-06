import request from '@/utils/request'

// 新增测试数据接口
export function addCaseData(data) {
  return request({
    url: '/data/add',
    method: 'post',
    data
  })
}

// 修改测试数据接口
export function updateCaseData(data) {
  return request({
    url: '/data/update',
    method: 'post',
    data
  })
}

// 删除测试数据接口
export function deleteCaseData(data) {
  return request({
    url: '/data/delete',
    method: 'post',
    data
  })
}

// 获取测试数据列表接口
export function caseDataList(data) {
  return request({
    url: '/data/list',
    method: 'post',
    data
  })
}
