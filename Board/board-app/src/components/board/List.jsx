import React from 'react'
import { Link } from 'react-router-dom'

const List = () => {
  return (
	<div>
		{/* 상단 헤더 */}
		<div className="flex items-center justify-between mb-5">
			<h1 className='text-xl font-semibold text-gray-900'>게시판</h1>
			<Link to="/boards/insert" className='inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors'>글쓰기</Link>
		</div>

		{/* 테이블 */}
		<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
			<table className='w-full text-sm'>
				<thead>
					<tr className='bg-gray-50 border-b border-gray-200'>
						<th className='w-14 px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wide'>
							No
						</th>
						<th className='w-20 px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wide'>
							썸네일
						</th>
						<th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wide'>
							제목
						</th>
						<th className='w-28 px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wide'>
							작성자
						</th>
						<th className='w-36 px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wide'>
							등록일
						</th>
					</tr>
				</thead>
				<tbody className='divide-y divide-gray-100'>
					<tr className='hover:bg-gray-50 transition-colors'>
						<td className='px-4 py-3 text-gray-500'>1</td>
						<td className='px-4 py-3'>
							<div className='w-14 h-9 rounded bg-gray-100'></div>
						</td>
						<td className='px-4 py-3'>
							<Link to={'/boards/:id'} className='text-gray-900 hover:text-blue-600 font-medium transition-colors'>게시글 제목입니다.</Link>
						</td>
						<td className='px-4 py-3 text-gray-600'>작성자</td>
						<td className='px-4 py-3 text-gray-400 text-xs'>2026-02-27 12:30:00</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
  )
}

export default List