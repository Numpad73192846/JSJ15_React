import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardsApi } from '../api/boards'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

// 공통 알림
const $alert = (title, text, icon) => Swal.fire({
	title,
	text,
	icon: icon,	// success, error, warning, info, question
	confirmButtonText: '확인',
	confirmButtonColor: '#3b82f6',
})

export const useBoardMutations = (id) => {

	// useQueryClient : React Query의 캐시를 관리하는 객체를 반환하는 훅
	const queryClient = useQueryClient()
	// useNavigate : React Router에서 페이지 이동을 위한 함수를 반환하는 훅
	const navigate = useNavigate()

	// 글 등록
	// useMutation? : 데이터를 등록, 수정, 삭제할 때 사용하는 훅
	const insertMutation = useMutation({

		// mutationFn : 실제 데이터를 등록, 수정, 삭제하는 함수
		mutationFn: ( { data, headers } ) => boardsApi.insert(data, headers),
		// onSuccess : mutationFn이 성공적으로 실행된 후에 실행되는 콜백 함수
		onSuccess: async () => {
			// invalidateQueries : 특정 쿼리 키에 해당하는 캐시 데이터를 무효화하여, 다음번에 해당 쿼리를 사용할 때 새로운 데이터를 가져오도록 하는 함수
			queryClient.invalidateQueries({ queryKey: ['boards'] })
			// TODO: 등록 성공, 게시글 등록이 완료되었습니다
			// alert('게시글 등록이 완료되었습니다.')
			await $alert('등록 성공', '게시글이 등록되었습니다.', 'success')
			// 게시글 등록 후 목록 페이지로 이동
			navigate('/boards')
		}

	})

	// 글 수정
	const updateMutation = useMutation({
		mutationFn: ({ data, headers }) => boardsApi.update( data, headers ),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ['boards'] })
			queryClient.invalidateQueries({ queryKey: ['board', id] })
			await $alert('수정 성공', '게시글이 수정되었습니다.', 'success')
			navigate(`/boards/${id}`)
		}
	})

	return {
		insertBoard: (data, headers) => insertMutation.mutate({ data, headers }),
		updateBoard: (data, headers) => updateMutation.mutate({ data, headers }),
		
		isInserting: insertMutation.isPending,
		isUpdating: updateMutation.isPending,
	}
}