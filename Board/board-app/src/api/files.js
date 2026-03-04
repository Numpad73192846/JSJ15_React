import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const filesApi = {
	upload: (data, headers) => api.post('/files', data, { headers } ),
	download: (id) => api.get(`/files/download/${id}`, { responseType: 'blob' }),
	remove: (id) => api.delete(`/files/${id}`),
	removeFiles: (idList) => api.delete('/files', { params: { idList: idList.join(',') } }),
	fileByType: (pId, type) => api.get(`/files/${pId}`, { params: { type } }),
}