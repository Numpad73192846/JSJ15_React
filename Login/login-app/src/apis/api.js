import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
	baseURL: '/api',
})

/**
 * Request interceptor
 * - 쿠키에서 토큰을 가져와서 Authorization 헤더에 추가
 * - 토큰이 없는 경우에는 헤더에 추가하지 않음
 */
api.interceptors.request.use(
	(config) => {
		const jwt = Cookies.get("jwt")
		if ( jwt ) {
			config.headers.authorization = `Bearer ${jwt}`
		}
		return config
	},

	(error) => Promise.reject(error)
)

/** 
 * Response interceptor
 * - 401 Unauthorized 응답이 발생하면 쿠키에서 토큰을 제거하고 로그인 페이지로 리다이렉트
 */
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if ( error.response && error.response.status === 401 ) {
			// 인증 정보 관리
			Cookies.remove("jwt")

			// 로그인 페이지로 리다이렉트
			if ( window.location.pathname !== '/login' ) {
				window.location.href = '/login'
			}
		}
		return Promise.reject(error)
	}
)

export default api