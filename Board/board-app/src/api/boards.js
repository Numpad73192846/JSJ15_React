import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const boardsApi = {
	// [GET] /api/boards?page=1&size=10
	list: (page = 1, size = 10) => api.get('/boards', { params: {page, size} }),
	select: (id) => api.get(`/boards/${id}`),
	insert: (data, headers) => api.post('/boards', data, { headers } ),
	update: (data, headers) => api.put('/boards', data, { headers } ),
	remove: (id) => api.delete(`/boards/${id}`),
}