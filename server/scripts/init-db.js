import pool from '../config/database.js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// .env 파일 경로 명시적으로 지정
const envPath = path.join(__dirname, '..', '.env')

// dotenv 설정 (override 옵션 추가)
const result = dotenv.config({ path: envPath, override: true })

if (result.error) {
  console.warn('⚠️  .env 파일 로드 오류:', result.error.message)
  console.warn('   환경 변수가 이미 설정되어 있을 수 있습니다.')
} else {
  console.log('✅ .env 파일이 로드되었습니다.')
}

async function initDatabase() {
  // .env 파일 존재 확인
  if (!fs.existsSync(envPath)) {
    console.error(`❌ .env 파일을 찾을 수 없습니다: ${envPath}`)
    process.exit(1)
  }
  console.log(`✅ .env 파일 경로: ${envPath}`)
  
  // 환경 변수 확인
  console.log('\n환경 변수 확인:')
  console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '설정됨' : '없음'}`)
  console.log(`  DB_HOST: ${process.env.DB_HOST || '없음'}`)
  console.log(`  DB_PORT: ${process.env.DB_PORT || '없음'}`)
  console.log(`  DB_NAME: ${process.env.DB_NAME || '없음'}`)
  console.log(`  DB_USER: ${process.env.DB_USER || '없음'}`)
  console.log(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? '설정됨' : '없음'}`)
  
  if (process.env.DATABASE_URL) {
    console.log('\n✅ DATABASE_URL이 설정되어 있습니다.')
    console.log('연결 정보:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'))
  } else if (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD) {
    console.log('\n✅ 개별 DB 환경 변수가 설정되어 있습니다.')
    console.log(`호스트: ${process.env.DB_HOST}:${process.env.DB_PORT || 5432}`)
    console.log(`데이터베이스: ${process.env.DB_NAME}`)
  } else {
    console.error('\n❌ 데이터베이스 연결 정보가 없습니다.')
    console.error('DATABASE_URL 또는 DB_HOST, DB_NAME, DB_USER, DB_PASSWORD를 설정하세요.')
    process.exit(1)
  }

  const client = await pool.connect()

  try {
    console.log('\n데이터베이스 스키마 초기화 시작...')

    // SQL 파일 읽기
    const sqlPath = path.join(__dirname, 'init-db.sql')
    let sql = fs.readFileSync(sqlPath, 'utf8')

    // CREATE DATABASE 부분과 주석 제거
    sql = sql.replace(/-- 데이터베이스 생성.*?CREATE DATABASE.*?;/gis, '')
    
    // 주석 제거 (-- 로 시작하는 줄)
    sql = sql.replace(/--.*$/gm, '')
    
    // 빈 줄 정리
    sql = sql.replace(/\n\s*\n/g, '\n').trim()

    // 전체 SQL을 한 번에 실행
    await client.query(sql)
    
    console.log('✅ 데이터베이스 스키마가 성공적으로 초기화되었습니다!')
    console.log('\n생성된 테이블:')
    console.log('  - menus (메뉴)')
    console.log('  - options (옵션)')
    console.log('  - orders (주문)')
    console.log('  - order_items (주문 항목)')
    console.log('  - order_item_options (주문 항목 옵션)')

  } catch (error) {
    // 일부 오류는 무시 (이미 존재하는 경우 등)
    if (error.message.includes('already exists') || 
        error.message.includes('duplicate') ||
        error.message.includes('already exists')) {
      console.log('⚠️  일부 객체가 이미 존재합니다. (정상)')
      console.log('✅ 데이터베이스 스키마가 이미 초기화되어 있습니다.')
    } else {
      console.error('❌ 스키마 초기화 오류:', error.message)
      console.error('상세 오류:', error)
      process.exit(1)
    }
  } finally {
    client.release()
    await pool.end()
  }
}

initDatabase()
