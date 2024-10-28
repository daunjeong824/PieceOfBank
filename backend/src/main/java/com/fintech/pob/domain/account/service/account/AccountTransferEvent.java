package com.fintech.pob.domain.account.service.account;

import com.fintech.pob.domain.account.dto.request.AccountTransferRequestDTO;
import lombok.Getter;

@Getter
public class AccountTransferEvent {
    private final AccountTransferRequestDTO requestPayload;

    public AccountTransferEvent(AccountTransferRequestDTO requestPayload) {
        this.requestPayload = requestPayload;
    }

}
