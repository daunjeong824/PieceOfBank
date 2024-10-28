package com.fintech.pob.domain.account.service.transfer;

import com.fintech.pob.domain.account.dto.transfer.TransferCheckDTO;
import reactor.core.publisher.Mono;

public interface TransferChecker {
    Mono<TransferCheckResult> check(TransferCheckDTO transferCheckDTO);
}
