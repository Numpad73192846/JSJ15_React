import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Board from './pages/Board'
import Login from './pages/Login'
import Admin from './pages/Admin'

function App() {
	// state
    const [isLogin, setIsLogin] = useState(true)

    return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={ <Home /> } />
					<Route path='/about' element={ <About /> } />
					<Route path='/boards/:id' element={ <Board /> } />
					<Route path='/login' element={ <Login /> } />
					<Route 
						path='/admin'
						element={ isLogin ? <Admin /> : <Navigate to='/login' /> }
					/>
				</Routes>
			</BrowserRouter>
		</>
    )
}

export default App