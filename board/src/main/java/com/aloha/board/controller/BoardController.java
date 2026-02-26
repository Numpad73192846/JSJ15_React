package com.aloha.board.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.board.domain.Boards;
import com.aloha.board.domain.Files;
import com.aloha.board.domain.Pagination;
import com.aloha.board.service.BoardService;
import com.aloha.board.service.FileService;
import com.github.pagehelper.PageInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
// @CrossOrigin(origins = "http://localhost:5173")	// CORS
@CrossOrigin("*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/boards")
public class BoardController {
	
	private final BoardService boardService;
	private final FileService fileService;

	// sp-crud
	// /boards?page=1&size=10
	@GetMapping()
	public ResponseEntity<?> getAll(
		@RequestParam(value = "page", required = false, defaultValue = "1") int page,
		@RequestParam(value = "size", required = false, defaultValue = "10") int size,
		Pagination pagination
	) {
		try {
			PageInfo<Boards> pageInfo = boardService.page(page, size);
			pagination.setPage(page);
			pagination.setSize(size);
			pagination.setTotal(pageInfo.getTotal());
			Map<String, Object> response = new HashMap<>();
			response.put("list", pageInfo.getList());
			response.put("pagination", pagination);
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getOne(@PathVariable("id") String id) {
		try {
			Boards board = boardService.selectById(id);
			return new ResponseEntity<>(board, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping()
	public ResponseEntity<?> create(@RequestBody Boards board) {
		try {
			boolean result = boardService.insert(board);
			if ( result ) {
				return new ResponseEntity<>("SUCCESS", HttpStatus.CREATED);
			}
			else {
				return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping()
	public ResponseEntity<?> update(@RequestBody Boards board) {
		try {
			boolean result = boardService.updateById(board);
			if ( result ) {
				return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
			}
			else {
				return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> destroy(@PathVariable("id") String id) {
		try {
			boolean result = boardService.deleteById(id);
			if ( result ) {
				return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
			}
			else {
				return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

		/**
	 * 게시글 첨부 파일 목록
	 * /boards/{id}/files
	 * @param param
	 * @return
	 */
	@GetMapping("{id}/files")
	public ResponseEntity<?> boardFileList(
		@PathVariable("id") String id,
		@RequestParam(value = "type", required = false) String type
	) {
		try {
			Files file = new Files();
			file.setPId(id);
			file.setType(type);

			// type이 없는 경우 : 부모 기준 게시글의 모든 첨부 파일 목록
			if ( type == null ) {
				List<Files> list = fileService.listByParent(file);
				return new ResponseEntity<>(list, HttpStatus.OK);
			}

			// type : MAIN -> 대표 이미지 1개, SUB, ? -> 일반 첨부 파일 여러 개
			if ( type.equals("MAIN") ) {
				Files mainFile = fileService.selectByType(file);
				return new ResponseEntity<>(mainFile, HttpStatus.OK);
			}
			else {
				List<Files> list = fileService.listByType(file);
				return new ResponseEntity<>(list, HttpStatus.OK);
			}

		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
