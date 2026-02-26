package com.aloha.board.domain;

import java.util.Date;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class Files {
	
	private Long no;
	private String id;
	private String pId;
	private String fileName;
	private String originName;
	private String filePath;
	private Long fileSize;
	private Long seq;
	private String type;
	private Date createdAt;
	private Date updatedAt;

	// 파일 데이터
	@JsonIgnore
	MultipartFile data;

	public Files() {
		this.id = UUID.randomUUID().toString();
	}

}
