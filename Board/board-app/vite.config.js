import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  server: {
    proxy: {
      // '/api'로 시작하는 요청을 http://localhost:8080으로 프록시 처리
      '/api': {
        // 실제 요청을 보낼 백엔드 서버 주소
        target: 'http://localhost:8080',
        // 요청 헤더 Host를 타겟 서버의 주소로 변경
        // Host: http://localhost:5137/api/boards -> Host: http://localhost:8080/borads
        changeOrigin: true,
        // /api/boards -> /boards
        rewrite: (path) => path.replace(/^\/api/, ''),
        // 프록시 동작 설정
        configure: (proxy) => {
          // proxyReq 이벤트 : 백엔드 요청을 가로채는 이벤트
          proxy.on('proxyReq', (proxyReq) => {
            // origin 헤더 제거 : CORS 문제 방지 위해 origin 헤더 제거
            proxyReq.removeHeader('origin')
          })
        }
      }
    }
  }
})
