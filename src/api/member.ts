import request from '@/utils/request'

// ========== 会员管理 ==========
export function getMembers(params: any) {
  return request.get('/api/member/list', { params })
}

export function getMemberDetail(id: number) {
  return request.get(`/api/member/${id}`)
}

export function freezeMember(id: number) {
  return request.patch(`/api/member/${id}/freeze`)
}

export function unfreezeMember(id: number) {
  return request.patch(`/api/member/${id}/unfreeze`)
}

export function adjustPoints(id: number, data: { points: number; reason: string }) {
  return request.post(`/api/member/${id}/adjust-points`, data)
}

// ========== 积分规则 ==========
export function getPointsRules() {
  return request.get('/api/member/points-rules')
}

export function updatePointsRule(id: number, data: any) {
  return request.put(`/api/member/points-rules/${id}`, data)
}

// ========== 积分套餐 ==========
export function getPackages(params?: any) {
  return request.get('/api/member/packages', { params })
}

export function addPackage(data: any) {
  return request.post('/api/member/packages', data)
}

export function updatePackage(id: number, data: any) {
  return request.put(`/api/member/packages/${id}`, data)
}

export function deletePackage(id: number) {
  return request.delete(`/api/member/packages/${id}`)
}

// ========== 激活码 ==========
export function getActivationCodes(params?: any) {
  return request.get('/api/member/activation-codes', { params })
}

export function generateActivationCodes(data: { packageId: number; count: number; expireDays: number }) {
  return request.post('/api/member/activation-codes/generate', data)
}

export function exportActivationCodes(params?: any) {
  return request.get('/api/member/activation-codes/export', { params, responseType: 'blob' })
}

// ========== 会员等级 ==========
export function getMemberLevels() {
  return request.get('/api/member/levels')
}

export function updateMemberLevel(id: number, data: any) {
  return request.put(`/api/member/levels/${id}`, data)
}
