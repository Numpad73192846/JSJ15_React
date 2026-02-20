import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LifeCycleClass from './components/LifeCycleClass'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LifeCycleClass />
    </>
  )
}

export default App
