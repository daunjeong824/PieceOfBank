package com.fintech.pob.global.auth.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RefreshTokenService {

    private final RedisTemplate<String, String> redisTemplate;

    public RefreshTokenService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Refresh Token을 Redis에 저장
    public void saveRefreshToken(String userKey, String refreshToken) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        ops.set(userKey, refreshToken, Duration.ofDays(7));
        // 7일간 저장
    }

    // Refresh Token 확인
    public String getRefreshToken(String userKey) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        return ops.get(userKey);
    }

    // Refresh Token 삭제
    public void deleteRefreshToken(String userKey) {
        redisTemplate.delete(userKey);
    }


}
