import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// .env 파일 경로
const envPath = join(__dirname, '..', '.env')

console.log('환경 변수 설정 확인 중...\n')

// .env 파일 존재 확인
if (!existsSync(envPath)) {
  console.error('❌ .env 파일이 없습니다!')
  console.error(`   경로: ${envPath}`)
  console.error('\n다음 명령어로 .env 파일을 생성하세요:')
  console.error('   cp env.example .env')
  console.error('\n그 다음 .env 파일을 편집하여 데이터베이스 정보를 입력하세요.')
  process.exit(1)
}

console.log('✅ .env 파일이 존재합니다.')

// 환경 변수 로드
dotenv.config({ path: envPath })

// 필수 환경 변수 확인
const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
const missingVars = []

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName)
  }
})

if (missingVars.length > 0) {
  console.error('\n❌ 다음 환경 변수가 설정되지 않았습니다:')
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`)
  })
  console.error('\n.env 파일을 확인하고 필요한 값을 입력하세요.')
  process.exit(1)
}

console.log('\n✅ 모든 필수 환경 변수가 설정되었습니다:')
console.log(`   DB_HOST: ${process.env.DB_HOST}`)
console.log(`   DB_PORT: ${process.env.DB_PORT}`)
console.log(`   DB_NAME: ${process.env.DB_NAME}`)
console.log(`   DB_USER: ${process.env.DB_USER}`)
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : '(비어있음)'}`)
console.log(`   PORT: ${process.env.PORT || 3000}`)
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
