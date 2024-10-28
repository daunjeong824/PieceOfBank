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
public class ClientAccountCreationResponseDTO {
    @JsonProperty("Header")
    private HeaderResponseDTO header;
    @JsonProperty("REC")
    private Record rec;

    @Getter
    @Setter
    public static class Record {
        private String bankCode;
        private String accountNo;
        @JsonProperty("currency")
        private CurrencyInfo currency;

        @Getter
        @Setter
        public static class CurrencyInfo {
            private String currency;
            private String currencyName;
        }
    }
}
