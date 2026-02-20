import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
	return (
		<>
			<h1>Home</h1>
			<Link to="/about">About</Link>    <br />
			<Link to="/boards/100?category=공지사항&option=10">Board</Link> <br />
			<Link to="/admin">Admin</Link> <br />
			<Link to="/login">Login</Link> <br />
		</>
	)
}

export default Home