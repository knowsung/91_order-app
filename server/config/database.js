import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// 데이터베이스 연결 풀 생성
// Render.com에서는 DATABASE_URL 환경 변수를 제공하므로 이를 우선 사용
let poolConfig

if (process.env.DATABASE_URL) {
  // Render.com의 Internal Database URL 사용
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  }
} else {
  // 로컬 개발 환경
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'cozy_order_app',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  }
}

const pool = new Pool(poolConfig)

// 연결 이벤트 핸들러
pool.on('connect', (client) => {
  console.log('새로운 클라이언트가 데이터베이스에 연결되었습니다.')
})

pool.on('error', (err, client) => {
  console.error('⚠️  예상치 못한 데이터베이스 오류:', err.message)
  // 프로세스를 종료하지 않고 에러만 로깅
  // 서버는 계속 실행되도록 함
})

// 애플리케이션 종료 시 연결 풀 종료
process.on('SIGINT', async () => {
  console.log('\n서버 종료 중...')
  await pool.end()
  console.log('데이터베이스 연결 풀이 종료되었습니다.')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n서버 종료 중...')
  await pool.end()
  console.log('데이터베이스 연결 풀이 종료되었습니다.')
  process.exit(0)
})

export default pool

