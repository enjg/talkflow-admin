import api from './index'

// ============= AI角色配置 API =============

// 获取AI角色列表
export function getAiCharacters(params?: any) {
  return api.get('/config/ai-characters', { params })
}

// 获取AI角色详情
export function getAiCharacterDetail(id: number) {
  return api.get(`/config/ai-characters/${id}`)
}

// 新增AI角色
export function addAiCharacter(data: any) {
  return api.post('/config/ai-characters', data)
}

// 更新AI角色
export function updateAiCharacter(id: number, data: any) {
  return api.put(`/config/ai-characters/${id}`, data)
}

// 删除AI角色
export function deleteAiCharacter(id: number) {
  return api.delete(`/config/ai-characters/${id}`)
}

// 切换AI角色状态
export function toggleAiCharacterStatus(id: number, status: string) {
  return api.put(`/config/ai-characters/${id}/status`, { status })
}

// ============= AI模型配置 API =============

// 获取AI模型列表
export function getAiModels(params?: any) {
  return api.get('/config/ai-models', { params })
}

// 获取AI模型详情
export function getAiModelDetail(id: number) {
  return api.get(`/config/ai-models/${id}`)
}

// 新增AI模型
export function addAiModel(data: any) {
  return api.post('/config/ai-models', data)
}

// 更新AI模型
export function updateAiModel(id: number, data: any) {
  return api.put(`/config/ai-models/${id}`, data)
}

// 删除AI模型
export function deleteAiModel(id: number) {
  return api.delete(`/config/ai-models/${id}`)
}

// 切换AI模型状态
export function toggleAiModelStatus(id: number, status: string) {
  return api.put(`/config/ai-models/${id}/status`, { status })
}

// ============= 积分消耗配置 API =============

// 获取积分消耗配置列表
export function getPointsConsumeConfig(params?: any) {
  return api.get('/config/points-consume', { params })
}

// 更新积分消耗配置
export function updatePointsConsumeConfig(id: number, data: any) {
  return api.put(`/config/points-consume/${id}`, data)
}

// 批量更新积分消耗配置
export function batchUpdatePointsConsumeConfig(data: any[]) {
  return api.put('/config/points-consume/batch', { items: data })
}
