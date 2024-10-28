package com.fintech.pob.domain.account.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AccountHistoryDetailRequestDTO {
    private String accountNo;
    private String transactionUniqueNo;
}
