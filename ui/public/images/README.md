# 이미지 파일 위치

이 폴더에 커피 메뉴 이미지를 넣으세요.

## 이미지 파일 이름 예시:
- `americano-ice.jpg` 또는 `americano-ice.png`
- `americano-hot.jpg` 또는 `americano-hot.png`
- `cafe-latte.jpg` 또는 `cafe-latte.png`

## 사용 방법:
1. 이미지 파일을 이 폴더(`public/images/`)에 넣으세요
2. 데이터베이스의 `menus` 테이블에서 `image_url` 필드에 경로를 저장하세요
   - 예: `/images/americano-ice.jpg`
3. 또는 코드에서 직접 이미지 경로를 매핑할 수 있습니다

## 참고:
- `public` 폴더의 파일은 루트 경로(`/`)로 접근 가능합니다
- 예: `public/images/coffee.jpg` → `http://localhost:5173/images/coffee.jpg`
