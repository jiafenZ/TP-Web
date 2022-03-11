import request from '@/utils/request'

// 用户注册接口
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 用户登录接口
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息接口
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 用户退出登录接口
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 新增用户接口
export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

// 更新用户信息接口
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

// 删除用户接口
export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

// 获取用户列表接口
export function userList(data) {
  return request({
    url: '/user/userList',
    method: 'post',
    data
  })
}
