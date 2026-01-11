# Render.com 배포 가이드

## 배포 순서

### 1단계: PostgreSQL 데이터베이스 생성

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com 접속
   - 로그인

2. **새 PostgreSQL 데이터베이스 생성**
   - "New +" 버튼 클릭
   - "PostgreSQL" 선택
   - 설정:
     - **Name**: `cozy-order-app-db` (또는 원하는 이름)
     - **Database**: `cozy_order_app`
     - **User**: 자동 생성됨
     - **Region**: 가장 가까운 지역 선택
     - **PostgreSQL Version**: 최신 버전
   - "Create Database" 클릭

3. **데이터베이스 정보 확인**
   - 생성 후 "Connections" 탭에서 다음 정보 확인:
     - **Internal Database URL**: 백엔드에서 사용
     - **External Database URL**: 로컬에서 연결 시 사용
     - **Host, Port, Database, User, Password** 정보 저장

### 2단계: 백엔드 서버 배포

1. **GitHub 저장소 준비**
   - 코드를 GitHub에 푸시
   - 저장소가 준비되어 있어야 함

2. **Render.com에서 새 Web Service 생성**
   - "New +" 버튼 클릭
   - "Web Service" 선택
   - GitHub 저장소 연결

3. **백엔드 서비스 설정**
   - **Name**: `cozy-order-app-server` (또는 원하는 이름)
   - **Region**: 데이터베이스와 같은 지역 선택
   - **Branch**: `main` (또는 기본 브랜치)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables** 추가:
     ```
     NODE_ENV=production
     PORT=10000
     DB_HOST=<데이터베이스 호스트>
     DB_PORT=5432
     DB_NAME=cozy_order_app
     DB_USER=<데이터베이스 사용자>
     DB_PASSWORD=<데이터베이스 비밀번호>
     ```
     (데이터베이스 정보는 1단계에서 확인한 값 사용)

4. **고급 설정**
   - "Advanced" 섹션에서:
     - **Auto-Deploy**: `Yes` (GitHub 푸시 시 자동 배포)

5. **생성 및 배포**
   - "Create Web Service" 클릭
   - 배포 완료까지 대기 (약 5-10분)

6. **데이터베이스 초기화**
   - 배포 완료 후 서버가 실행되면
   - Render.com의 서버 로그에서 서버 URL 확인
   - 또는 서버 대시보드에서 URL 확인 (예: `https://cozy-order-app-server.onrender.com`)

### 3단계: 데이터베이스 스키마 및 샘플 데이터 삽입

**방법 1: Render.com Shell 사용 (권장)**

1. **Render.com 대시보드에서 Shell 접속**
   - 데이터베이스 서비스의 "Shell" 탭 클릭
   - 또는 백엔드 서비스의 "Shell" 탭 클릭

2. **스키마 초기화**
   ```bash
   cd /opt/render/project/src/server
   psql $DATABASE_URL -f scripts/init-db.sql
   ```

3. **샘플 데이터 삽입**
   ```bash
   psql $DATABASE_URL -f scripts/seed-data.sql
   ```

**방법 2: 로컬에서 External Database URL 사용**

1. **로컬에서 데이터베이스 연결**
   ```bash
   # External Database URL 사용 (Render.com 데이터베이스의 Connections 탭에서 확인)
   psql <External Database URL>
   ```

2. **스키마 초기화**
   ```bash
   cd server
   psql <External Database URL> -f scripts/init-db.sql
   ```

3. **샘플 데이터 삽입**
   ```bash
   psql <External Database URL> -f scripts/seed-data.sql
   ```

### 4단계: 프런트엔드 배포

1. **Render.com에서 새 Static Site 생성**
   - "New +" 버튼 클릭
   - "Static Site" 선택
   - GitHub 저장소 연결

2. **프런트엔드 설정**
   - **Name**: `cozy-order-app-ui` (또는 원하는 이름)
   - **Branch**: `main` (또는 기본 브랜치)
   - **Root Directory**: `ui`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **환경 변수 설정**
   - "Environment" 섹션에서 환경 변수 추가:
     ```
     VITE_API_URL=https://z-order-app.onrender.com/api
     ```
     (백엔드 서버 URL로 변경 - 2단계에서 확인한 URL 사용)

5. **생성 및 배포**
   - "Create Static Site" 클릭
   - 배포 완료까지 대기

6. **백엔드 CORS 설정 업데이트**
   - 백엔드 서비스의 환경 변수에서 `FRONTEND_URL` 업데이트:
     ```
     FRONTEND_URL=https://z-order-app.onrender.com
     ```
     (프런트엔드 URL로 변경)

## 배포 후 확인 사항

### 백엔드 확인
- `https://z-order-app.onrender.com/api/health` 접속
- 정상 응답 확인

### 프런트엔드 확인
- `https://z-order-app.onrender.com` 접속
- 메뉴가 정상적으로 표시되는지 확인
- 주문 기능 테스트

## 중요 참고사항

1. **무료 플랜 제한**
   - Render.com 무료 플랜은 15분간 요청이 없으면 서버가 sleep 상태가 됩니다
   - 첫 요청 시 깨어나는데 시간이 걸릴 수 있습니다

2. **환경 변수 보안**
   - 데이터베이스 비밀번호 등 민감한 정보는 절대 Git에 커밋하지 마세요
   - Render.com의 환경 변수 설정에서만 관리하세요

3. **CORS 설정**
   - 백엔드 서버의 CORS 설정이 프런트엔드 도메인을 허용하는지 확인

4. **데이터베이스 연결**
   - Internal Database URL을 사용하면 더 빠르고 안정적입니다
   - External Database URL은 로컬 개발용입니다

## 문제 해결

### 서버가 시작되지 않는 경우
- 로그 확인: Render.com 대시보드의 "Logs" 탭
- 환경 변수 확인
- 데이터베이스 연결 확인

### CORS 오류
- 백엔드 서버의 CORS 설정 확인
- 프런트엔드 URL을 허용 목록에 추가

### 데이터베이스 연결 오류
- 환경 변수 확인
- Internal Database URL 사용 확인
- 방화벽 설정 확인
