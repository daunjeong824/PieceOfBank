package com.fintech.pob.domain.userToken.controller;

import com.fintech.pob.domain.userToken.dto.UserTokenRequestDto;
import com.fintech.pob.domain.userToken.service.UserTokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/token")
public class UserTokenController {

    private final UserTokenService userTokenService;

    public UserTokenController(UserTokenService userTokenService) {
        this.userTokenService = userTokenService;
    }

    @PostMapping()
    public ResponseEntity<String> saveToken(@RequestBody UserTokenRequestDto userTokenRequestDto) {
        userTokenService.saveUserToken(userTokenRequestDto.getUserKey(), userTokenRequestDto.getToken());
        return ResponseEntity.ok("토큰이 저장되었습니다.");
    }

    @GetMapping("/{userKey}")
    public ResponseEntity<String> getToken(@PathVariable("userKey") UUID userKey) {
        try {
            String token = userTokenService.getUserTokenByUserKey(userKey);
            return ResponseEntity.ok(token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{userKey}")
    public ResponseEntity<String> deleteToken(@PathVariable("userKey") UUID userKey) {
        userTokenService.deleteUserToken(userKey);
        return ResponseEntity.ok("토큰이 삭제되었습니다.");
    }
}
