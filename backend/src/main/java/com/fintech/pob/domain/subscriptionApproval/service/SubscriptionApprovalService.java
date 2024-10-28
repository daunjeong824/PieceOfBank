package com.fintech.pob.domain.subscriptionApproval.service;

import com.fintech.pob.domain.subscription.entity.Subscription;
import com.fintech.pob.domain.subscriptionApproval.dto.SubscriptionApprovalKeyDto;
import com.fintech.pob.domain.subscriptionApproval.dto.SubscriptionApprovalRequestDto;
import com.fintech.pob.domain.subscriptionApproval.dto.SubscriptionApprovalResponseDto;

public interface SubscriptionApprovalService {
    Long requestSubscription(SubscriptionApprovalRequestDto subscriptionApprovalRequestDto);
    SubscriptionApprovalResponseDto getSubscriptionApprovalByNotificationId(Long notificationId);
    Subscription approveSubscriptionRequest(Long subscriptionApprovalId);
    SubscriptionApprovalKeyDto refuseSubscriptionRequest(Long subscriptionApprovalId);
}
