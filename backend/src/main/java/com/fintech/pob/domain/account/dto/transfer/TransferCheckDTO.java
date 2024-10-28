package com.fintech.pob.domain.account.dto.transfer;

import com.fintech.pob.domain.account.dto.client.ClientAccountDetailResponseDTO;
import com.fintech.pob.domain.account.dto.request.AccountTransferRequestDTO;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferCheckDTO {
    private String userKey;
    private AccountTransferRequestDTO requestPayload;
    private ClientAccountDetailResponseDTO accountDeposit;
    private ClientAccountDetailResponseDTO accountWithdraw;

    public static TransferCheckDTO of(String userKey, AccountTransferRequestDTO requestPayload, ClientAccountDetailResponseDTO accountDeposit, ClientAccountDetailResponseDTO accountWithdraw) {
        return TransferCheckDTO.builder()
                .userKey(userKey)
                .requestPayload(requestPayload)
                .accountDeposit(accountDeposit)
                .accountWithdraw(accountWithdraw)
                .build();
    }
}
