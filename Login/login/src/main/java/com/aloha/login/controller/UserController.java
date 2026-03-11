package com.aloha.login.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.login.domain.CustomUser;
import com.aloha.login.domain.Users;
import com.aloha.login.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;




@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
	
	private final UserService userService;

	@GetMapping("/info")
	public ResponseEntity<?> userInfo(
		@AuthenticationPrincipal CustomUser customUser
	) {
		log.info("::::: user info :::::");

		if ( customUser == null ) {
			return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
		}

		Users user = customUser.getUser();

		if ( user != null ) {
			return new ResponseEntity<>(user, HttpStatus.OK);
		}

		return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
		
	}
	
	@PostMapping("")
	public ResponseEntity<?> join(@RequestBody Users user) throws Exception {
		log.info("join request");

		boolean result = userService.join(user);

		if ( result ) {
			return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
		}

	}
	
	@PreAuthorize(" hasRole('ROLE_ADMIN') or #p0.username == authentication.name ")
	@PutMapping("")
	public ResponseEntity<?> update(@RequestBody Users user) throws Exception {
		
		boolean result = userService.update(user);
		
		if ( result ) {
			log.info("update success!");
			return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
		}
		else {
			log.info("update failed!");
			return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
		}
		
	}
	
	@PreAuthorize(" hasRole('ROLE_ADMIN') or #p0 == authentication.name ")
	@DeleteMapping("/{username}")
	public ResponseEntity<?> delete(@PathVariable("username") String username) throws Exception {
		
		boolean result = userService.delete(username);

		if ( result ) {
			return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
		}

	}

}
