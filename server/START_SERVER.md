# 서버 실행 가이드

## 서버 실행 방법

### 1. 터미널에서 서버 디렉토리로 이동
```bash
cd server
```

### 2. 서버 실행
```bash
npm run dev
```

### 3. 정상 실행 확인
서버가 정상적으로 실행되면 다음과 같은 메시지가 표시됩니다:

```
✅ 데이터베이스 연결 성공: 2024-01-XX XX:XX:XX
✅ 서버가 포트 3000에서 실행 중입니다.
   http://localhost:3000
   데이터베이스: cozy_order_app
   환경: development
```

### 4. 브라우저에서 확인
서버가 실행된 후 다음 URL로 접속:
- http://localhost:3000
- http://localhost:3000/api/health
- http://localhost:3000/api/menus

## 문제 해결

### 서버가 실행되지 않는 경우

1. **패키지 설치 확인**
   ```bash
   npm install
   ```

2. **환경 변수 확인**
   ```bash
   npm run check-env
   ```

3. **데이터베이스 연결 확인**
   ```bash
   npm run test-db
   ```

4. **포트 충돌 확인**
   - 다른 프로세스가 3000 포트를 사용 중일 수 있습니다
   - `.env` 파일에서 `PORT=3001` 등으로 변경 가능

### 서버를 중지하는 방법
터미널에서 `Ctrl + C`를 누르면 서버가 중지됩니다.
