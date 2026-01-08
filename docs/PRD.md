# 커피 주문 앱 

## 1. 프로젝트 개요

### 1.1 프로젝트명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/ 삭제할 수 있는 기능

## 2. 기술 스택
- 프런트엔드: HTML, CSS, 리액트, 자바스크립트
- 백엔드: Node.js, Express
- 데이터베이스: PostgreSQL

## 3. 기본 사항
- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음

## 4. 화면별 상세 요구사항

### 4.1 주문하기 화면

#### 4.1.1 화면 구성

**헤더 영역**
- 좌측: "COZY" 브랜드 로고/텍스트
- 우측: "주문하기" 버튼, "관리자" 버튼
  - "주문하기" 버튼: 현재 화면이므로 비활성화 또는 하이라이트 표시
  - "관리자" 버튼: 클릭 시 관리자 화면으로 이동

**메뉴 영역**
- 메뉴 아이템 카드 그리드 레이아웃
- 각 메뉴 카드 구성 요소:
  - 메뉴 이미지 (플레이스홀더)
  - 메뉴명 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
  - 가격 (예: "4,000원", "5,000원")
  - 간단한 설명 텍스트
  - 옵션 체크박스:
    - "샷 추가 (+500원)" - 선택 시 가격에 500원 추가
    - "시럽 추가 (+0원)" - 선택 시 가격 변동 없음
  - "담기" 버튼

**장바구니 영역**
- 제목: "장바구니"
- 장바구니 아이템 리스트:
  - 각 아이템 표시 형식: "메뉴명 (옵션) X 수량" - "가격"
  - 예: "아메리카노(ICE) (샷 추가) X 1" - "4,500원"
  - 예: "아메리카노(HOT) X 2" - "8,000원"
- 총 금액 표시: "총 금액 XX,XXX원"
- "주문하기" 버튼

#### 4.1.2 기능 요구사항

**메뉴 표시**
- 데이터베이스에서 커피 메뉴 목록을 조회하여 화면에 표시
- 각 메뉴의 이름, 가격, 설명, 이미지 정보 표시
- 메뉴는 그리드 형태로 배치 (반응형 레이아웃 고려)

**옵션 선택**
- 각 메뉴 카드에서 옵션을 체크박스로 선택 가능
- 옵션 선택 시 해당 메뉴의 최종 가격이 실시간으로 계산되어 표시
- 옵션별 추가 가격이 명확히 표시됨 (예: "+500원", "+0원")

**장바구니 기능**
- "담기" 버튼 클릭 시:
  - 선택한 옵션과 함께 해당 메뉴를 장바구니에 추가
  - 동일한 메뉴와 옵션 조합이 이미 장바구니에 있으면 수량 증가
  - 장바구니에 추가된 메뉴는 장바구니 영역에 표시
- 장바구니 아이템 수량 조절 기능 (증가/감소)
- 장바구니 아이템 삭제 기능
- 장바구니 총 금액 자동 계산 및 표시

**주문 처리**
- 장바구니에 아이템이 있을 때만 "주문하기" 버튼 활성화
- "주문하기" 버튼 클릭 시:
  - 장바구니의 모든 아이템을 주문으로 전송
  - 주문 성공 시 장바구니 초기화
  - 주문 완료 메시지 표시 (선택사항)

#### 4.1.3 UI/UX 요구사항

**레이아웃**
- 반응형 디자인: 모바일, 태블릿, 데스크톱에서 모두 사용 가능
- 메뉴 영역과 장바구니 영역이 명확히 구분됨
- 스크롤 가능한 메뉴 영역 (메뉴가 많을 경우)

**상호작용**
- 버튼 클릭 시 시각적 피드백 제공 (호버 효과, 클릭 효과)
- 옵션 선택 시 즉각적인 가격 업데이트
- 장바구니 업데이트 시 부드러운 애니메이션 효과 (선택사항)

**데이터 표시**
- 가격은 천 단위 구분 기호 사용 (예: 4,000원)
- 옵션이 선택된 메뉴는 장바구니에 옵션 정보와 함께 표시
- 빈 장바구니 상태일 때 안내 메시지 표시 (선택사항)

#### 4.1.4 데이터 구조

**메뉴 데이터**
- 메뉴 ID
- 메뉴명
- 가격
- 설명
- 이미지 URL
- 옵션 정보 (옵션명, 추가 가격)

**장바구니 데이터**
- 메뉴 ID
- 메뉴명
- 기본 가격
- 선택된 옵션 목록
- 수량
- 총 가격 (기본 가격 + 옵션 가격) × 수량

**주문 데이터**
- 주문 ID (서버에서 생성)
- 주문 일시
- 주문 아이템 목록 (메뉴 정보, 옵션, 수량, 가격)
- 총 주문 금액
- 주문 상태 (대기, 준비중, 완료 등)

### 4.2 관리자 화면

#### 4.2.1 화면 구성

**헤더 영역**
- 좌측: "COZY" 브랜드 로고/텍스트
- 우측: "주문하기" 버튼, "관리자" 버튼
  - "주문하기" 버튼: 클릭 시 주문하기 화면으로 이동
  - "관리자" 버튼: 현재 화면이므로 비활성화 또는 하이라이트 표시

**관리자 대시보드 요약 영역**
- 제목: "관리자 대시보드"
- 주문 통계 요약 표시:
  - 형식: "총 주문 X / 주문 접수 X / 제조 중 X / 제조 완료 X"
  - 각 통계는 실시간으로 업데이트됨
  - 예: "총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0"

**재고 현황 영역**
- 제목: "재고 현황"
- 각 메뉴별 재고 카드 표시:
  - 메뉴명 (예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼")
  - 현재 재고 수량 (예: "10개")
  - 재고 조정 버튼:
    - "+" 버튼: 재고 증가
    - "-" 버튼: 재고 감소
- 메뉴는 카드 형태로 그리드 레이아웃 배치

**주문 현황 영역**
- 제목: "주문 현황"
- 주문 목록 표시:
  - 각 주문 항목 형식: "월 일 시:분 메뉴명 x 수량 가격원"
  - 예: "7월 31일 13:00 아메리카노(ICE) x 1 4,000원"
  - 주문이 많을 경우 스크롤 가능한 리스트 형태
- 각 주문 항목 옆에 "주문 접수" 버튼 표시
- 주문이 없을 경우 안내 메시지 표시

#### 4.2.2 기능 요구사항

**대시보드 통계**
- 실시간 주문 통계 조회 및 표시:
  - 총 주문 수: 모든 주문의 총 개수
  - 주문 접수 수: "주문 접수" 상태인 주문 개수
  - 제조 중 수: "제조 중" 상태인 주문 개수
  - 제조 완료 수: "제조 완료" 상태인 주문 개수
- 주문 상태 변경 시 통계 자동 업데이트
- 주기적으로 통계 데이터 갱신 (선택사항: 실시간 업데이트)

**재고 관리**
- 각 메뉴의 현재 재고 수량 조회 및 표시
- "+" 버튼 클릭 시:
  - 해당 메뉴의 재고 수량 1 증가
  - 데이터베이스에 재고 수량 업데이트
  - 화면에 즉시 반영
- "-" 버튼 클릭 시:
  - 해당 메뉴의 재고 수량 1 감소
  - 재고가 0 미만으로 내려가지 않도록 검증
  - 데이터베이스에 재고 수량 업데이트
  - 화면에 즉시 반영
- 재고 수량 변경 시 시각적 피드백 제공

**주문 현황 조회**
- 데이터베이스에서 주문 목록을 조회하여 표시
- 주문 목록은 최신 주문 순으로 정렬 (최신 주문이 상단에 표시)
- 각 주문의 상세 정보 표시:
  - 주문 일시 (월, 일, 시, 분)
  - 주문한 메뉴명
  - 수량
  - 가격
- 주문이 많을 경우 페이지네이션 또는 무한 스크롤 구현 (선택사항)

**주문 상태 관리**
- "주문 접수" 버튼 클릭 시:
  - 해당 주문의 상태를 "주문 접수"로 변경
  - 주문 상태 변경 시 대시보드 통계 자동 업데이트
  - 주문 접수된 주문은 "제조 중" 상태로 변경 가능 (추가 기능, 선택사항)
  - 주문 완료 처리 기능 (추가 기능, 선택사항)

#### 4.2.3 UI/UX 요구사항

**레이아웃**
- 반응형 디자인: 모바일, 태블릿, 데스크톱에서 모두 사용 가능
- 대시보드 요약, 재고 현황, 주문 현황 영역이 명확히 구분됨
- 각 영역은 독립적으로 스크롤 가능 (선택사항)

**상호작용**
- 버튼 클릭 시 시각적 피드백 제공 (호버 효과, 클릭 효과)
- 재고 수량 변경 시 즉각적인 화면 업데이트
- 주문 접수 버튼 클릭 시 주문 상태 변경 확인 (선택사항: 확인 다이얼로그)
- 주문 상태 변경 시 부드러운 애니메이션 효과 (선택사항)

**데이터 표시**
- 재고 수량은 "XX개" 형식으로 표시
- 주문 일시는 "월 일 시:분" 형식으로 표시
- 가격은 천 단위 구분 기호 사용 (예: 4,000원)
- 주문이 없을 경우 "주문이 없습니다" 등의 안내 메시지 표시
- 재고가 부족할 경우 경고 표시 (선택사항: 예: 재고 5개 이하 시 빨간색 표시)

#### 4.2.4 데이터 구조

**재고 데이터**
- 메뉴 ID
- 메뉴명
- 현재 재고 수량

**주문 통계 데이터**
- 총 주문 수
- 주문 접수 수
- 제조 중 수
- 제조 완료 수

**주문 현황 데이터**
- 주문 ID
- 주문 일시 (날짜, 시간)
- 주문 아이템 목록:
  - 메뉴명
  - 수량
  - 가격
- 총 주문 금액
- 주문 상태 (대기, 주문 접수, 제조 중, 제조 완료)

#### 4.2.5 추가 고려사항

**주문 상태 흐름**
- 기본 흐름: 대기 → 주문 접수 → (제조 중) → 제조 완료
- 주문 접수 후 제조 중, 제조 완료 상태로 변경하는 기능은 향후 확장 가능

**재고 관리**
- 주문 시 재고 자동 차감 기능 (선택사항)
- 재고 부족 시 주문 불가 처리 (선택사항)

## 5. 백엔드 개발 요구사항

### 5.1 데이터 모델

#### 5.1.1 Menus (메뉴)
메뉴 정보를 저장하는 테이블

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 메뉴 고유 ID
- `name` (VARCHAR): 커피 이름 (예: "아메리카노(ICE)")
- `description` (TEXT): 메뉴 설명
- `price` (INTEGER): 기본 가격 (원 단위)
- `image_url` (VARCHAR): 메뉴 이미지 URL
- `stock_quantity` (INTEGER): 재고 수량 (기본값: 0)
- `created_at` (TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP): 수정 일시

#### 5.1.2 Options (옵션)
메뉴 옵션 정보를 저장하는 테이블

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 옵션 고유 ID
- `name` (VARCHAR): 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price` (INTEGER): 옵션 추가 가격 (원 단위, 기본값: 0)
- `menu_id` (INTEGER, FOREIGN KEY): 연결된 메뉴 ID (Menus 테이블 참조)
- `created_at` (TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP): 수정 일시

#### 5.1.3 Orders (주문)
주문 정보를 저장하는 테이블

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 주문 고유 ID
- `order_date` (TIMESTAMP): 주문 일시
- `status` (VARCHAR): 주문 상태 ("주문 접수", "제조 중", "제조 완료")
- `total_amount` (INTEGER): 총 주문 금액 (원 단위)
- `created_at` (TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP): 수정 일시

#### 5.1.4 OrderItems (주문 아이템)
주문에 포함된 메뉴와 옵션 정보를 저장하는 테이블

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 주문 아이템 고유 ID
- `order_id` (INTEGER, FOREIGN KEY): 주문 ID (Orders 테이블 참조)
- `menu_id` (INTEGER, FOREIGN KEY): 메뉴 ID (Menus 테이블 참조)
- `quantity` (INTEGER): 주문 수량
- `unit_price` (INTEGER): 단가 (메뉴 가격 + 옵션 가격)
- `total_price` (INTEGER): 아이템 총 가격 (단가 × 수량)
- `created_at` (TIMESTAMP): 생성 일시

#### 5.1.5 OrderItemOptions (주문 아이템 옵션)
주문 아이템에 선택된 옵션 정보를 저장하는 테이블

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 고유 ID
- `order_item_id` (INTEGER, FOREIGN KEY): 주문 아이템 ID (OrderItems 테이블 참조)
- `option_id` (INTEGER, FOREIGN KEY): 옵션 ID (Options 테이블 참조)
- `created_at` (TIMESTAMP): 생성 일시

### 5.2 데이터 스키마를 위한 사용자 흐름

#### 5.2.1 메뉴 조회 및 표시
1. **프런트엔드 요청**: 주문하기 화면 진입 시 메뉴 목록 조회
2. **백엔드 처리**: 
   - Menus 테이블에서 모든 메뉴 정보 조회
   - 각 메뉴에 연결된 Options 정보 조회
   - 재고 수량(stock_quantity)은 관리자 화면에서만 사용
3. **응답 데이터**: 
   - 메뉴 ID, 이름, 설명, 가격, 이미지 URL
   - 각 메뉴별 옵션 목록 (옵션 ID, 이름, 추가 가격)
4. **프런트엔드 표시**: 
   - 주문하기 화면: 메뉴 정보 표시 (재고 수량 제외)
   - 관리자 화면: 메뉴 정보 + 재고 수량 표시

#### 5.2.2 장바구니 관리
1. **프런트엔드 처리**: 
   - 사용자가 메뉴 선택 및 옵션 선택
   - 선택 정보를 클라이언트 측 장바구니에 저장 (로컬 상태 관리)
   - 장바구니 화면에 선택된 메뉴, 옵션, 수량, 가격 표시
2. **데이터베이스 연동 없음**: 장바구니는 프런트엔드에서만 관리

#### 5.2.3 주문 생성
1. **프런트엔드 요청**: 사용자가 "주문하기" 버튼 클릭
2. **요청 데이터**:
   ```json
   {
     "items": [
       {
         "menu_id": 1,
         "quantity": 2,
         "option_ids": [1, 2],
         "unit_price": 4500,
         "total_price": 9000
       }
     ],
     "total_amount": 9000
   }
   ```
3. **백엔드 처리**:
   - Orders 테이블에 주문 정보 저장 (order_date: 현재 시간, status: "주문 접수")
   - OrderItems 테이블에 주문 아이템 정보 저장
   - OrderItemOptions 테이블에 선택된 옵션 정보 저장
   - Menus 테이블의 재고 수량 차감 (stock_quantity 감소)
   - 트랜잭션 처리: 모든 작업이 성공해야 주문 완료
4. **응답 데이터**: 생성된 주문 ID 및 주문 정보
5. **프런트엔드 처리**: 장바구니 초기화 및 주문 완료 메시지 표시

#### 5.2.4 주문 현황 조회
1. **프런트엔드 요청**: 관리자 화면 진입 시 주문 목록 조회
2. **백엔드 처리**: 
   - Orders 테이블에서 모든 주문 조회 (최신 순 정렬)
   - 각 주문의 OrderItems 정보 조회
   - 각 OrderItem의 OrderItemOptions 정보 조회
3. **응답 데이터**: 
   - 주문 ID, 주문 일시, 상태, 총 금액
   - 주문 아이템 목록 (메뉴명, 수량, 옵션, 가격)
4. **프런트엔드 표시**: 관리자 화면의 "주문 현황" 영역에 표시

#### 5.2.5 주문 상태 변경
1. **프런트엔드 요청**: 관리자가 "제조 시작" 또는 "제조 완료" 버튼 클릭
2. **요청 데이터**: 
   ```json
   {
     "order_id": 1,
     "status": "제조 중" // 또는 "제조 완료"
   }
   ```
3. **백엔드 처리**: 
   - Orders 테이블에서 해당 주문 조회
   - 주문 상태 업데이트 (status 필드 수정)
   - 상태 변경 이력 기록 (선택사항)
4. **응답 데이터**: 업데이트된 주문 정보
5. **프런트엔드 처리**: 주문 현황 화면 갱신

### 5.3 API 설계

#### 5.3.1 메뉴 목록 조회
**엔드포인트**: `GET /api/menus`

**설명**: 데이터베이스에서 커피 메뉴 목록을 불러와서 반환

**요청**: 
- 파라미터 없음

**응답**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "시원하고 깔끔한 아이스 아메리카노입니다.",
      "price": 4000,
      "image_url": "/images/americano-ice.jpg",
      "stock_quantity": 10,
      "options": [
        {
          "id": 1,
          "name": "샷 추가",
          "price": 500
        },
        {
          "id": 2,
          "name": "시럽 추가",
          "price": 0
        }
      ]
    }
  ]
}
```

**에러 응답**:
```json
{
  "success": false,
  "error": "메뉴 조회 중 오류가 발생했습니다."
}
```

#### 5.3.2 주문 생성
**엔드포인트**: `POST /api/orders`

**설명**: 주문 정보를 데이터베이스에 저장하고, 주문된 메뉴의 재고를 수정

**요청 본문**:
```json
{
  "items": [
    {
      "menu_id": 1,
      "quantity": 2,
      "option_ids": [1],
      "unit_price": 4500,
      "total_price": 9000
    },
    {
      "menu_id": 2,
      "quantity": 1,
      "option_ids": [],
      "unit_price": 4000,
      "total_price": 4000
    }
  ],
  "total_amount": 13000
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "order_date": "2024-01-15T10:30:00Z",
    "status": "주문 접수",
    "total_amount": 13000
  }
}
```

**에러 응답**:
```json
{
  "success": false,
  "error": "재고가 부족합니다."
}
```

**비즈니스 로직**:
1. 주문 아이템의 메뉴별 재고 확인
2. 재고가 부족한 경우 에러 반환
3. 트랜잭션 시작
4. Orders 테이블에 주문 정보 저장
5. OrderItems 테이블에 주문 아이템 저장
6. OrderItemOptions 테이블에 옵션 정보 저장
7. Menus 테이블의 재고 수량 차감
8. 트랜잭션 커밋

#### 5.3.3 주문 정보 조회
**엔드포인트**: `GET /api/orders/:orderId`

**설명**: 주문 ID를 전달하면 해당 주문 정보를 반환

**요청**: 
- URL 파라미터: `orderId` (주문 ID)

**응답**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_date": "2024-01-15T10:30:00Z",
    "status": "주문 접수",
    "total_amount": 13000,
    "items": [
      {
        "id": 1,
        "menu_id": 1,
        "menu_name": "아메리카노(ICE)",
        "quantity": 2,
        "unit_price": 4500,
        "total_price": 9000,
        "options": [
          {
            "id": 1,
            "name": "샷 추가",
            "price": 500
          }
        ]
      },
      {
        "id": 2,
        "menu_id": 2,
        "menu_name": "아메리카노(HOT)",
        "quantity": 1,
        "unit_price": 4000,
        "total_price": 4000,
        "options": []
      }
    ]
  }
}
```

**에러 응답**:
```json
{
  "success": false,
  "error": "주문을 찾을 수 없습니다."
}
```

#### 5.3.4 주문 목록 조회
**엔드포인트**: `GET /api/orders`

**설명**: 모든 주문 목록을 조회 (관리자 화면용)

**요청**: 
- 쿼리 파라미터 (선택사항):
  - `status`: 주문 상태 필터 ("주문 접수", "제조 중", "제조 완료")
  - `limit`: 페이지당 항목 수 (기본값: 50)
  - `offset`: 페이지 오프셋 (기본값: 0)

**응답**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_date": "2024-01-15T10:30:00Z",
      "status": "주문 접수",
      "total_amount": 13000,
      "items": [
        {
          "menu_name": "아메리카노(ICE)",
          "quantity": 2,
          "options": ["샷 추가"],
          "total_price": 9000
        }
      ]
    }
  ],
  "total": 10
}
```

#### 5.3.5 주문 상태 변경
**엔드포인트**: `PATCH /api/orders/:orderId/status`

**설명**: 주문의 상태를 변경

**요청 본문**:
```json
{
  "status": "제조 중" // 또는 "제조 완료"
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "제조 중",
    "updated_at": "2024-01-15T10:35:00Z"
  }
}
```

#### 5.3.6 재고 수정
**엔드포인트**: `PATCH /api/menus/:menuId/stock`

**설명**: 메뉴의 재고 수량을 수정 (관리자 화면용)

**요청 본문**:
```json
{
  "quantity": 15
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "아메리카노(ICE)",
    "stock_quantity": 15
  }
}
```

### 5.4 데이터베이스 스키마 예시

```sql
-- Menus 테이블
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url VARCHAR(255),
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER DEFAULT 0,
  menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders 테이블
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT '주문 접수',
  total_amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderItems 테이블
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_id INTEGER REFERENCES menus(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderItemOptions 테이블
CREATE TABLE order_item_options (
  id SERIAL PRIMARY KEY,
  order_item_id INTEGER REFERENCES order_items(id) ON DELETE CASCADE,
  option_id INTEGER REFERENCES options(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);
```

### 5.5 에러 처리

**공통 에러 응답 형식**:
```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE"
}
```

**주요 에러 코드**:
- `MENU_NOT_FOUND`: 메뉴를 찾을 수 없음
- `ORDER_NOT_FOUND`: 주문을 찾을 수 없음
- `INSUFFICIENT_STOCK`: 재고 부족
- `INVALID_REQUEST`: 잘못된 요청 데이터
- `DATABASE_ERROR`: 데이터베이스 오류
- `INTERNAL_ERROR`: 서버 내부 오류

### 5.6 추가 고려사항

#### 5.6.1 트랜잭션 처리
- 주문 생성 시 Orders, OrderItems, OrderItemOptions 저장 및 재고 차감은 하나의 트랜잭션으로 처리
- 트랜잭션 실패 시 모든 작업 롤백

#### 5.6.2 데이터 검증
- 주문 생성 시 필수 필드 검증
- 재고 수량 검증 (0 이상)
- 주문 수량 검증 (1 이상)
- 가격 계산 검증 (단가 × 수량 = 총 가격)

#### 5.6.3 성능 최적화
- 메뉴 목록 조회 시 옵션 정보를 JOIN으로 한 번에 조회
- 주문 목록 조회 시 페이지네이션 적용
- 자주 조회되는 데이터에 대한 인덱스 생성

#### 5.6.4 보안
- SQL Injection 방지 (Prepared Statement 사용)
- 입력 데이터 검증 및 Sanitization
- CORS 설정 (프런트엔드 도메인만 허용)

