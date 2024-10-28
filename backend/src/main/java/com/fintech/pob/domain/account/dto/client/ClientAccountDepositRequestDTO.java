package com.fintech.pob.domain.account.dto.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fintech.pob.domain.account.dto.request.AccountDepositRequestDTO;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientAccountDepositRequestDTO {
    @JsonProperty("Header")
    private HeaderRequestDTO header;
    private String accountNo;
    private Long transactionBalance;
    private String transactionSummary;

    public static ClientAccountDepositRequestDTO of(HeaderRequestDTO header, AccountDepositRequestDTO requestPayload) {
        return ClientAccountDepositRequestDTO.builder()
                .header(header)
                .accountNo(requestPayload.getAccountNo())
                .transactionBalance(requestPayload.getTransactionBalance())
                .transactionSummary(requestPayload.getTransactionSummary())
                .build();
    }
}
