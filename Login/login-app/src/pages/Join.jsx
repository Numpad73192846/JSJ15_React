import React from 'react'
import Layout from '../components/common/Layout'
import JoinForm from '../components/Join/JoinForm'
import { useNavigate } from 'react-router-dom'
import * as auth from '../api/auth'
import * as Swal from '../api/alert'


const Join = () => {

  const navigate = useNavigate()

  const join = async (form) => {
    try {
      const response = await auth.join(form)
  
      if ( response.status === 200 ) {
        Swal.alert('회원 가입 성공', '로그인 화면으로 이동합니다', 'success', () => navigate('/login'))
      }
    } catch (error) {
      console.error('회원가입 중 에러가 발생하였습니다.', error);
      Swal.alert('회원 가입 실패', '회원가입에 실패하였습니다.', 'error')
    }
  } 

  return (
    <Layout>
      <JoinForm join={ join } />
    </Layout>
  )
}

export default Join