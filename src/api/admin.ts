import api from './index'

export const adminApi = {
  login: (data: { username: string; password: string }) =>
    api.post('/admin/login', data),
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, status: string) =>
    api.put(`/admin/users/${id}/status`, { status }),
  getCharacters: () => api.get('/admin/characters'),
  createCharacter: (data: any) => api.post('/admin/characters', data),
  updateCharacter: (id: string, data: any) => api.put(`/admin/characters/${id}`, data),
  deleteCharacter: (id: string) => api.delete(`/admin/characters/${id}`),
  getConversations: (params?: any) => api.get('/admin/conversations', { params }),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
}
