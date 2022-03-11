import request from '@/utils/request'

// 新增/编辑TodoList
export function addTodoList(data) {
  return request({
    url: '/todo_list/add',
    method: 'post',
    data
  })
}

// 获取指定日期TodoList内容接口
export function getTodoList(data) {
  return request({
    url: '/todo_list/get',
    method: 'post',
    data
  })
}

// 获取当月已设置待办事项的日期接口
export function getTodoTag(data) {
  return request({
    url: '/todo_list/tag',
    method: 'post',
    data
  })
}

