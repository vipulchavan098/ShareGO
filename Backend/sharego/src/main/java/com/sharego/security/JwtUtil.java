package com.sharego.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration.time}")
    private long jwtExpirationTime;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {

        log.info("Initializing JWT key");

        this.secretKey =
                Keys.hmacShaKeyFor(
                        jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // =============================
    // GENERATE TOKEN
    // =============================
    public String generateToken(UserPrincipal principal) {

        Date now = new Date();
        Date expiry =
                new Date(now.getTime() + jwtExpirationTime);

        return Jwts.builder()
                .subject(principal.getEmail())
                .issuedAt(now)
                .expiration(expiry)
                .claims(Map.of(
                        "user_id", principal.getUserId(),
                        "user_role", principal.getUserRole()
                ))
                .signWith(secretKey)
                .compact();
    }

    // =============================
    // VALIDATE TOKEN
    // =============================
    public Claims validateToken(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
