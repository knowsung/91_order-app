import pool from '../config/database.js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function seedData() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    console.log('샘플 데이터 삽입 시작...')

    // SQL 파일 읽기
    const sqlPath = path.join(__dirname, 'seed-data.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // SQL 실행
    await client.query(sql)

    await client.query('COMMIT')
    console.log('✅ 샘플 데이터가 성공적으로 삽입되었습니다!')

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ 데이터 삽입 오류:', error.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seedData()
