package com.fintech.pob.domain.transactionApproval.entity;

import com.fintech.pob.domain.notification.entity.Notification;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transaction_approval")
@Data
@NoArgsConstructor
public class TransactionApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionApprovalId;

    @OneToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;

    @Column(nullable = false)
    private String receiverName; // 이체 받는 사람 정보

    @Column(nullable = false)
    private Long amount; // 이체 받는 금액

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionApprovalStatus status; // 승인 상태

    @Builder
    public TransactionApproval(Notification notification, String receiverName, Long amount, TransactionApprovalStatus transactionApprovalStatus) {
        this.notification = notification;
        this.receiverName = receiverName;
        this.amount = amount;
        this.status = transactionApprovalStatus;
    }
}
