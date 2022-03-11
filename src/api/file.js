import request from '@/utils/request'

// ------------------ 文章名称相关接口 ------------------
// 新增文章名称接口
export function addFileName(data) {
  return request({
    url: '/file_name/add',
    method: 'post',
    data
  })
}

// 获取文章名称列表树形结构接口
export function fileNameTree(data) {
  return request({
    url: '/file_name/tree',
    method: 'post',
    data
  })
}

// 删除文章名称接口
export function deleteFileName(data) {
  return request({
    url: '/file_name/delete',
    method: 'post',
    data
  })
}

// 更新文章名称接口
export function updateFileName(data) {
  return request({
    url: '/file_name/update',
    method: 'post',
    data
  })
}

// ------------------ 文章内容相关接口 ------------------
// 新增/编辑文章内容接口
export function addFile(data) {
  return request({
    url: '/file_data/add',
    method: 'post',
    data
  })
}

// 获取文章内容接口
export function getFile(data) {
  return request({
    url: '/file_data/content',
    method: 'post',
    data
  })
}
