package com.fintech.pob.domain.subscriptionApproval.dto;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;


/**
 * 구독 요청 시 받을 객체
 *
 */
@Slf4j
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SubscriptionApprovalRequestDto {
    private UUID senderKey;
    private String receiverId;
}
