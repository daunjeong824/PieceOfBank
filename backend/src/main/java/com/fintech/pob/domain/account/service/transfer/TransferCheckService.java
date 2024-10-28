package com.fintech.pob.domain.account.service.transfer;

import com.fintech.pob.domain.account.dto.transfer.TransferCheckDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransferCheckService {
    private final List<TransferChecker> checkers;

    public Mono<TransferCheckResult> checkTransfer(TransferCheckDTO transferCheckDTO) {
        return Flux.fromIterable(checkers)
                .concatMap(checker -> checker.check(transferCheckDTO))
                .filter(result -> result != TransferCheckResult.SUCCESS)
                .next()
                .defaultIfEmpty(TransferCheckResult.SUCCESS);
    }
}
