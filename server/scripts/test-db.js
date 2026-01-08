import pool from '../config/database.js'
import dotenv from 'dotenv'

dotenv.config()

async function testDatabase() {
  try {
    console.log('데이터베이스 연결 테스트 중...')
    console.log(`호스트: ${process.env.DB_HOST || 'localhost'}`)
    console.log(`포트: ${process.env.DB_PORT || 5432}`)
    console.log(`데이터베이스: ${process.env.DB_NAME || 'cozy_order_app'}`)
    console.log(`사용자: ${process.env.DB_USER || 'postgres'}`)
    console.log('')

    // 연결 테스트
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version')
    
    console.log('✅ 데이터베이스 연결 성공!')
    console.log(`현재 시간: ${result.rows[0].current_time}`)
    console.log(`PostgreSQL 버전: ${result.rows[0].pg_version.split(',')[0]}`)
    
    // 연결 풀 종료
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:')
    console.error(`   오류: ${error.message}`)
    console.error('')
    console.error('다음을 확인하세요:')
    console.error('1. PostgreSQL이 실행 중인지 확인')
    console.error('2. .env 파일의 데이터베이스 설정이 올바른지 확인')
    console.error('3. 데이터베이스가 생성되었는지 확인')
    console.error('4. 사용자 권한이 올바른지 확인')
    
    await pool.end()
    process.exit(1)
  }
}

testDatabase()
