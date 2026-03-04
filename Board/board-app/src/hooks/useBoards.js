import { useQuery } from '@tanstack/react-query'
import { boardsApi } from '../api/boards'

/**
 * 게시글 목록 조회 커스텀 훅
 * @param {*} page 
 * @param {*} size 
 */
export const useBoards = ( page = 1, size = 10 ) => {
	const { data, isLoading, isError, error } =useQuery({
		queryKey: ['boards', page, size],
		queryFn: () => boardsApi.list(page, size).then((res) => res.data),
		placeholderData: (prev) => prev,
	})

	return {
		list: data?.list ?? [],
		pagination: data?.pagination ?? {},
		isLoading,
		isError,
		error
	}
}