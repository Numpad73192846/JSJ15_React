package com.aloha.login.security.props;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties("com.aloha.login")
public class JwtProps {
	
	private String secretKey;

}
