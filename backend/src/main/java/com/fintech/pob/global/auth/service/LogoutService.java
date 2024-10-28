package com.fintech.pob.global.auth.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class LogoutService {

    private final RedisTemplate<String, String> redisTemplate;

    public LogoutService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 로그아웃할 때 jwt토큰을 블랙리스트에 추가한다
    public void logout(String token, long expirationTime) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        // redis에 토큰을 저장하고, 토큰의 만료시간과 동일하게 설정
        ops.set(token, "loggedOut", Duration.ofMillis(expirationTime));
    }

    public boolean isTokenInBlackList(String token) {
        return redisTemplate.hasKey(token);
    }
}
