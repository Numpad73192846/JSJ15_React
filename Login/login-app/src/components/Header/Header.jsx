import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = () => {

	

	return (
		<header>
			<div className='logo'>
				<Link to='/'>
					<img src="https://i.imgur.com/MlTTFsA.png" alt="logo" />
				</Link>
			</div>
			<div className='util'>
				<ul>
					{
						isLogin ? (
					<>
						<li><Link to="/user">마이 페이지</Link></li>
						{ hasRole('ROLE_ADMIN') && <li><Link to="/admin">관리자</Link></li> }
						<li><button className='btn' onClick={ () => logout() }>로그아웃</button></li>
					</>
					:
					<>
						<li><Link to="/login">로그인</Link></li>
						<li><Link to="/join">회원가입</Link></li>
						<li><Link to="/about">소개</Link></li>
					</>

						)
					}
				</ul>
			</div>
		</header>
	)

}

export default Header