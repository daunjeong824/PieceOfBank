package com.fintech.pob.domain.account.dto.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fintech.pob.domain.account.dto.request.AccountHistoryListRequestDTO;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientAccountHistoryListRequestDTO {
    @JsonProperty("Header")
    private HeaderRequestDTO header;
    private String accountNo;
    private String startDate;
    private String endDate;
    private String transactionType; // M: 입금, D: 출금, A: 전체
    private String orderByType; // ASC: 오름차순(이전거래), DESC: 내림차순(최근거래)

    public static ClientAccountHistoryListRequestDTO of(HeaderRequestDTO header, AccountHistoryListRequestDTO requestPayload) {
        return ClientAccountHistoryListRequestDTO.builder()
                .header(header)
                .accountNo(requestPayload.getAccountNo())
                .startDate(requestPayload.getStartDate())
                .endDate(requestPayload.getEndDate())
                .transactionType(requestPayload.getTransactionType())
                .orderByType(requestPayload.getOrderByType())
                .build();
    }
}
