package com.aloha.board.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.board.domain.Boards;
import com.aloha.board.domain.Files;
import com.aloha.board.mapper.BoardMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

	private final BoardMapper boardMapper;
	private final FileService fileService;

	@Override
	public List<Boards> list() {
		return boardMapper.list();
	}

	@Override
	public Boards select(Long no) {
		return boardMapper.select(no);
	}

	@Override
	public Boards selectById(String id) {
		return boardMapper.selectById(id);
	}

	@Override
	public boolean insert(Boards entity) {

		// 게시글 등록
		int result = boardMapper.insert(entity);

		// 파일 업로드
		result += upload(entity);
		
		return result > 0;
	}

	/**
	 * 파일 업로드
	 * @param board
	 * @return
	 */
	public int upload(Boards board) {
		int result = 0;
		String pId = board.getId();

		List<Files> uploadFileList = new ArrayList<>();
		
		MultipartFile mainFile = board.getMainFile();
		if ( mainFile != null && !mainFile.isEmpty() ) {
			Files mainFileInfo = new Files();
			mainFileInfo.setPId(pId);
			mainFileInfo.setData(mainFile);
			mainFileInfo.setType("MAIN");
			uploadFileList.add(mainFileInfo);
		}

		List<MultipartFile> files = board.getFiles();
		if ( files != null && !files.isEmpty() ) {
			for (MultipartFile multipartFile : files) {
				if ( multipartFile.isEmpty() ) {
					continue;
				}
				
				Files fileInfo = new Files();
				fileInfo.setPId(pId);
				fileInfo.setData(multipartFile);
				fileInfo.setType("SUB");
				uploadFileList.add(fileInfo);
			}
		}

		try {
			result += fileService.upload(uploadFileList);	
		} catch (Exception e) {
			log.error("게시글 파일 업로드 중 에러 발생");
			e.printStackTrace();
		}

		return result;
	}

	@Override
	public boolean update(Boards entity) {

		// 파일 업로드 용 id 조회
		Boards oldBoard = boardMapper.select(entity.getNo());

		if ( oldBoard != null ) {
			entity.setId(oldBoard.getId());
		}
		
		// 게시글 수정
		int result = boardMapper.update(entity);

		// 파일 업로드
		result += upload(entity);
		return result > 0;
	}
	
	@Override
	public boolean updateById(Boards entity) {

		// 게시글 수정
		int result = boardMapper.updateById(entity);

		// 파일 업로드
		result += upload(entity);
		return result > 0;
	}

	@Override
	public boolean delete(Long no) {

		Boards board = boardMapper.select(no);

		// 게시글 삭제
		int result = boardMapper.delete(no);

		// 첨부파일 삭제
		Files file = new Files();
		file.setPId(board.getId());
		int deleteCount = fileService.deleteByParent(file);
		log.info(deleteCount + " 개의 파일이 삭제되었습니다.");
		return result > 0;
	}

	@Override
	public boolean deleteById(String id) {

		// 게시글 삭제
		int result = boardMapper.deleteById(id);

		// 첨부파일 삭제
		Files file = new Files();
		file.setPId(id);
		int deleteCount = fileService.deleteByParent(file);
		log.info(deleteCount + " 개의 파일이 삭제되었습니다.");
		return result > 0;
		
	}

	@Override
	public PageInfo<Boards> page(int page, int size) {
		PageHelper.startPage(page, size);
		List<Boards> list = boardMapper.list();
		PageInfo<Boards> pageInfo = new PageInfo<>(list);
		return pageInfo;
	}
	
}
