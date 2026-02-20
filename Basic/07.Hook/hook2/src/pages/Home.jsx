import React from 'react'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import TodoItem from '../components/TodoItem'
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'

const Home = () => {

	// state
	const [todos, setTodos] = useState(
		// 로컬 스토리지에서 불러오기
		() => {
			const saved = localStorage.getItem("todos")
			return saved ? JSON.parse(saved) : []
		}
	)		// 할 일 목록
	const [text, setText] = useState("")		// 새로운 할 일 입력
	const [search, setSearch] = useState("")	// 검색어 입력

	// 이벤트 핸들러
	// - 할 일 완료 토글
	const handleToggle = useCallback((id) => {
		// const newTodos = todos.map(
		// 		todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo
		// )

		// // 상태 업데이트
		// setTodos( newTodos )

		// 이전 상태를 확인하여 완료여부 체크
		setTodos(
			prev => prev.map(
				todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		)
	}, [])
	

	// - 할 일 삭제
	const handleDelete = useCallback((id) => {
		// const newTodos = todos.filter( todo => todo.id !== id )

		// // 상태 업데이트
		// setTodos( newTodos )

		// 이전 상태를 확인하여 삭제
		setTodos( 
			prev => prev.filter( todo => todo.id !== id )
		)
	}, [])

	// ⭐ useRef
	const inputRef = useRef(null);

	// - 할 일 추가
	const handleAdd = useCallback(() => {

		// 입력 값이 없으면 추가 안함
		if (!text.trim()) {
			return
		}

		// const newTodos = [
		// 	...todos,
		// 	{ id: Date.now(), text: text, completed: false }
		// ]

		// 상태 업데이트
		// setTodos( newTodos )
		// setText("")
		
		// 이전 상태를 확인하여 추가
		setTodos(

			// UUID 라이브러리 사용
			// prev => [ ...prev, { id: uuidv4(), text: text, completed: false } ]

			// nanoid 라이브러리 사용
			prev => [ ...prev, { id: nanoid(), text: text, completed: false } ]
		)
		setText("")

		// 추가 후 입력창에 포커스
		inputRef.current.focus()
			
	}, [text])

	// 할 일 전체 개수 와 완료된 개수
	// const total = todos.length;
	// const completed = todos.filter(todo => todo.completed).length;
	// ➡ useMemo 로 전환

	// useMemo
	// : 메모이제이션 기법을 적용해서 이전에 계산된 결과를 메모해놓고 재사용
	const stats = useMemo(() => {
		const total = todos.length
		const completed = todos.filter( todo => todo.completed ).length
		return { total, completed }
	}, [todos])	// todos 상태가 변경될 때마다 재계산

	// 검색어가 포함된 할 일 목록
	const searchedTodos = todos.filter(todo =>
		// "리액트 복습하기".includes("복습") -> true
		// "리액트 복습하기".includes("예습") -> false
		todo.text.includes(search)
	)

	// ⭐ useEffect
	useEffect(() => {
		// 로컬 스토리지에 저장
	  	localStorage.setItem("todos", JSON.stringify(todos))
	}, [todos])	// todos 상태가 변경될 때마다 실행

  	return (
		<div>
			<h1>Todo List 앱</h1>

			<input 
				ref={inputRef}
				type="text"
				placeholder='할 일 입력'
				value={text}
				onChange={e =>setText(e.target.value)}
			/>
			<button onClick={handleAdd}>추가</button>

			<br /><br />

			<input 
				type="text"
				value={search}
				placeholder='검색어를 입력하세요.'
				onChange={e => setSearch(e.target.value)} 
			/>

			<h3>전체 : {stats.total} / 완료 : {stats.completed} </h3>

			{
				searchedTodos.map(todo => (
					<TodoItem 
						key={todo.id}
						todo={todo}
						onToggle={handleToggle}
						onDelete={handleDelete}
					/>
				))
			}

		</div>
  	)
}

export default Home