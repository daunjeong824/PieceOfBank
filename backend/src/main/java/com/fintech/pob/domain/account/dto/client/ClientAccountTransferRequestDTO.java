package com.fintech.pob.domain.account.dto.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fintech.pob.domain.account.dto.request.AccountTransferRequestDTO;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientAccountTransferRequestDTO {
    @JsonProperty("Header")
    private HeaderRequestDTO header;
    private String depositAccountNo; // 원화, 외화 계좌 가능
    private Long transactionBalance; // 출금할 금액 입력
    private String withdrawalAccountNo; // 원화 계좌만 가능
    private String depositTransactionSummary;
    private String withdrawalTransactionSummary;

    public static ClientAccountTransferRequestDTO of(HeaderRequestDTO header, AccountTransferRequestDTO requestPayload) {
        return ClientAccountTransferRequestDTO.builder()
                .header(header)
                .depositAccountNo(requestPayload.getDepositAccountNo())
                .transactionBalance(requestPayload.getTransactionBalance())
                .withdrawalAccountNo(requestPayload.getWithdrawalAccountNo())
                .depositTransactionSummary(requestPayload.getDepositTransactionSummary())
                .withdrawalTransactionSummary(requestPayload.getWithdrawalTransactionSummary())
                .build();
    }
}
