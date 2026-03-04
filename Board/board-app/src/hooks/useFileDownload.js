import { useCallback } from 'react'
import { filesApi } from '../api/files'

export const useFileDownload = () => {
	const download = useCallback(async (fileId, fileName) => {
		try {
			const response = await filesApi.download(fileId)

			// <a href="URL" download ></a> => 다운로드 기능 사용
			// Blob 객체로 URL 생성
			const url = URL.createObjectURL(new Blob([response.data]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', fileName)
			document.body.appendChild(link)
			link.click()

			// 다운로드 후 링크 제거
			link.parentNode.removeChild(link)
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('파일 다운로드 중 오류 발생:', error)
		}
	}, [])

	return { download }
}