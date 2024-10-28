package com.fintech.pob.domain.account.service.transfer;

import com.fintech.pob.domain.account.dto.transfer.TransferCheckDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class TransferBalanceChecker implements TransferChecker {

    @Override
    public Mono<TransferCheckResult> check(TransferCheckDTO transferCheckDTO) {
        Long currentBalance = transferCheckDTO.getAccountWithdraw().getRec().getAccountBalance();
        Long transferAmount = transferCheckDTO.getRequestPayload().getTransactionBalance();

        if (transferAmount > currentBalance) {
            return Mono.just(TransferCheckResult.BALANCE);
        } else {
            return Mono.just(TransferCheckResult.SUCCESS);
        }
    }
}
