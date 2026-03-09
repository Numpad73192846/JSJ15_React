-- Active: 1767920846202@@127.0.0.1@3306@aloha
DROP TABLE IF EXISTS `user_auth`;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    no          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "PK",
    id          VARCHAR(100) NOT NULL COMMENT "UK",
    username    VARCHAR(100) NOT NULL COMMENT "아이디",
    password    VARCHAR(100) NOT NULL COMMENT "비밀번호",
    name        VARCHAR(100) NULL COMMENT "이름",
    email       VARCHAR(100) NULL COMMENT "이메일",
    created_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT "등록일자",
    updated_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT "수정일자",
    enabled     BOOLEAN NULL DEFAULT TRUE COMMENT "활성화여부"
) COMMENT '회원';

CREATE TABLE `user_auth` (
    no          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "PK",
    username    VARCHAR(100) NOT NULL COMMENT "아이디",
    auth        VARCHAR(100) NOT NULL COMMENT "권한"
) COMMENT "회원권한";

TRUNCATE `user_auth`

TRUNCATE `users`

-- 관리자 권한 계정
INSERT INTO `users` ( id, username, password, name, email )
VALUES ( UUID(), 'admin', '$2a$10$CNcBaLcB7YOpNNCL8pyipOgtbDGBjC02JKVuKiPWGNXXqwdfZy/Qu', '관리자', 'admin@naver.com' );

-- 권한
INSERT INTO `user_auth` ( username, auth )
VALUES ( 'admin', 'ROLE_USER' ),
       ( 'admin', 'ROLE_ADMIN' );