package com.fintech.pob.global.header.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class HeaderRequestDTO {
    private String apiName;
    private String transmissionDate;
    private String transmissionTime;
    private String institutionCode;
    private String fintechAppNo;
    private String apiServiceCode;
    private String institutionTransactionUniqueNo;
    private String apiKey;
    private String userKey;

    public void setApiName(String apiName) {
        this.apiName = apiName;
        this.apiServiceCode = apiName;
    }

    @Override
    public String toString() {
        return "HeaderRequestDTO{" +
                "apiName='" + apiName + '\'' +
                ", transmissionDate='" + transmissionDate + '\'' +
                ", transmissionTime='" + transmissionTime + '\'' +
                ", institutionCode='" + institutionCode + '\'' +
                ", fintechAppNo='" + fintechAppNo + '\'' +
                ", apiServiceCode='" + apiServiceCode + '\'' +
                ", institutionTransactionUniqueNo='" + institutionTransactionUniqueNo + '\'' +
                ", apiKey='" + apiKey + '\'' +
                ", userKey='" + userKey + '\'' +
                '}';
    }
}
