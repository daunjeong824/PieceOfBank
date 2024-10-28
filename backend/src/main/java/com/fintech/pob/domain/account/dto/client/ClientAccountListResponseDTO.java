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
public class ClientAccountListResponseDTO {
    @JsonProperty("Header")
    private HeaderResponseDTO header;
    @JsonProperty("REC")
    private List<Record> rec;

    @Getter
    @Setter
    public static class Record {
        private String bankCode;
        private String bankName;
        private String username;
        private String accountNo;
        private String accountName;
        private String accountTypeCode; // 1: 수시입출금, 2: 정기예금, 3: 정기적금, 4: 대출
        private String accountTypeName;
        private String accountCreatedDate;
        private String accountExpiryDate;
        private Long dailyTransferLimit; // default: 5억
        private Long oneTimeTransferLimit; // default: 1억
        private Long accountBalance;
        private String lastTransactionDate;
        private String currency;
    }
}
