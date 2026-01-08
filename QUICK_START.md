# 빠른 시작 가이드

## 서버 실행 방법

### 1. 백엔드 서버 실행

터미널 1에서:
```bash
cd server
npm run dev
```

서버가 정상적으로 실행되면 다음과 같은 메시지가 표시됩니다:
```
✅ 서버가 포트 3000에서 실행 중입니다.
   http://localhost:3000
```

### 2. 프런트엔드 서버 실행

터미널 2에서:
```bash
cd ui
npm run dev
```

프런트엔드 서버가 정상적으로 실행되면 다음과 같은 메시지가 표시됩니다:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 3. 샘플 데이터 삽입 (처음 한 번만)

새 터미널에서:
```bash
cd server
npm run seed
```

## 접속 URL

- **프런트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:3000
- **API 테스트**: http://localhost:3000/api/menus

## 문제 해결

### 서버가 실행되지 않는 경우

1. **백엔드 서버 확인:**
   - `cd server` 후 `npm run dev` 실행
   - 포트 3000이 사용 중인지 확인

2. **프런트엔드 서버 확인:**
   - `cd ui` 후 `npm run dev` 실행
   - 포트 5173이 사용 중인지 확인

3. **데이터베이스 확인:**
   ```bash
   cd server
   npm run test-db
   ```

4. **샘플 데이터 확인:**
   ```bash
   cd server
   npm run seed
   ```

## 중요 사항

- 백엔드 서버와 프런트엔드 서버를 **동시에 실행**해야 합니다
- 두 서버 모두 실행 중인 터미널 창을 닫지 마세요
- 서버를 중지하려면 각 터미널에서 `Ctrl + C`를 누르세요
