-- Active: 1767920846202@@127.0.0.1@3306@aloha
DROP TABLE IF EXISTS `boards`;

CREATE TABLE `boards` (
	`no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT 'PK',
  	`id` VARCHAR(64) NOT NULL COMMENT 'UK',
  	`title` varchar(100) NOT NULL,
  	`writer` varchar(100) NOT NULL,
  	`content` TEXT NULL,
  	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT '게시판';


INSERT INTO boards (id, title, writer, content)
SELECT 
  UUID(),
  CONCAT('게시판 샘플 데이터 ', t.num),
  CONCAT('작성자 ', t.num),
  CONCAT('내용 샘플 데이터 ', t.num)
FROM (
  SELECT @row := @row + 1 AS num
  FROM information_schema.tables, (SELECT @row := 0) r
  LIMIT 100
) t;

SELECT * FROM boards;