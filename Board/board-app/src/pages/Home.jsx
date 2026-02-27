import React from 'react'
import { LayoutList, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {

  return (

	<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
		<div className='text-center'>
			<div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6'>
				<LayoutList size={32} className='text-blue-500' />
			</div>
			<h1 className='text-3xl font-bold text-gray-900 mb-2'>게시판</h1>
			<p className='text-gray-500 mb-8'>
				게시판 프로젝트입니다.
			</p>
			<ul>
				<li>Front : React</li>
				<li>Back : SpringBoot</li>
			</ul>
			<Link to="/boards" className='inline-flex bg-blue-500 items-center gap-2 px-6 py-3 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors'>게시판 바로가기<ArrowRight size={16}></ArrowRight></Link>
		</div>
	</div>

  )

}

export default Home