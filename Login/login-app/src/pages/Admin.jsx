import React from 'react'
import Layout from '../components/common/Layout'

const Admin = () => {
  return (
    <Layout>
      <h1>Admin</h1>
      <hr />
      <h2>관리자 화면</h2>
      <p>이 페이지는 ROLE_ADMIN 권한이 있는 사용자만 접속 가능합니다.</p>
    </Layout>
  )
}

export default Admin