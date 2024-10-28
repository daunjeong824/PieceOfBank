package com.fintech.pob.global.auth;

import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.service.LocalUserService;
import com.fintech.pob.global.auth.dto.AccessTokenResponse;
import com.fintech.pob.global.auth.dto.AuthRequest;
import com.fintech.pob.global.auth.dto.AuthResponse;
import com.fintech.pob.global.auth.dto.RefreshRequest;
import com.fintech.pob.global.auth.jwt.JwtUtil;
import com.fintech.pob.global.auth.service.LogoutService;
import com.fintech.pob.global.auth.service.RefreshTokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final LocalUserService localUserService;
    private final RefreshTokenService refreshTokenService;
    private final LogoutService logoutService;

    public AuthController(JwtUtil jwtUtil, LocalUserService localUserService, RefreshTokenService refreshTokenService, LogoutService logoutService) {
        this.jwtUtil = jwtUtil;
        this.localUserService = localUserService;
        this.refreshTokenService = refreshTokenService;
        this.logoutService = logoutService;
    }

    // 로그인 할 때 access 랑 refresh 둘다 발급
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authResquest) {
        User user = localUserService.authenticate(authResquest.getUserId(), authResquest.getPassword());

        if (user != null) {
            // access 토큰 생성
            String accessToken = jwtUtil.generateAccessToken(String.valueOf(user.getUserKey()), user.getSubscriptionType());

            // refresh 토큰 생성
            String refreshToken = jwtUtil.generateRefreshToken(String.valueOf(user.getUserKey()));
            refreshTokenService.saveRefreshToken(String.valueOf(user.getUserKey()), refreshToken);

            // 권한과 함께 생성
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, user.getSubscriptionType()));
        } else {
            return ResponseEntity.status(401).body("로그인 실패");
        }
    }

    // refresh 로 access재발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshRequest refreshRequest) {
        String refreshToken = refreshRequest.getRefreshToken();
        String userKey = jwtUtil.extractUserKey(refreshToken);

        // redis로 유효성 검사
        String savedToken = refreshTokenService.getRefreshToken(userKey);
        if (savedToken != null && savedToken.equals(refreshToken) && jwtUtil.isTokenValid(refreshToken, userKey)) {
            User user = localUserService.findByUserKey(userKey);
            int subscriptionType = user.getSubscriptionType();


            // 새 토큰 발급
            String newAccessToken = jwtUtil.generateAccessToken(userKey, subscriptionType);
            return ResponseEntity.ok(new AccessTokenResponse(newAccessToken));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("권한 검증 불가 refresh token");
        }
    }

    // 로그아웃 처리
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        log.info("Received Authorization Header: {}", token); // 로그로 확인

        try {
            long expirationTime = jwtUtil.getExpirationTime(token);
            logoutService.logout(token, expirationTime);
            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("로그아웃 실패");
        }
    }

}
