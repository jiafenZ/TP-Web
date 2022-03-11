import request from '@/utils/request'

// ------------------ 测试用例名称相关接口 ------------------
// 新增测试用例名称接口
export function addCaseName(data) {
  return request({
    url: '/case_name/add',
    method: 'post',
    data
  })
}

// 获取测试用例名称列表树形结构接口
export function caseNameTree(data) {
  return request({
    url: '/case_name/tree',
    method: 'post',
    data
  })
}

// 获取测试用例名称列表接口
export function caseNameList(data) {
  return request({
    url: '/case_name/list',
    method: 'post',
    data
  })
}

// 删除测试用例名称接口
export function deleteCaseName(data) {
  return request({
    url: '/case_name/delete',
    method: 'post',
    data
  })
}

// 更新测试用例名称接口
export function updateCaseName(data) {
  return request({
    url: '/case_name/update',
    method: 'post',
    data
  })
}

// ------------------ 测试用例相关接口 ------------------
// 新增/编辑测试用例接口
export function addCase(data) {
  return request({
    url: '/case_data/add',
    method: 'post',
    data
  })
}

// 获取测试用例接口
export function caseData(data) {
  return request({
    url: '/case_data/list',
    method: 'post',
    data
  })
}

// 获取测试用例标签接口
export function caseTag(data) {
  return request({
    url: '/case_tag/list',
    method: 'post',
    data
  })
}

// ------------------ 版本测试用例相关接口 ------------------
// 提取版本测试用例接口
export function addCaseSprint(data) {
  return request({
    url: '/sprint_case/add',
    method: 'post',
    data
  })
}

// 统计版本测试用例执行结果接口
export function sprintCaseResult(data) {
  return request({
    url: '/sprint_case/count',
    method: 'post',
    data
  })
}
