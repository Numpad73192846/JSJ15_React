import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ArrowLeft, Download, Pencil, Trash2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Read = () => {
	return (
		<div>
			{/* 제목 영역 */}
			<div className='mb-5'>
				<h1 className='text-2xl font-bold text-gray-900 mb-2'>제목 입니다.</h1>
				<div className='flex items-center gap-3 text-sm text-gray-400'>
					<span>작성자</span>
					<span>.</span>
					<span>2026-02-27 15:20:50</span>
				</div>
			</div>

			{/* 내용 영역 */}
			<div className='bg-white rounded-xl border border-gray-200 p-5 mb-5'>
				<CKEditor editor={ClassicEditor} disabled config={ { toolbar: [] } } />
			</div>

			{/* 첨부 파일 영역 */}
			<div className='bg-white rounded-xl border border-gray-200 p-5 mb-5'>
				<h3 className='text-sm font-semibold text-gray-700 mb-3'>첨부 파일 (5)</h3>
				<div className='flex flex-col gap-2'>
					<div className='flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors'>

						{/* 파일 선택 체크박스 */}
						<input type="checkbox" className='w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0' />

						{/* 썸네일 */}
						<div className='w-16 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-100'>
							<img src="" alt="" className='w-full h-full object-cover' />
						</div>

						{/* 파일 정보 */}
						<div className='flex-1 min-w-0 flex items-center gap-2'>
							<p className='text-sm font-medium text-gray-800 truncate'>
								첨부파일명.png
							</p>
							<p className='text-xs text-gray-400 mt-5'>
								<span className='ml-2 inline-block px-1.5 p-0.5 text-xs bg-blue-500 text-white rounded'>
									대표
								</span>
							</p>
						</div>

						{/* 버튼 */}
						<div className='flex items-center gap-1 flex-shrink-0'>
							<button type='button' className='p-1.5 rounded text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer' title='다운로드'>
								<Download size={15} />
							</button>
						</div>
						<div className='flex items-center gap-1 flex-shrink-0'>
							<button type='button' className='p-1.5 rounded text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer' title='삭제'>
								<Trash2 size={15} />
							</button>
						</div>
					</div>

				</div>
			</div>

			{/* 하단 버튼 영역 */}
			<div className='flex items-center justify-between'>
				<Link to={"/boards"} className='inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
					<ArrowLeft size={15} />
					목록
				</Link>

				<Link to={"/boards/update/:id"} className='inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors'>
					<Pencil size={15} />
					수정
				</Link>
			</div>
		</div>
	)
}

export default Read