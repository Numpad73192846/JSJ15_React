import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ pagination }) => {

	const [ searchParams ] = useSearchParams()
	const currentPage = parseInt(searchParams.get('page') || 1 )

	if ( !pagination || !pagination.last ) {
		return null
	}

	const { start, end, first, last, prev, next } = pagination

	// start : 1, end : 10 (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
	const pageList = []
	for ( let i = start; i <= end; i++ ) {
		pageList.push(i)
	}

	const buildPageUrl = (page) => `?page=${page}&size=${searchParams.get('size') || 10}`

	// 공통 버튼 스타일
	const btnNav = 'inline-flex items-center justify-center min-w-[53px] h-10 px-3 border border-gray-300 rounded text-sm text-gray-800 bg-transparent hover:bg-gray-50 hover:border-blue-600 transition-all'
	const btnNavDisabled = 'inline-flex items-center justify-center min-w-[53px] h-10 px-3 border border-gray-300 rounded text-sm text-gray-800 bg-transparent opacity-50 cursor-not-allowed'
	const btnNum = 'inline-flex items-center justify-center w-10 h-10 border border-gray-300 rounded text-sm text-gray-800 bg-transparent hover:bg-gray-50 hover:border-blue-600 transition-all'
	const btnNumActive = 'inline-flex items-center justify-center w-10 h-10 border border-blue-600 rounded text-sm text-white bg-blue-600'

	const isFirst = currentPage == first
	const isLast = currentPage == last

	return (
		<div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
			{/* 첫 페이지 이동 버튼 */}
			<Link to={buildPageUrl(first)} className={isFirst ? btnNavDisabled : btnNav} onClick={isFirst ? (e) => e.preventDefault() : undefined} aria-label='첫 페이지' >
				<ChevronFirst size={16} />
			</Link>

			{/* 이전 페이지 이동 버튼 */}
			{
				!isFirst && (
					<Link to={buildPageUrl(prev)} className={btnNav} aria-label='이전 페이지' >
						<ChevronLeft size={16} />
					</Link>
				)
			}

			{/* 번호 이동 버튼 */}
			<div className="flex gap-1">
				{pageList.map((page) => (
					<Link key={page} to={buildPageUrl(page)} className={ page === currentPage ? btnNumActive : btnNum }>
						{page}
					</Link>
				))}
			</div>

			{/* 다음 페이지 이동 버튼 */}
			{ !isLast && (
				<Link to={buildPageUrl(next)} className={btnNav} aria-label='다음 페이지'>
					<ChevronRight size={16} />
				</Link>
			)}

			{/* 마지막 페이지 이동 버튼 */}
			<Link to={buildPageUrl(last)} className={ isLast ? btnNavDisabled : btnNav } onClick={ isLast ? (e) => e.preventDefault() : undefined } aria-label='마지막 페이지'>
				<ChevronLast size={16} />
			</Link>
		</div>
	)
}

export default Pagination