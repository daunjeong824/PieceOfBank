package com.fintech.pob.domain.account.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountTransferRequestDTO {
    private String depositAccountNo;
    private Long transactionBalance;
    private String withdrawalAccountNo;
    private String depositTransactionSummary;
    private String withdrawalTransactionSummary;
}
