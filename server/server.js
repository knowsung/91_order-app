import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './config/database.js'
import menuRoutes from './routes/menus.js'
import orderRoutes from './routes/orders.js'

// 환경 변수 로드
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 미들웨어 설정
app.use(cors()) // CORS 설정 (프런트엔드와 통신을 위해)
app.use(express.json()) // JSON 파싱
app.use(express.urlencoded({ extended: true })) // URL 인코딩된 데이터 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '커피 주문 앱 API 서버가 실행 중입니다.',
    version: '1.0.0'
  })
})

// API 라우트 (추후 추가 예정)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

// 데이터베이스 연결 테스트
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version')
    res.json({
      success: true,
      message: '데이터베이스 연결 성공',
      data: {
        currentTime: result.rows[0].current_time,
        pgVersion: result.rows[0].pg_version.split(',')[0]
      }
    })
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error)
    res.status(500).json({
      success: false,
      error: '데이터베이스 연결 실패',
      message: error.message
    })
  }
})

// API 라우트
app.use('/api/menus', menuRoutes)
app.use('/api/orders', orderRoutes)

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청한 리소스를 찾을 수 없습니다.'
  })
})

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('에러 발생:', err)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || '서버 내부 오류가 발생했습니다.'
  })
})

// 서버 시작 전 데이터베이스 연결 테스트
async function startServer() {
  try {
    // 데이터베이스 연결 테스트
    const testResult = await pool.query('SELECT NOW()')
    console.log('✅ 데이터베이스 연결 성공:', testResult.rows[0].now)
  } catch (error) {
    console.error('⚠️  데이터베이스 연결 실패:', error.message)
    console.error('   서버는 시작되지만 데이터베이스 기능은 사용할 수 없습니다.')
    console.error('   다음을 확인하세요:')
    console.error('   1. PostgreSQL이 실행 중인지 확인')
    console.error('   2. .env 파일이 존재하는지 확인')
    console.error('   3. 데이터베이스가 생성되었는지 확인 (CREATE DATABASE cozy_order_app;)')
    console.error('   4. .env 파일의 DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD 설정 확인')
  }
  
  // 데이터베이스 연결 여부와 관계없이 서버 시작
  app.listen(PORT, () => {
    console.log(`✅ 서버가 포트 ${PORT}에서 실행 중입니다.`)
    console.log(`   http://localhost:${PORT}`)
    console.log(`   데이터베이스: ${process.env.DB_NAME || 'cozy_order_app'}`)
    console.log(`   환경: ${process.env.NODE_ENV || 'development'}`)
  })
}

startServer()

export default app

