import request from '@/utils/request'

// ========== AI角色配置 ==========
export function getAiCharacters(params: any) {
  return request.get('/api/config/ai-characters', { params })
}

export function addAiCharacter(data: any) {
  return request.post('/api/config/ai-characters', data)
}

export function updateAiCharacter(id: number, data: any) {
  return request.put(`/api/config/ai-characters/${id}`, data)
}

export function deleteAiCharacter(id: number) {
  return request.delete(`/api/config/ai-characters/${id}`)
}

export function toggleAiCharacterStatus(id: number, status: string) {
  return request.patch(`/api/config/ai-characters/${id}/status`, { status })
}

// ========== AI模型配置 ==========
export function getAiModels(params?: any) {
  return request.get('/api/config/ai-models', { params })
}

export function updateAiModel(id: number, data: any) {
  return request.put(`/api/config/ai-models/${id}`, data)
}

// ========== 积分消耗规则 ==========
export function getPointsConsumeRules(params?: any) {
  return request.get('/api/config/points-consume-rules', { params })
}

export function updatePointsConsumeRule(id: number, data: any) {
  return request.put(`/api/config/points-consume-rules/${id}`, data)
}
