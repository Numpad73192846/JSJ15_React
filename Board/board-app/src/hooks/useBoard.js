import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { boardsApi } from '../api/boards'

const useBoard = (id) => {

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ['board', id],
		queryFn: () => boardsApi.select(id).then((res) => res.data),
		// id: null => !id = !(false) = true, !(!id) = !(true) = false
		// !! : id 가 falsy(null, undefined 등) 일 때 , 실행하지 않도로
		enabled: !!id,
	})

	return {
		board: data?.board ?? null,
		fileList: data?.fileList ?? [],
		isLoading,
		isError,
		error,
		refetch
	}
}

export default useBoard