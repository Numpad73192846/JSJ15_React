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