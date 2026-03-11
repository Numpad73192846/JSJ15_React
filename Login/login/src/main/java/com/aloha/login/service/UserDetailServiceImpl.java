package com.aloha.login.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.aloha.login.domain.CustomUser;
import com.aloha.login.domain.Users;
import com.aloha.login.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {
	
	private final UserMapper userMapper;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.info(":::::::::: UserDetailServiceImpl ::::::::::");
		log.info("- username : " + username);

		Users user = null;

		try {
			user = userMapper.select(username);
			log.info("user info : " + user);
		} catch (Exception e) {
			e.printStackTrace();
		}

		if ( user == null ) {
			throw new UsernameNotFoundException("Cannot find user: " + username);
		}

		CustomUser customUser = new CustomUser(user);
		return customUser;

	}

	

}
