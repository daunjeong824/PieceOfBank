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
public class ClientAccountHistoryListResponseDTO {
    @JsonProperty("Header")
    private HeaderResponseDTO header;
    @JsonProperty("REC")
    private Record rec;

    @Getter
    @Setter
    public static class Record {
        private String totalCount;
        @JsonProperty("list")
        private List<HistoryInfo> history;

        @Getter
        @Setter
        public static class HistoryInfo {
            private Long transactionUniqueNo;
            private String transactionDate;
            private String transactionTime;
            private String transactionType;
            private String transactionTypeName;
            private String transactionAccountNo;
            private Long transactionBalance;
            private Long transactionAfterBalance;
            private String transactionSummary;
            private String transactionMemo;
        }
    }
}
