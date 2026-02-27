import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ImageIcon } from 'lucide-react'

const Update = () => {

	const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 rounded outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white'

	return (
		
		<form noValidate>
			<div className="flex items-center justify-center mb-5">
				<h1 className='text-xl font-semibold text-gray-900 text-center'>글수정</h1>
			</div>

			<div className='bg-white rounded-xl border border-gray-200 divide-y divide-gray-100'>
				{/* 제목 */}
				<div className='flex items-start gap-4 px-5 py-4'>
					<label className="w-20 flex-shrink-0 text-sm font-medium text-gray-600 pt-2">
						제목 <span className='text-red-400'>*</span>
					</label>
					<div className='flex-1'>
						<input placeholder='제목을 입력해주세요' className={inputClass} />
						<p className='mt-1 text-xs text-red-500'>유효한 값을 입력하세요.</p>
					</div>
				</div>

				{/* 제목 */}
				<div className='flex items-start gap-4 px-5 py-4'>
					<label className="w-20 flex-shrink-0 text-sm font-medium text-gray-600 pt-2">
						작성자 <span className='text-red-400'>*</span>
					</label>
					<div className='flex-1'>
						<input placeholder='작성자를 입력해주세요' className={inputClass} />
						<p className='mt-1 text-xs text-red-500'>유효한 값을 입력하세요.</p>
					</div>
				</div>

				{/* 내용 */}
				<div className='px-5 py-4'>
					<label className="block text-sm font-medium text-gray-600 mb-2">
						내용
					</label>
					<CKEditor editor={ClassicEditor} config={{ toolbar: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'bulletedList', 'numberedList', '|', 'link', 'imageUpload', 'mediaEmbed', '|', 'blockQuote', 'code',], }} />
				</div>

				{/* 메인 파일 업로드 영역 */}
				<div className='flex items-start gap-4 px-5 py-4'>
					<label className="w-20 flex-shrink-0 text-sm font-medium text-gray-600 pt-2">
						메인 파일
					</label>
					<div className='flex-1'>
						<div className='w-full h-28 border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors select-none'>
							<ImageIcon size={22} className='text-gray-300'/>
						</div>
						<span className='text-xs text-gray-400'>
							클릭하거나 파일을 드래그하세요
						</span>
						<span className='text-xs text-gray-300'>
							JPG, PNG, GIF , WEBP
						</span>
						{/* 파일 입력 */}
						<input type="file" accept='image/*' className='hidden' />
					</div>
				</div>

				{/* 첨부 파일 업로드 영역 */}
				<div className='flex items-center gap-4 px-5 py-4'>
					<label className="w-20 flex-shrink-0 text-sm font-medium text-gray-600">
						첨부 파일
					</label>
					<input type="file" multiple className='flex-1 text-sm text-gray-600 file:mr-3 file:py-1.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 cursor-pointer' />
				</div>
			</div>

			{/* 버튼 */}
			<div className='flex items-center justify-between gap-2 mt-6'>
				<button type='button' className='px-4 py-2 w-full text-sm font---medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'>
					취소
				</button>
				<button type='button' className='px-4 py-2 w-full text-sm font---medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer'>
					저장
				</button>
			</div>
		</form>

	)
}

export default Update