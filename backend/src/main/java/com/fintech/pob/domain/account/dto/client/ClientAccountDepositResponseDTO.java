package com.fintech.pob.domain.account.dto.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fintech.pob.global.header.dto.HeaderResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientAccountDepositResponseDTO {
    @JsonProperty("Header")
    private HeaderResponseDTO header;
    @JsonProperty("REC")
    private Record rec;

    @Getter
    @Setter
    public static class Record {
        private Long transactionUniqueNo;
        private String transactionDate;
    }
}
