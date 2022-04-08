import request from '@/utils/request'

// ------------------ 项目信息相关接口 ------------------
// 新增项目名称接口
export function addProject(data) {
  return request({
    url: '/project/add',
    method: 'post',
    data
  })
}

// 获取项目名称列表接口
export function projectList(data) {
  return request({
    url: '/project/list',
    method: 'post',
    data
  })
}

// 更新项目信息接口
export function updateProject(data) {
  return request({
    url: '/project/update',
    method: 'post',
    data
  })
}

// 删除项目接口
export function deleteProject(data) {
  return request({
    url: '/project/delete',
    method: 'post',
    data
  })
}

// ------------------数据库配置信息相关接口 ------------------
// 新增数据库配置信息接口
export function addMysql(data) {
  return request({
    url: '/mysql/add',
    method: 'post',
    data
  })
}

// 获取数据库配置信息列表接口
export function mysqlList(data) {
  return request({
    url: '/mysql/list',
    method: 'post',
    data
  })
}

// 更新数据库配置信息接口
export function updateMysql(data) {
  return request({
    url: '/mysql/update',
    method: 'post',
    data
  })
}

// 删除数据库配置信息接口
export function deleteMysql(data) {
  return request({
    url: '/mysql/delete',
    method: 'post',
    data
  })
}

// ------------------ base URL信息相关接口 ------------------
// 新增base URL配置信息接口
export function addUrl(data) {
  return request({
    url: '/url/add',
    method: 'post',
    data
  })
}

// 获取base URL配置信息列表接口
export function urlList(data) {
  return request({
    url: '/url/list',
    method: 'post',
    data
  })
}

// 更新base URL配置信息接口
export function updateUrl(data) {
  return request({
    url: '/url/update',
    method: 'post',
    data
  })
}

// 删除base URL配置信息接口
export function deleteUrl(data) {
  return request({
    url: '/url/delete',
    method: 'post',
    data
  })
}

// ------------------ header信息相关接口 ------------------
// 新增header配置信息接口
export function addHeader(data) {
  return request({
    url: '/header/add',
    method: 'post',
    data
  })
}

// 获取header配置信息列表接口
export function headerList(data) {
  return request({
    url: '/header/list',
    method: 'post',
    data
  })
}

// 更新header配置信息接口
export function updateHeader(data) {
  return request({
    url: '/header/update',
    method: 'post',
    data
  })
}

// 删除header配置信息接口
export function deleteHeader(data) {
  return request({
    url: '/header/delete',
    method: 'post',
    data
  })
}

// ------------------ 项目模块信息相关接口 ------------------
// 新增项目模块接口
export function addModule(data) {
  return request({
    url: '/module/add',
    method: 'post',
    data
  })
}

// 获取项目模块列表接口
export function moduleList(data) {
  return request({
    url: '/module/list',
    method: 'post',
    data
  })
}

// 获取项目模块名称列表接口
export function moduleNameList(data) {
  return request({
    url: '/module/name_list',
    method: 'post',
    data
  })
}

// 更新项目模块信息接口
export function updateModule(data) {
  return request({
    url: '/module/update',
    method: 'post',
    data
  })
}

// 删除项目模块接口
export function deleteModule(data) {
  return request({
    url: '/module/delete',
    method: 'post',
    data
  })
}
