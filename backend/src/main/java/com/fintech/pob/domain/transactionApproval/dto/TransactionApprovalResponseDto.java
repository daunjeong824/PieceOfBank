package com.fintech.pob.domain.transactionApproval.dto;

import com.fintech.pob.domain.transactionApproval.entity.TransactionApprovalStatus;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

@Slf4j
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TransactionApprovalResponseDto {
    private UUID senderKey; // 피보호자
    private UUID receiverKey; // 보호자
    private String receiverName; // 이체를 받는 타인
    private Long amount; // 이체 금액
    private TransactionApprovalStatus status; // 상태
}