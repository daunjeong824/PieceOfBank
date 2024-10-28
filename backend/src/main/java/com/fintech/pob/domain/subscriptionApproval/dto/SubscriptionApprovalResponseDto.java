package com.fintech.pob.domain.subscriptionApproval.dto;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

@Slf4j
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SubscriptionApprovalResponseDto {
    private String requesterName;
    private Long subscriptionId;
    private UUID userKey; // 자식
}
