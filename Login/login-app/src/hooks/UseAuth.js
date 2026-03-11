import React, { useContext } from 'react'
import { LoginContext } from '../context/LoginContextProvider'

/**
 * useAuth 커스텀 훅
 * - 로그인 상태, 사용자 정보, 권한 정보, 로그인 함수를 제공하는 커스텀 훅
 * - Provider 로 지정받은 컴포넌트에서만 사용할 수 있도록 예외 처리
 * @returns
 */
const UseAuth = () => {

	const context = useContext(LoginContext)

	if ( !context ) {
		throw new Error('Provider 로 지정받은 컴포넌트에서만 사용할 수 있습니다.')
	}

	return context
}

export default UseAuth