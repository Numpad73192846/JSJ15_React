import React, { useRef, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ImageIcon, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBoardMutations } from '../../hooks/useBoardMutations'
import { useForm } from 'react-hook-form'
import { filesApi } from '../../api/files'

// CKEditor 이미지 업로드 플러그인
function uploadAdapterPlugin(editor) {
	editor.plugins.get('FileRepository').createUploadAdapter = (loader) => ({
		upload: async () => {
			const file = await loader.file
			const formData = new FormData()
			formData.append('pId','')
			formData.append('type','SUB')
			formData.append('data', file)

			const res = await filesApi.upload(formData, {'Content-Type' : 'multipart/form-data'})

			return {
				default: `/api/files/img/${res.data.id}`
			}

		},
		abort: () => {},
	})
}

const Insert = () => {
	
	const navigate = useNavigate()
	const contentRef = useRef('')
	const { insertBoard, isInserting } = useBoardMutations()

	// 메인 파일 state
	const fileInputRef = useRef(null)
	const [mainFile, setMainFile] = useState(null)
	const [preview, setPreview] = useState(null)
	const [isDragging, setIsDragging] = useState(false)

	const { register, handleSubmit, formState: { errors } } = useForm()

	const onSubmit = (data) => {
		const formData = new FormData()
		formData.append('title', data.title)
		formData.append('writer', data.writer)
		formData.append('content', contentRef.current)

		// 메인 파일
		if( mainFile ) {
			formData.append('mainFile', mainFile)
		}

		// 첨부 파일
		if(data.files?.length ) {
			Array.from(data.files).forEach( (f) => formData.append('files', f) )
		}

		insertBoard(formData, { 'Content-Type': 'multipart/form-data' })
	}

	// 파일 선택 & 드롭 핸들러
	const handleMainFile = (file) => {
		// 이미지 파일 확인
		if( !file || !file.type.startsWith('image/') ) {
			return
		}

		setMainFile(file)

		// 이미지 미리보기
		const reader = new FileReader()
		reader.onload = (e) => setPreview(e.target.result)
		reader.readAsDataURL(file)
		
	}

	// 메인 파일 제거
	const clearMainFile = () => {
		setMainFile(null)
		setPreview(null)
		if( fileInputRef.current ) {
			fileInputRef.current.value = ''
		}
	}

	// 드래그 이벤트 핸들러
	const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
	const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false) }
	const handleDrop = (e) => {

		e.preventDefault()
		setIsDragging(false)

		const file = e.dataTransfer.files[0]
		if( file ) {
			handleMainFile(file)
		}

	}

	const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 rounded outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white'

	return (

		<form noValidate onSubmit={handleSubmit(onSubmit)}>
			<div className="flex items-center justify-center mb-5">
				<h1 className='text-xl font-semibold text-gray-900 text-center'>글쓰기</h1>
			</div>

			<div className='bg-white rounded-xl border border-gray-200 divide-y divide-gray-100'>
				{/* 제목 */}
				<div className='flex items-start gap-4 px-5 py-4'>
					<label className="w-20 flex-shrink-0 text-sm font-medium text-gray-600 pt-2">
						제목 <span className='text-red-400'>*</span>
					</label>
					<div className='flex-1'>
						<input placeholder='제목을 입력해주세요' className={inputClass} {...register('title', { required: '제목을 입력해주세요' })} />
						{
							errors.title && (
								<p className='mt-1 text-xs text-red-500'>{errors.title.message}</p>
							)
						}
					</div>
				</div>

				{/* 제목 */}
				<div className='flex items-start gap-4 px-5 py-4'>
					<label className="w-20 flex-shrink-0 text-sm font-medium text-gray-600 pt-2">
						작성자 <span className='text-red-400'>*</span>
					</label>
					<div className='flex-1'>
						<input placeholder='작성자를 입력해주세요' className={inputClass} {...register('writer', { required: '작성자를 입력해주세요' })} />
						{
							errors.writer && (
								<p className='mt-1 text-xs text-red-500'>{errors.writer.message}</p>
							)
						}
					</div>
				</div>

				{/* 내용 */}
				<div className='px-5 py-4'>
					<label className="block text-sm font-medium text-gray-600 mb-2">
						내용
					</label>
					<CKEditor editor={ClassicEditor} config={{ extraPlugins: [uploadAdapterPlugin], toolbar: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'bulletedList', 'numberedList', '|', 'link', 'imageUpload', 'mediaEmbed', '|', 'blockQuote', 'code',] }} onChange={(_, editor) => { contentRef.current = editor.getData() }} />
				</div>

				{/* 메인 파일 업로드 영역 */}
				<div className='flex items-start gap-4 px-5 py-4'>
					<label className="w-20 flex-shrink-0 text-sm font-medium text-gray-600 pt-2">
						메인 파일
					</label>
					<div className='flex-1'>
						{
							preview ? (
								/* 미리보기 */
								<div className='relative inline-block'>
									<img src={preview} alt="미리보기" className='w-48 h-32 object-cover rounded-lg border border-gray-200' />
									<button type='button' onClick={clearMainFile} aria-label='이미지 삭제' className='absolute top-2 right-2 w-5 h-5 bg-gray-700 text-white flex items-center justify-center hover:bg-gray-900 transition-colors'>
										<X size={11} />
									</button>
								</div>
							) : (
								/* 드래그 & 드랍 */
								<div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`w-full h-28 border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors select-none ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}>
									<ImageIcon size={22} className={isDragging ? 'text-blue-400' : 'text-gray-300'} />
									<span className='text-xs text-gray-400'>
										클릭하거나 파일을 드래그하세요
									</span>
									<span className='text-xs text-gray-300'>
										JPG, PNG, GIF , WEBP
									</span>
								</div>
							)
						}
						{/* 파일 입력 */}
						<input ref={fileInputRef} type="file" accept='image/*' className='hidden' onChange={(e) => handleMainFile(e.target.files?.[0])} />
					</div>
				</div>

				{/* 첨부 파일 업로드 영역 */}
				<div className='flex items-center gap-4 px-5 py-4'>
					<label className="w-20 flex-shrink-0 text-sm font-medium text-gray-600">
						첨부 파일
					</label>
					<input type="file" multiple className='flex-1 text-sm text-gray-600 file:mr-3 file:py-1.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 cursor-pointer' {...register('files')} />
				</div>
			</div>

			{/* 버튼 */}
			<div className='flex items-center justify-between gap-2 mt-6'>
				<button onClick={() => navigate('/boards')} type='button' className='px-4 py-2 w-full text-sm font---medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'>
					취소
				</button>
				<button type='submit' disabled={isInserting} className='px-4 py-2 w-full text-sm font---medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer'>
					{ isInserting ? '저장 중...' : '저장' }
				</button>
			</div>
		</form>

	)
}

export default Insert