package com.aloha.board.service;

import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.board.domain.Files;
import com.aloha.board.mapper.FileMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

	private final FileMapper fileMapper;
	private final ResourceLoader resourceLoader;

	@Value("${upload.path}")
	private String uploadPath;

	@Override
	public List<Files> list() {
		return fileMapper.list();
	}

	@Override
	public PageInfo<Files> page(int page, int size) {
		PageHelper.startPage(page, size);
		List<Files> list = fileMapper.list();
		PageInfo<Files> pageInfo = new PageInfo<> (list);
		return pageInfo;
	}

	@Override
	public Files select(Long no) {
		return fileMapper.select(no);
	}

	@Override
	public Files selectById(String id) {
		return fileMapper.selectById(id);
	}

	@Override
	public boolean insert(Files boards) {
		int result = fileMapper.insert(boards);
		return result > 0;
	}

	@Override
	public boolean update(Files boards) {
		int result = fileMapper.update(boards);
		return result > 0;
	}

	@Override
	public boolean updateById(Files boards) {
		int result = fileMapper.updateById(boards);
		return result > 0;
	}

	// 파일 시스템의 파일 삭제
	public boolean delete(Files file) {
		if ( file == null) {
			log.info( "파일이 없습니다.");
			return false;
		}

		String filePath = file.getFilePath();
		File deleteFile = new File(filePath);

		if ( !deleteFile.exists() ) {
			log.error("파일이 존재하지 않습니다.");
			return false;
		}

		// 파일 삭제
		boolean deleted = deleteFile.delete();
		if ( deleted ) {
			log.info("파일이 삭제되었습니다.");
			log.info("- " + filePath);
		}
		return true;
	}

	@Override
	public boolean delete(Long no) {
		Files file = fileMapper.select(no);		// 파일 정보 조회
		delete(file);							// 1️⃣ 파일 시스템에서 파일 삭제
		int result = fileMapper.delete(no);		// 2️⃣ DB에서 파일 정보 삭제
		return result > 0;
	}

	@Override
	public boolean deleteById(String id) {
		Files file = fileMapper.selectById(id);	// 파일 정보 조회
		delete(file);							// 1️⃣ 파일 시스템에서 파일 삭제
		int result = fileMapper.deleteById(id);	// 2️⃣ DB에서 파일 정보 삭제
		return result > 0;
	}

	@Override
	public boolean upload(Files file) throws Exception {
		boolean result = false;
		MultipartFile multipartFile = file.getData();
		
		// 파일이 없을 때
		if ( multipartFile == null || multipartFile.isEmpty() ) {
			return false;
		}

		// 1️⃣ 파일 시스템에 파일 저장
		String originName = multipartFile.getOriginalFilename();
		long fileSize = multipartFile.getSize();
		byte[] fileData = multipartFile.getBytes();
		String fileName = UUID.randomUUID().toString() + "_" + originName;
		String filePath = uploadPath = "/" + fileName;
		File uploadFile = new File(filePath);
		FileCopyUtils.copy(fileData, uploadFile);

		// 2️⃣ DB에 파일 정보 저장
		file.setOriginName(originName);
		file.setFileName(fileName);
		file.setFilePath(filePath);
		file.setFileSize(fileSize);
		result = fileMapper.insert(file) > 0;
		return result;
	}

	@Override
	public int upload(List<Files> fileList) throws Exception {
		int result = 0;
		if ( fileList == null || fileList.isEmpty() ) {
			return result;
		}

		for (Files file : fileList) {
			result += ( upload(file) ? 1 : 0 );
		}

		return result;
	}

	@Override
	public boolean download(String id, HttpServletResponse response) throws Exception {
		Files file = fileMapper.selectById(id);

		// 파일이 없으면
		if ( file ==  null ) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return false;
		}

		// 파일 입력
		String fileName = file.getFileName();
		String filePath = file.getFilePath();
		File downloadFile = new File(filePath);
		FileInputStream fis = new FileInputStream(downloadFile);
		
		// 파일 출력
		ServletOutputStream sos = response.getOutputStream();

		// 파일 다운로드를 위한 응답 헤더 세팅
		// - Content-Type 			: application/octet-stream (모든 파일 타입)
		// - Content-Disposition 	: attachment; filename="파일명.확장자" (다운로드 파일명 지정)
		fileName = URLEncoder.encode(fileName, "UTF-8");
		response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
		response.setHeader(
			"Content-Disposition",
			"attachment; filename=\"" + fileName + "\""
		);

		// 다운로드
		boolean result = FileCopyUtils.copy(fis, sos) > 0;
		fis.close();
		sos.close();
		return result;

	}

	@Override
	public List<Files> listByParent(Files file) {
		return fileMapper.listByParent(file);
	}

	@Override
	public int deleteByParent(Files file) {
		List<Files> fileList = fileMapper.listByParent(file);

		// 파일 삭제
		for (Files deleteFile : fileList) {
			delete(deleteFile);
		}

		// DB에서 파일 정보 삭제
		return fileMapper.deleteByParent(file);
	}

	// noList : "1, 2, 3"
	@Override
	public int deleteFiles(String noList) {
		if ( noList == null || noList.isEmpty() ) {
			return 0;
		}

		int count = 0;
		String[] nos = noList.split(",");

		for (String noStr : nos) {
			Long no = Long.parseLong(noStr);
			count += ( delete(no) ? 1 : 0 );
		}

		log.info("파일 " + count + "개를 삭제 하였습니다.");
		return count;
	}
	
	@Override
	public int deleteFilesById(String idList) {
		if ( idList == null || idList.isEmpty() ) {
			return 0;
		}
	
		int count = 0;
		String[] ids = idList.split(",");

		for (String id : ids) {
			count += ( deleteById(id) ? 1 : 0 );
		}

		log.info("파일 " + count + "개를 삭제 하였습니다.");
		return count;
	}

	@Override
	public int deleteFileList(List<Long> noList) {
		if ( noList == null || noList.isEmpty() ) {
			return 0;
		}

		for (Long no : noList) {
			Files file = select(no.longValue());
			delete(file);
		}
		
		int count = fileMapper.deleteFileList(noList);
		log.info("파일 " + count + "개를 삭제 하였습니다.");
		return count;
	}

	@Override
	public int deleteFileListById(List<String> idList) {
				if ( idList == null || idList.isEmpty() ) {
			return 0;
		}

		for (String id : idList) {
			Files file = selectById(id);
			delete(file);
		}
		
		int count = fileMapper.deleteFileListById(idList);
		log.info("파일 " + count + "개를 삭제 하였습니다.");
		return count;
	}

	@Override
	public Files selectByType(Files file) {
		return fileMapper.selectByType(file);
	}

	@Override
	public List<Files> listByType(Files file) {
		return fileMapper.listByType(file);
	}

	@Override
	public boolean thumbnail(String id, HttpServletResponse response) throws Exception {
		Files file = fileMapper.selectById(id);
		String filePath = file != null ? file.getFilePath() : null;

		File imgFile;

		// 파일 경로가 null이거나 파일이 존재하지 않으면 기본 이미지 사용
		Resource resource = resourceLoader.getResource("classpath:static/img/no-image.png");
		if ( filePath == null || !(imgFile = new File(filePath)).exists() ) {

			// 기본 이미지 사용
			imgFile = resource.getFile();
			filePath = imgFile.getPath();
		}

		// 확장자
		String ext = filePath.substring(filePath.lastIndexOf(".") + 1 );
		String mimeType = MimeTypeUtils.parseMimeType("image/" + ext ).toString();
		MediaType mType = MediaType.valueOf(mimeType);

		if ( mType == null ) {
			// 이미지 타입이 아닌 경우
			response.setContentType(MediaType.IMAGE_PNG_VALUE);
			imgFile = resource.getFile();
		}
		else {
			// 이미지 타입
			response.setContentType(mType.toString());
		}

		
		FileInputStream fis = new FileInputStream(imgFile);		// 파일 입력
		ServletOutputStream sos = response.getOutputStream();	// 파일 출력
		int result = FileCopyUtils.copy(fis, sos);				// 파일 전송
		return result > 0;
	}
	
}