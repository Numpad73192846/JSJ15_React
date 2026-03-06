import React from 'react'
import './LoginForm.css'

const LoginForm = () => {
  return (
	<div className="form">
		<h2 className="login-title">로그인</h2>
		<form className="login-form">
			<div>
				<label htmlFor="username">username</label>
				<input type="text" id="username" name="username" placeholder='username' autoComplete="username" required />
			</div>
			<div>
				<label htmlFor="password">password</label>
				<input type="password" id="password" name="password" placeholder='password' autoComplete="current-password" required />
			</div>
			<button type='submit' className="btn btn--form btn-login">
				로그인
			</button>
		</form>
	</div>
  )
}

export default LoginForm