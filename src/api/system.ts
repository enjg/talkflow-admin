import api from './index'

// ============= 菜单管理 API =============

// 获取菜单列表(树形结构)
export function getMenus() {
  return api.get('/system/menu')
}

// 获取菜单详情
export function getMenuDetail(id: number) {
  return api.get(`/system/menu/${id}`)
}

// 新增菜单
export function addMenu(data: any) {
  return api.post('/system/menu', data)
}

// 更新菜单
export function updateMenu(id: number, data: any) {
  return api.put(`/system/menu/${id}`, data)
}

// 删除菜单
export function deleteMenu(id: number) {
  return api.delete(`/system/menu/${id}`)
}

// 获取菜单树(用于选择父菜单)
export function getMenuTree() {
  return api.get('/system/menu/tree')
}

// ============= 角色管理 API =============

// 获取角色列表
export function getRoles(params?: any) {
  return api.get('/system/role', { params })
}

// 获取角色详情
export function getRoleDetail(id: number) {
  return api.get(`/system/role/${id}`)
}

// 新增角色
export function addRole(data: any) {
  return api.post('/system/role', data)
}

// 更新角色
export function updateRole(id: number, data: any) {
  return api.put(`/system/role/${id}`, data)
}

// 删除角色
export function deleteRole(id: number) {
  return api.delete(`/system/role/${id}`)
}

// 获取角色菜单权限
export function getRoleMenus(roleId: number) {
  return api.get(`/system/role/${roleId}/menus`)
}

// 分配角色菜单权限
export function assignRoleMenus(roleId: number, menuIds: number[]) {
  return api.put(`/system/role/${roleId}/menus`, { menuIds })
}

// ============= 用户管理 API =============

// 获取用户列表
export function getUsers(params?: any) {
  return api.get('/system/user', { params })
}

// 新增用户
export function addUser(data: any) {
  return api.post('/system/user', data)
}

// 更新用户
export function updateUser(id: number, data: any) {
  return api.put(`/system/user/${id}`, data)
}

// 删除用户
export function deleteUser(id: number) {
  return api.delete(`/system/user/${id}`)
}

// 分配用户角色
export function assignUserRoles(userId: number, roleIds: number[]) {
  return api.put(`/system/user/${userId}/roles`, { roleIds })
}

// ============= 部门管理 API =============

export function getDepts() {
  return api.get('/system/dept')
}

export function addDept(data: any) {
  return api.post('/system/dept', data)
}

export function updateDept(id: number, data: any) {
  return api.put(`/system/dept/${id}`, data)
}

export function deleteDept(id: number) {
  return api.delete(`/system/dept/${id}`)
}

// ============= 岗位管理 API =============

export function getPosts(params?: any) {
  return api.get('/system/post', { params })
}

export function addPost(data: any) {
  return api.post('/system/post', data)
}

export function updatePost(id: number, data: any) {
  return api.put(`/system/post/${id}`, data)
}

export function deletePost(id: number) {
  return api.delete(`/system/post/${id}`)
}

// ============= 字典管理 API =============

export function getDictTypes(params?: any) {
  return api.get('/system/dict', { params })
}

export function addDictType(data: any) {
  return api.post('/system/dict', data)
}

export function updateDictType(id: number, data: any) {
  return api.put(`/system/dict/${id}`, data)
}

export function deleteDictType(id: number) {
  return api.delete(`/system/dict/${id}`)
}
