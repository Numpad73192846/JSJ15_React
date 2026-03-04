DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  	`no` BIGINT NOT NULL AUTO_INCREMENT,             -- 파일 번호 (자동증가)
  	`id` VARCHAR(64) NOT NULL,                    -- UK 
  	`p_id` varchar(64) NOT NULL,				  -- 부모 ID (예: UID)
  	`file_name` text NOT NULL,                    -- 저장된 파일명
  	`origin_name` text,                           -- 원본 파일명
  	`file_path` text NOT NULL,                    -- 파일 경로
  	`file_size` BIGINT NOT NULL DEFAULT '0',         -- 파일 크기 (기본값 0)
  	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 등록일시
  	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 수정일시
  	`type` ENUM('MAIN', 'SUB') NOT NULL DEFAULT 'SUB',        -- 타입
  	`seq` BIGINT NULL DEFAULT 0,                  -- 순서
  	PRIMARY KEY (`no`)                            -- PK 설정
) COMMENT='파일';

-- 샘플 데이터
-- no:100 번 글의 첨부파일
-- 메인파일
INSERT INTO `files` (`id`, `p_id`, `file_name`, `origin_name`, `file_path`, `file_size`, `type`) VALUES
(UUID(), (SELECT id FROM boards WHERE no = 100), 'TEST_100_썸네일.jpg', '썸네일.jpg', 'C:/upload/TEST_100_썸네일.PNG', 204800, 'MAIN');

-- 첨부파일 4개
INSERT INTO `files` ( id, p_id, file_name, origin_name, file_path, file_size, type )
VALUES 
  (UUID(), (SELECT id FROM boards WHERE no = 100), 'TEST_100_파일1.png','파일1.png','C:/upload/TEST_100_파일1.png',200*1000,'SUB'),
  (UUID(), (SELECT id FROM boards WHERE no = 100), 'TEST_100_파일2.png','파일2.png','C:/upload/TEST_100_파일2.png',200*1000,'SUB'),
  (UUID(), (SELECT id FROM boards WHERE no = 100), 'TEST_100_파일3.png','파일3.png','C:/upload/TEST_100_파일3.png',200*1000,'SUB'),
  (UUID(), (SELECT id FROM boards WHERE no = 100), 'TEST_100_파일4.png','파일4.png','C:/upload/TEST_100_파일4.png',200*1000,'SUB')
;