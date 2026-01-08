-- 샘플 데이터 삽입 스크립트

-- 기존 데이터 삭제 (선택사항 - 주의: 모든 데이터가 삭제됩니다)
-- TRUNCATE TABLE order_item_options, order_items, orders, options, menus RESTART IDENTITY CASCADE;

-- 메뉴 데이터 삽입
INSERT INTO menus (name, description, price, image_url, stock_quantity) VALUES
('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노입니다.', 4000, '/images/americano-ice_2.jpg', 10),
('아메리카노(HOT)', '따뜻하고 진한 핫 아메리카노입니다.', 4000, '/images/americano-hot_1.jpg', 10),
('카페라떼', '부드러운 우유와 에스프레소의 조화입니다.', 5000, '/images/cafe-latte.jpg', 10),
('카푸치노', '우유 거품이 올라간 부드러운 카푸치노입니다.', 5000, NULL, 10),
('카라멜 마키아토', '달콤한 카라멜과 에스프레소의 만남입니다.', 6000, NULL, 10),
('바닐라 라떼', '바닐라 시럽이 들어간 부드러운 라떼입니다.', 5500, NULL, 10)
ON CONFLICT DO NOTHING;

-- 옵션 데이터 삽입 (모든 메뉴에 동일한 옵션 적용)
-- 메뉴 ID는 위에서 삽입된 순서대로 1, 2, 3, 4, 5, 6
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 1),
('시럽 추가', 0, 1),
('샷 추가', 500, 2),
('시럽 추가', 0, 2),
('샷 추가', 500, 3),
('시럽 추가', 0, 3),
('샷 추가', 500, 4),
('시럽 추가', 0, 4),
('샷 추가', 500, 5),
('시럽 추가', 0, 5),
('샷 추가', 500, 6),
('시럽 추가', 0, 6)
ON CONFLICT DO NOTHING;
