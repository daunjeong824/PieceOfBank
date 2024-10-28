package com.fintech.pob.domain.subscriptionApproval.repository;

import com.fintech.pob.domain.subscriptionApproval.entity.SubscriptionApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionApprovalRepository extends JpaRepository<SubscriptionApproval, Long> {
    Optional<SubscriptionApproval> findByNotification_NotificationId(Long notificationId);
}

