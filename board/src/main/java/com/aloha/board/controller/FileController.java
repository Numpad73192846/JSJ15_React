package com.aloha.board.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.board.domain.Files;
import com.aloha.board.service.FileService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {
	
	private final FileService fileService;

	// sp-crud
	
	@GetMapping()
	public ResponseEntity<?> getAll() {
		try {
			List<Files> list = fileService.list();
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getOne(@PathVariable String id) {
		try {
			Files file = fileService.selectById(id);
			return new ResponseEntity<>(file, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> createForm(Files file) {
		try {
			boolean result = fileService.upload(file);
			
			if ( result ) {
				return new ResponseEntity<>(file, HttpStatus.CREATED);
			}
			else {
				return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> createJson(@RequestBody Files file) {
		try {
			boolean result = fileService.upload(file);
			
			if ( result ) {
				return new ResponseEntity<>(file, HttpStatus.CREATED);
			}
			else {
				return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping()
	public ResponseEntity<?> update(@RequestBody Files file) {
		try {
			boolean result = fileService.updateById(file);

			if ( result ) {
				return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
			}
			else {
				return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> destroy(@PathVariable("id") String id) {
		try {
			boolean result = fileService.deleteById(id);

			if ( result ) {
				return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
			}
			else {
				return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 파일 선택 삭제
	@DeleteMapping("")
	public ResponseEntity<?> deleteFiles(
		@RequestParam(value = "noList", required = false) List<Long> noList,
		@RequestParam(value = "idList", required = false) List<String> idList
	) {
		log.info("noList[] : " + noList);
		log.info("idList[] : " + idList);

		int result = 0;

		if ( noList != null ) {
			result = fileService.deleteFileList(noList);
		}
		if ( idList != null ) {
			result = fileService.deleteFileListById(idList);
		}
		if ( result > 0 ) {
			return new ResponseEntity<>(HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	}

	// 파일 다운로드
	@GetMapping("/download/{id}")
	public void filDownload(
		@PathVariable("id") String id,
		HttpServletResponse response
	) throws Exception {
		fileService.download(id, response);
	}

	// 썸네일 이미지
	@GetMapping("/img/{id}")
	public void thumbnailImg(
		@PathVariable("id") String id,
		HttpServletResponse response
	) throws Exception {
		boolean result = fileService.thumbnail(id, response);

		if ( result ) {
			log.info("썸네일 이미지가 성공적으로 전송되었습니다.");
		}
	}
	
}
