import { LayoutList } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Layout = ( { children } ) => {

  return (
	<div className='min-h-screen bg-gray-50'>
		{/* 헤더 */}
		<header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
			<div className='max-w-4xl mx-auto px-6 h-14 flex items-center gap-3'>
				<Link to="/boards" className='flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors'>
					<LayoutList size={20} />
					<span className='font-semibold text-base'>게시판</span>
				</Link>
			</div>
		</header>

		{/* 메인 콘텐츠 */}
		<main className='max-w-4xl mx-auto px-6 py-8'>{children}</main>
	</div>
  )

}

export default Layout