import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Join from './pages/Join'
import User from './pages/User'
import About from './pages/About'
import Admin from './pages/Admin'
import LoginContextProvider from './context/LoginContextProvider'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <LoginContextProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/join' element={<Join />} />
          <Route path='/user' element={
              <ProtectedRoute roles={['ROLE_USER']}>
                <User />
              </ProtectedRoute>
            } />
          <Route path='/about' element={<About />} />
          <Route path='/admin' element={
              <ProtectedRoute roles={['ROLE_ADMIN']}>
                <Admin />
              </ProtectedRoute>
            } />
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  )
}

export default App
