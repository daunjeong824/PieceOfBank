package com.fintech.pob.domain.transactionApproval.repository;

import com.fintech.pob.domain.transactionApproval.entity.TransactionApproval;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TransactionApprovalRepository extends JpaRepository<TransactionApproval, Long> {
    @Query("SELECT t.transactionApprovalId FROM TransactionApproval t WHERE t.notification.notificationId = :notificationId")
    Optional<Long> findTransactionApprovalIdByNotificationId(@Param("notificationId") Long notificationId);
}
