package com.aloha.login.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.aloha.login.domain.CustomUser;
import com.aloha.login.domain.Users;
import com.aloha.login.provider.JwtProvider;
import com.aloha.login.security.constants.SecurityConstants;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.ObjectMapper;

/**
 * JWT 인증 필터
 * - 로그인 시도 : request[ header | body { "username":?, "password":?} ]
 * - 인증 성공 : JWT 생성 후 response header에 추가
 * - 인증 실패 : 401 Unauthorized 응답
 */
@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	
	private final AuthenticationManager authenticationManager;
	private final JwtProvider jwtProvider;

	public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtProvider jwtProvider) {
		this.authenticationManager = authenticationManager;
		this.jwtProvider = jwtProvider;
		setFilterProcessesUrl( SecurityConstants.LOGIN_URL );
	}

	// 인증 시도 : request[ header | body { "username":?, "password":?} ]
	// 인증 성공 : response[ header { Authorization: "Bearer {jwt" } | body { } } ]
	// 인증 실패 : status : 401
	@Override
	public Authentication attemptAuthentication(
		HttpServletRequest request,
		HttpServletResponse response
	) throws AuthenticationException {

		ObjectMapper objectMapper = new ObjectMapper();
		
		try {
			Users user = objectMapper.readValue(request.getInputStream(), Users.class);
			String username = user.getUsername();
			String password = user.getPassword();

			log.info("username : " + username);

			Authentication authentication = new UsernamePasswordAuthenticationToken(username, password);
			authentication = authenticationManager.authenticate(authentication);

			log.info("isAuthenticated() : " + authentication.isAuthenticated());

			if( !authentication.isAuthenticated() ) {
				log.info("Authentication failed");
				response.setStatus(401);
			}

			return authentication;
		} catch (IOException e) {
			log.error("Failed to parse login request body", e);
			throw new RuntimeException("Failed to parse login request body", e);
		}

    }

	@Override
	protected void successfulAuthentication(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain chain,
		Authentication authentication
	) throws IOException, ServletException {
		log.info("Authentication success!");
		CustomUser customUser = (CustomUser) authentication.getPrincipal();
		Users user = customUser.getUser();
		String id = user.getId();
		String username = user.getUsername();
		List<String> roles = customUser.getAuthorities()
									   .stream()
									   .map( GrantedAuthority::getAuthority )
									   .collect( Collectors.toList() );

		String jwt = jwtProvider.createToken(id, username, roles);

		response.addHeader(SecurityConstants.TOKEN_HEADER, SecurityConstants.TOKEN_PREFIX + jwt);
		response.setStatus(200);

		ObjectMapper objectMapper = new ObjectMapper();
		String jsonString = objectMapper.writeValueAsString(user);

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		PrintWriter printWriter = response.getWriter();
		printWriter.write(jsonString);
		printWriter.flush();
	}

	@Override
	protected void unsuccessfulAuthentication(
		HttpServletRequest request,
		HttpServletResponse response,
		AuthenticationException failed
	) throws IOException, ServletException {
		log.info("Authentication failed : " + failed.getMessage());
		response.setStatus(401);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		PrintWriter printWriter = response.getWriter();
		printWriter.write("{\"error\": \"UNAUTHORIZED\", \"message\": \"아이디 또는 비밀본호가 일치하지 않습니다.\"}");
		printWriter.flush();

	}

}
