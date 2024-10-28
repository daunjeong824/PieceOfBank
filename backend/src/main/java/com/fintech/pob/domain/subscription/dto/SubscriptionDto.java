package com.fintech.pob.domain.subscription.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

@Data
public class SubscriptionDto {

    private Long subscriptionId;
    private String targetUserId;
    private String protectUserId;
    private Long oneTimeTransferLimit;
    private Long dailyTransferLimit;
    private String counterAccount;

    // 기본 생성자
    public SubscriptionDto() {
    }

    // 모든 필드를 포함한 생성자
    public SubscriptionDto(Long subscriptionId, String targetUserId, String protectUserId,
                           Long oneTimeTransferLimit, Long dailyTransferLimit, String counterAccount) {
        this.subscriptionId = subscriptionId;
        this.targetUserId = targetUserId;
        this.protectUserId = protectUserId;
        this.oneTimeTransferLimit = oneTimeTransferLimit;
        this.dailyTransferLimit = dailyTransferLimit;
        this.counterAccount = counterAccount;
    }


}