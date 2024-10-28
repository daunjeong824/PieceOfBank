package com.fintech.pob.domain.user.controller;

import com.fintech.pob.domain.account.dto.request.AccountUpdateRequestDTO;
import com.fintech.pob.domain.user.dto.request.CreateUserRequest;
import com.fintech.pob.domain.user.dto.request.UserRequest;
import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.service.LocalUserService;
import com.fintech.pob.domain.user.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserServiceImpl userService;
    private final LocalUserService localUserService;

    @Autowired
    public UserController(UserServiceImpl userService, LocalUserService localUserService) {
        this.userService = userService;
        this.localUserService = localUserService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody CreateUserRequest request) {
        try {
            String userKey = userService.createUserAccount(request.getEmail());
            return ResponseEntity.ok("사용자 계정 생성 성공: " + userKey);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("계정 생성 실패: " + e.getMessage());
        }
    }

    @PostMapping("/regist")
    public ResponseEntity<String> registerUser(@RequestBody UserRequest userRequest) {
        try {
            UUID userKey = UUID.fromString(userRequest.getUserKey());
            localUserService.saveUser(userKey, userRequest.getUserId(), userRequest.getUserName(), userRequest.getUserPassword(), userRequest.getUserSubscriptionType());
            return ResponseEntity.ok("사용자 정보 저장 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("사용자 정보 저장 실패: " + e.getMessage());
        }
    }

    @PatchMapping("/setPrimaryAccount")
    public ResponseEntity<String> setPrimaryAccount(@RequestBody AccountUpdateRequestDTO request) {
        try {
            UUID userKey = UUID.fromString(request.getUserKey());
            localUserService.updateAccountNo(userKey, request.getAccountNo());
            return ResponseEntity.ok("대표 계좌 업데이트 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("대표 계좌 업데이트 실패: " + e.getMessage());
        }

    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserByUserId(@PathVariable String userId) {
        Optional<User> user = localUserService.getUserByUserId(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
