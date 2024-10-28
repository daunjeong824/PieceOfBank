package com.fintech.pob.domain.transactionApproval.dto;

import com.fintech.pob.domain.account.dto.client.ClientAccountHistoryListRequestDTO;
import com.fintech.pob.domain.account.dto.request.AccountHistoryListRequestDTO;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

/**
 * 거래 이체 시 받을 객체
 *
 */
@Slf4j
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TransactionApprovalRequestDto {
    private UUID senderKey; // 피보호자
    private UUID receiverKey; // 보호자
    private String receiverName; // 이체를 받는 타인
    private Long amount; // 이체 금액

    public static TransactionApprovalRequestDto of(UUID senderKey, UUID receiverKey, String receiverName, Long amount) {
        return TransactionApprovalRequestDto.builder()
                .senderKey(senderKey)
                .receiverKey(receiverKey)
                .receiverName(receiverName)
                .amount(amount)
                .build();
    }

}