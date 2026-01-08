-- 데이터베이스 생성 스크립트
-- PostgreSQL 명령줄에서 실행하거나 psql로 실행하세요

-- 데이터베이스가 이미 존재하는지 확인하고 생성
SELECT 'CREATE DATABASE cozy_order_app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'cozy_order_app')\gexec
