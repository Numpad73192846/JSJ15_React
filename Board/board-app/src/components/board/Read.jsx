import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ArrowLeft, Pencil } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import useBoard from '../../hooks/useBoard'
import FileItem from '../common/FileItem'
import { useFileDownload } from '../../hooks/useFileDownload'

const Read = () => {

	const { id } = useParams()
	const { board, fileList, isLoading, isError } = useBoard(id)
	const { download } = useFileDownload()

	return (
		<div>
			{/* 제목 영역 */}
			<div className='mb-5'>
				<h1 className='text-2xl font-bold text-gray-900 mb-2'>{board?.title}</h1>
				<div className='flex items-center gap-3 text-sm text-gray-400'>
					<span>{board?.writer}</span>
					<span>.</span>
					<span>{board?.createdAt}</span>
				</div>
			</div>

			{/* 내용 영역 */}
			<div className='bg-white rounded-xl border border-gray-200 p-5 mb-5'>
				<CKEditor editor={ClassicEditor} data={board?.content || ''} disabled config={ { toolbar: [] } } />
			</div>

			{/* 첨부 파일 영역 */}
			{
				fileList.length > 0 && (
					<div className='bg-white rounded-xl border border-gray-200 p-5 mb-5'>
						<h3 className='text-sm font-semibold text-gray-700 mb-3'>첨부 파일 ({fileList.length})</h3>
						<div className='flex flex-col gap-2'>
							{
								fileList.map((file) => (
									<FileItem key={file.id} file={file} onDownload={download} />
								))
							}

						</div>
					</div>
				)
			}

			{/* 하단 버튼 영역 */}
			<div className='flex items-center justify-between'>
				<Link to={"/boards"} className='inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
					<ArrowLeft size={15} />
					목록
				</Link>

				<Link to={`/boards/update/${id}`} className='inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors'>
					<Pencil size={15} />
					수정
				</Link>
			</div>
		</div>
	)
}

export default Read