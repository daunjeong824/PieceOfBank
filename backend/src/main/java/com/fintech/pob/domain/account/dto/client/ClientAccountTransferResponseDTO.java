package com.fintech.pob.domain.account.dto.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fintech.pob.global.header.dto.HeaderResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientAccountTransferResponseDTO {
    @JsonProperty("Header")
    private HeaderResponseDTO header;
    @JsonProperty("REC")
    private List<Record> rec;

    @Getter
    @Setter
    public static class Record {
        private Long transactionUniqueNo;
        private String accountNo;
        private String transactionDate;
        private String transactionType; // 1, 2 ...
        private String transactionTypeName; // 입금이체, 출금이체 ...
        private String transactionAccountNo; // 이체 거래에 대한 계좌번호
    }
}
