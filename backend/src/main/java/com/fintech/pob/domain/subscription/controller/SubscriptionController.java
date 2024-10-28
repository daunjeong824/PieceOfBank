package com.fintech.pob.domain.subscription.controller;


import com.fintech.pob.domain.subscription.dto.NewLimitRequestDto;
import com.fintech.pob.domain.subscription.dto.SubscriptionRequestDto;
import com.fintech.pob.domain.subscription.entity.Subscription;
import com.fintech.pob.domain.subscription.service.SubscriptionService;
import com.fintech.pob.global.auth.jwt.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/subscriptions")
@AllArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final JwtUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<Subscription> createSubscription(@RequestBody SubscriptionRequestDto dto) {

        Subscription newSubscription = subscriptionService.create(dto);

        return ResponseEntity.ok(newSubscription);
    }

    @GetMapping("/findByTarget")
    public ResponseEntity<Subscription> getSubscriptionByTargetUserKey(@RequestHeader("Authorization") String token) {
        String key = (String) jwtUtil.extractUserKey(token);
        UUID userKey = UUID.fromString(key);
        Subscription subscription = subscriptionService.getSubscriptionByTargetUserKey(userKey);
        if (subscription != null) {
            return ResponseEntity.ok(subscription);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/findByProtect")
    public ResponseEntity<Subscription> getSubscriptionByProtectUserKey(@RequestHeader("Authorization") String token) {
        String key = (String) jwtUtil.extractUserKey(token);
        UUID userKey = UUID.fromString(key);
        Subscription subscription = subscriptionService.getSubscriptionByProtectUserKey(userKey);
        if (subscription != null) {
            return ResponseEntity.ok(subscription);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/setOneTime")
    public ResponseEntity<Subscription> setOneTimeTransferLimit(
            @RequestHeader("Authorization") String token, @RequestBody NewLimitRequestDto newLimitRequestDto) {

        String key = (String) jwtUtil.extractUserKey(token);
        UUID userKey = UUID.fromString(key);
        Long newLimit = newLimitRequestDto.getNewLimit();
        log.info("setOneTime >>>>> {}", newLimit);
        subscriptionService.setOneTimeTransferLimit(userKey, newLimit);
        return ResponseEntity.ok(null);

    }


    @PutMapping("/setDaily")
    public ResponseEntity<Subscription> setDailyTransferLimit(
            @RequestHeader("Authorization") String token, @RequestBody NewLimitRequestDto newLimitRequestDto) {

        String key = (String) jwtUtil.extractUserKey(token);
        UUID userKey = UUID.fromString(key);
        Long newLimit = newLimitRequestDto.getNewLimit();
        log.info("setDaily >>>>> {}", newLimit);
        subscriptionService.setDailyTransferLimit(userKey, newLimit);
        return ResponseEntity.ok(null);

    }


}
