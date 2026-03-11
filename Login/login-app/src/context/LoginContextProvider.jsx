import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as auth from '../apis/auth'
import * as Swal from '../apis/alert'
import Cookies from 'js-cookie'

// 컨텍스트 생성
export const LoginContext = createContext()

const LoginContextProvider = ({ children }) => {

	// state
	const [isLoading, setIsLoading] = useState(true)
	const [isLogin, setIsLogin] = useState(false)
	const [userInfo, setUserInfo] = useState(null)
	const [roles, setRoles] = useState(new Set())

	const navigate = useNavigate()

	/**
	 * 권한 객체 리스트 파싱
	 * - authList [ {no, username, auth} ] => Set( auth )
	 * - ( "ROLE_USER", ... )
	 * @param {*} authList 
	 * @returns 
	 */
	const parseRoles = (authList) => {
		if ( !authList ) {
			return new Set()
		}

		return new Set( authList.map( (obj) => obj.auth ) )
	}

	// 권한 확인
	const hasRole = (role) => roles.has(role)
	const hasAnyRole = (...roleList) => roleList.some((role) => roles.has(role))

	// 로그인 세팅
	const loginSetting = useCallback((userData) => {
		setIsLogin(true)
		setUserInfo(userData)
		setRoles( parseRoles(userData.authList) )
	}, [])

	// 로그인
	const login = async ( username, password ) => {
		try {
			const response = await auth.login( username, password )
			const { data, headers } = response
			const authorization = headers.authorization
			const jwt = authorization.replace('Bearer ', '')
			
			// 쿠키에 JWT 저장
			Cookies.set('jwt', jwt, { expires : 5 })

			// 로그인 상태 설정
			loginSetting(data)

			Swal.alert('로그인 성공', '메인 화면으로 이동합니다.', 'success', () => navigate('/'))

		} catch (error) {
			Swal.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.', 'error')
		}
	}

	/**
	 * 자동 로그인
	 * - 쿠키에서 JWT를 확인하여 로그인 상태를 유지하는 기능
	 * - JWT가 유효한 경우 로그인 상태로 설정, 그렇지 않은 경우 로그인 상태 해제
	 * - 페이지 새로고침 시에도 로그인 상태 유지
	 */
	const autoLogin = useCallback( async () => {
		const jwt = Cookies.get('jwt')

		if ( !jwt ) {
			setIsLoading(false)
			return
		}

		try {
			const response = await auth.info()

			if ( response.status == 200 && response.data !== 'UNATHORIZED' ) {
				loginSetting(response.data)
			}
		} catch (error) {
			console.error('자동 로그인 실패 : ', error);
			Cookies.remove('jwt')
		} finally {
			setIsLoading(false)
		}
	}, [loginSetting])

	// 마운트 시 자동 로그인
	useEffect(() => {
		autoLogin()
	}, [autoLogin])

	return (
		// 프로바이더 정의
		<LoginContext.Provider value={{ isLoading, isLogin, userInfo, roles, login, hasRole, hasAnyRole }}>
			{children}
		</LoginContext.Provider>
	)
}

export default LoginContextProvider