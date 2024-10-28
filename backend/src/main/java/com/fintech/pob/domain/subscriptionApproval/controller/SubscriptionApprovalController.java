package com.fintech.pob.domain.subscriptionApproval.controller;

import com.fintech.pob.domain.subscription.entity.Subscription;
import com.fintech.pob.domain.subscriptionApproval.dto.SubscriptionApprovalKeyDto;
import com.fintech.pob.domain.subscriptionApproval.dto.SubscriptionApprovalRequestDto;
import com.fintech.pob.domain.subscriptionApproval.dto.SubscriptionApprovalResponseDto;
import com.fintech.pob.domain.subscriptionApproval.service.SubscriptionApprovalService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/subscriptions")
public class SubscriptionApprovalController {

    private final SubscriptionApprovalService subscriptionApprovalService;

    public SubscriptionApprovalController(SubscriptionApprovalService subscriptionApprovalService) {
        this.subscriptionApprovalService = subscriptionApprovalService;
    }
    @PostMapping("/request")
    public ResponseEntity<Long> requestSubscription(@RequestBody SubscriptionApprovalRequestDto subscriptionApprovalRequestDto) {
        Long subscriptionApprovalId = subscriptionApprovalService.requestSubscription(subscriptionApprovalRequestDto);
        return ResponseEntity.ok(subscriptionApprovalId);
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<SubscriptionApprovalResponseDto> getSubscriptionApprovalByNotificationId(@PathVariable("notificationId") Long notificationId) {
        SubscriptionApprovalResponseDto subscriptionApprovalResponseDto = subscriptionApprovalService.getSubscriptionApprovalByNotificationId(notificationId);
        return ResponseEntity.ok(subscriptionApprovalResponseDto);
    }

    @PatchMapping("/approval/{subscriptionApprovalId}")
    public ResponseEntity<Subscription> approveSubscriptionRequest(@PathVariable("subscriptionApprovalId") Long subscriptionApprovalId) {
        Subscription subscription = subscriptionApprovalService.approveSubscriptionRequest(subscriptionApprovalId);
        return ResponseEntity.ok(subscription);
    }

    @PatchMapping("/refusal/{subscriptionApprovalId}")
    public ResponseEntity<SubscriptionApprovalKeyDto> refuseSubscriptionRequest(@PathVariable("subscriptionApprovalId") Long subscriptionApprovalId) {
        SubscriptionApprovalKeyDto subscriptionApprovalResponseDto = subscriptionApprovalService.refuseSubscriptionRequest(subscriptionApprovalId);
        return ResponseEntity.ok(subscriptionApprovalResponseDto);
    }
}
