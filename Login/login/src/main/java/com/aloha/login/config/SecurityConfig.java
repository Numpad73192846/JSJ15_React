package com.aloha.login.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity( prePostEnabled = true, securedEnabled = true )
public class SecurityConfig {

	// @Autowired private UserDetailsService userDetailsService;
	// @Autowired private JwtProvider jwtProvider;
	private AuthenticationManager authenticationManager;

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		this.authenticationManager = authenticationConfiguration.getAuthenticationManager();
		return authenticationManager;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.formLogin(login -> login.disable());
		http.httpBasic(basic -> basic.disable());
		http.csrf(csrf -> csrf.disable());

		// [개선] CORS 설정 추가
		http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
		http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		// [개선] URL 권한 규칙 추가
		http.authorizeHttpRequests(authorize -> authorize
			.requestMatchers(HttpMethod.POST, "/login").permitAll()     // 로그인
			.requestMatchers(HttpMethod.POST, "/users").permitAll()     // 회원가입
			.requestMatchers(HttpMethod.GET, "/users/info").authenticated()  // 회원 정보
			.requestMatchers(HttpMethod.PUT, "/users").authenticated()       // 회원 수정
			.requestMatchers(HttpMethod.DELETE, "/users/**").authenticated() // 회원 삭제
			.anyRequest().permitAll()
		);

		// TODO: JWT 인증 필터 추가
		// http.userDetailsService( userDetailServiceImpl );
		// http.addFilterAt( new JwtAuthenticationFilter(authenticationManager, jwtProvider), UsernamePasswordAuthenticationFilter.class )
		// 	.addFilterBefore(new JwtRequestFilter(authenticationManager, jwtProvider), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	/**
	 * CORS 설정 - 프론트엔드(localhost:5173) 허용
	 */
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
	
		configuration.setAllowedOrigins(Arrays.asList(
		"http://localhost:5173", "http://127.0.0.1:5173"
		));
	
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
		configuration.setExposedHeaders(Arrays.asList("Authorization"));  // JWT 응답 헤더 노출
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	// 비밀번호 암호화 - BCryptPasswordEncoder 사용
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}

