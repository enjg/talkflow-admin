import api from './index'

// ============= 会员列表 API =============

// 获取会员列表
export function getMembers(params?: any) {
  return api.get('/member/list', { params })
}

// 获取会员详情
export function getMemberDetail(id: number) {
  return api.get(`/member/${id}`)
}

// 更新会员状态
export function updateMemberStatus(id: number, status: string) {
  return api.put(`/member/${id}/status`, { status })
}

// 获取会员积分记录
export function getMemberPointsLog(id: number, params?: any) {
  return api.get(`/member/${id}/points-log`, { params })
}

// ============= 积分规则 API =============

// 获取积分规则配置
export function getPointsRules() {
  return api.get('/member/points/rules')
}

// 更新积分规则配置
export function updatePointsRules(data: any) {
  return api.put('/member/points/rules', data)
}

// ============= 积分套餐 API =============

// 获取积分套餐列表
export function getPointsPackages(params?: any) {
  return api.get('/member/points/packages', { params })
}

// 新增积分套餐
export function addPointsPackage(data: any) {
  return api.post('/member/points/packages', data)
}

// 更新积分套餐
export function updatePointsPackage(id: number, data: any) {
  return api.put(`/member/points/packages/${id}`, data)
}

// 删除积分套餐
export function deletePointsPackage(id: number) {
  return api.delete(`/member/points/packages/${id}`)
}

// ============= 激活码 API =============

// 获取激活码列表
export function getActivationCodes(params?: any) {
  return api.get('/member/points/codes', { params })
}

// 批量生成激活码
export function generateActivationCodes(data: { packageId: number; count: number }) {
  return api.post('/member/points/codes/generate', data)
}

// 删除激活码
export function deleteActivationCode(id: number) {
  return api.delete(`/member/points/codes/${id}`)
}

// ============= 会员等级 API =============

// 获取会员等级列表
export function getMemberLevels(params?: any) {
  return api.get('/member/levels', { params })
}

// 获取会员等级详情
export function getMemberLevelDetail(id: number) {
  return api.get(`/member/levels/${id}`)
}

// 新增会员等级
export function addMemberLevel(data: any) {
  return api.post('/member/levels', data)
}

// 更新会员等级
export function updateMemberLevel(id: number, data: any) {
  return api.put(`/member/levels/${id}`, data)
}

// 删除会员等级
export function deleteMemberLevel(id: number) {
  return api.delete(`/member/levels/${id}`)
}
