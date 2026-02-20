import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

const Board = () => {
	
	// useParams
	// : react-router v6 이상부터 사용
	//   URL 경로의 정의된 파라미터를 가져오는 Hook
	const { id } = useParams()
	// ?파라미터=값 가져오는 방법
	const location = useLocation()
	const query = new URLSearchParams(location.search)
	const category = query.get("category")
	const option = query.get("option")

	return (
		<>
		<h1>게시판</h1>
		<h3>게시글 id : {id}</h3>
		<h3>파라미터 category : {category}</h3>
		<h3>파라미터 option : {option}</h3>
		<Link to='/'>Home</Link>
		</>
	)

}

export default Board