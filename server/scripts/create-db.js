import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function createDatabase() {
  // 먼저 postgres 데이터베이스에 연결 (기본 데이터베이스)
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres', // 기본 데이터베이스
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  })

  try {
    await adminClient.connect()
    console.log('PostgreSQL에 연결되었습니다.')

    const dbName = process.env.DB_NAME || 'cozy_order_app'

    // 데이터베이스가 이미 존재하는지 확인
    const checkResult = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    )

    if (checkResult.rows.length > 0) {
      console.log(`✅ 데이터베이스 "${dbName}"가 이미 존재합니다.`)
    } else {
      // 데이터베이스 생성
      await adminClient.query(`CREATE DATABASE ${dbName}`)
      console.log(`✅ 데이터베이스 "${dbName}"가 생성되었습니다.`)
    }

    await adminClient.end()

    // 이제 생성된 데이터베이스에 연결하여 스키마 초기화
    const dbClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    })

    await dbClient.connect()
    console.log(`데이터베이스 "${dbName}"에 연결되었습니다.`)

    // 스키마 초기화 SQL 읽기
    const fs = await import('fs')
    const path = await import('path')
    const { fileURLToPath } = await import('url')
    const { dirname } = await import('path')

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const sqlPath = path.join(__dirname, 'init-db.sql')
    let sql = fs.readFileSync(sqlPath, 'utf8')

    // CREATE DATABASE 부분 제거
    sql = sql.replace(/-- 데이터베이스 생성.*?CREATE DATABASE.*?;/gis, '')
    
    // 주석 제거 (-- 로 시작하는 줄)
    sql = sql.replace(/--.*$/gm, '')
    
    // 빈 줄 정리
    sql = sql.replace(/\n\s*\n/g, '\n').trim()

    // 전체 SQL을 한 번에 실행 (함수 정의 등이 포함되어 있으므로)
    try {
      await dbClient.query(sql)
      console.log('✅ 데이터베이스 스키마가 초기화되었습니다.')
    } catch (error) {
      // 일부 오류는 무시 (이미 존재하는 경우 등)
      if (error.message.includes('already exists') || 
          error.message.includes('duplicate')) {
        console.log('⚠️  일부 객체가 이미 존재합니다. (정상)')
      } else {
        console.error('SQL 실행 오류:', error.message)
        throw error
      }
    }

    console.log('✅ 데이터베이스 스키마가 초기화되었습니다.')
    await dbClient.end()

    console.log('\n✅ 모든 작업이 완료되었습니다!')
    console.log('이제 서버를 재시작하면 데이터베이스에 연결됩니다.')

  } catch (error) {
    console.error('❌ 오류 발생:', error.message)
    console.error('\n다음을 확인하세요:')
    console.error('1. PostgreSQL이 실행 중인지 확인')
    console.error('2. .env 파일의 DB_HOST, DB_PORT, DB_USER, DB_PASSWORD 설정 확인')
    console.error('3. PostgreSQL 사용자 권한 확인')
    process.exit(1)
  }
}

createDatabase()
