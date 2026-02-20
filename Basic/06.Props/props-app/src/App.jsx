import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProductDetail from './components/ProductDetail'


function App() {

    // 상품 객체 정의
    const product = {
      id		  : "p0001",
      name 	  : "모니터",
      price 	  : 220000,
      quantity  : 1,
      img	      : "https://i.imgur.com/RBP3TVG.png"
    }

    return (
      <>
        {/* props 로 product 객체 전달 */}
        <ProductDetail product={ product } />
      </>
    )
}

export default App;