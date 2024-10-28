package com.fintech.pob.domain.account.dto.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fintech.pob.domain.account.dto.request.AccountHistoryDetailRequestDTO;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientAccountHistoryDetailRequestDTO {
    @JsonProperty("Header")
    private HeaderRequestDTO header;
    private String accountNo;
    private String transactionUniqueNo;

    public static ClientAccountHistoryDetailRequestDTO of(HeaderRequestDTO header, AccountHistoryDetailRequestDTO requestPayload) {
        return ClientAccountHistoryDetailRequestDTO.builder()
                .header(header)
                .accountNo(requestPayload.getAccountNo())
                .transactionUniqueNo(requestPayload.getTransactionUniqueNo())
                .build();
    }
}
