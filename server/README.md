# 커피 주문 앱 백엔드 서버

## 개요
Express.js를 사용한 RESTful API 서버입니다.

## 기술 스택
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL 클라이언트)

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 참고하여 `.env` 파일을 생성하고 데이터베이스 정보를 입력하세요.

```bash
cp .env.example .env
```

`.env` 파일 편집:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cozy_order_app
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

### 3. 서버 실행

**개발 모드** (파일 변경 시 자동 재시작):
```bash
npm run dev
```

**프로덕션 모드**:
```bash
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 기본 엔드포인트
- `GET /` - 서버 상태 확인
- `GET /api/health` - 헬스 체크

### 메뉴 관련 (추가 예정)
- `GET /api/menus` - 메뉴 목록 조회

### 주문 관련 (추가 예정)
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:orderId` - 주문 정보 조회
- `PATCH /api/orders/:orderId/status` - 주문 상태 변경

### 재고 관련 (추가 예정)
- `PATCH /api/menus/:menuId/stock` - 재고 수정

## 프로젝트 구조

```
server/
├── server.js          # 서버 진입점
├── package.json       # 프로젝트 설정 및 의존성
├── .env.example      # 환경 변수 예시 파일
├── .gitignore        # Git 무시 파일
├── README.md         # 프로젝트 설명서
└── (추후 추가 예정)
    ├── config/       # 설정 파일
    ├── routes/       # 라우트 정의
    ├── controllers/  # 컨트롤러
    ├── models/       # 데이터 모델
    └── middleware/   # 미들웨어
```

## 데이터베이스 설정

PostgreSQL 데이터베이스를 설정해야 합니다. PRD.md의 5.4 섹션을 참고하여 데이터베이스 스키마를 생성하세요.

## 개발 가이드

1. 환경 변수는 `.env` 파일에 저장하고, 절대 Git에 커밋하지 마세요.
2. 코드 스타일은 일관성을 유지하세요.
3. API 응답 형식은 PRD.md의 5.3 섹션을 참고하세요.

