package com.aloha.login.filter;

import java.io.IOException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aloha.login.provider.JwtProvider;
import com.aloha.login.security.constants.SecurityConstants;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

	private final AuthenticationManager authenticationManager;
	private final JwtProvider jwtProvider;

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		throw new UnsupportedOperationException("Unimplemented method 'doFilterInternal'");
		String authorization = request.getHeader( SecurityConstants.TOKEN_HEADER );
		log.info("authorization : " + authorization);

		if( authorization == null || authorization.length() == 0 || !authorization.startsWith( SecurityConstants.TOKEN_PREFIX ) ) {
			filterChain.doFilter(request, response);
			return;
		}

		String jwt = authorization.replace( SecurityConstants.TOKEN_PREFIX, "");
		Authentication authentication = jwtProvider.getAuthenticationToken(jwt);

		if( authentication != null && authentication.isAuthenticated() ) {
			log.info("JWT authentication complete");
		}

		boolean result = jwtProvider.validateToken(jwt);
		
		if( result ) {
			log.info("Valid JWT token");
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
		
		filterChain.doFilter(request, response);
	}
	
}
