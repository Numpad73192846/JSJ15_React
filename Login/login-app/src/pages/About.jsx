import React from 'react'
import Layout from '../components/common/Layout'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <Layout>
      <h1>소개 화면</h1>
      <hr />
      <ul>
        <li><Link to="/">메인화면</Link></li>
        <li><Link to="/user">마이 페이지</Link></li>
        <li><Link to="/admin">관리자 화면</Link></li>
      </ul>
    </Layout>
  )
}

export default About