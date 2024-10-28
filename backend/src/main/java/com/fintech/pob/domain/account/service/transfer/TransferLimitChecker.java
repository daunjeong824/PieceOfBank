package com.fintech.pob.domain.account.service.transfer;

import com.fintech.pob.domain.account.dto.client.ClientAccountHistoryListResponseDTO;
import com.fintech.pob.domain.account.dto.request.AccountHistoryListRequestDTO;
import com.fintech.pob.domain.account.dto.request.AccountTransferRequestDTO;
import com.fintech.pob.domain.account.dto.transfer.TransferCheckDTO;
import com.fintech.pob.domain.account.service.account.AccountHistoryListChecker;
import com.fintech.pob.domain.subscription.entity.Subscription;
import com.fintech.pob.domain.subscription.service.SubscriptionService;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import com.fintech.pob.global.header.service.HeaderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TransferLimitChecker implements TransferChecker {

    private final SubscriptionService subscriptionService;
    private final AccountHistoryListChecker accountService;
    private final HeaderService headerService;

    @Override
    public Mono<TransferCheckResult> check(TransferCheckDTO transferCheckDTO) {
        String userKey = transferCheckDTO.getUserKey();
        Optional<Subscription> subscriptionOptional = subscriptionService.findByTargetUserKey(UUID.fromString(userKey));

        AccountTransferRequestDTO requestPayload = transferCheckDTO.getRequestPayload();

        if (subscriptionOptional.isPresent()) {
            Subscription subscription = subscriptionOptional.get();
            Long oneTimeTransferLimit = subscription.getOneTimeTransferLimit();
            Long dailyTransferLimit = subscription.getDailyTransferLimit();

            // 1회 이체 한도 체크
            if (transferCheckDTO.getRequestPayload().getTransactionBalance() > oneTimeTransferLimit) {
                return Mono.just(TransferCheckResult.LIMIT);
            }

            // 1일 이체 한도 체크
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            AccountHistoryListRequestDTO historyRequest = new AccountHistoryListRequestDTO(
                    requestPayload.getWithdrawalAccountNo(),
                    LocalDate.now().format(formatter),
                    LocalDate.now().format(formatter),
                    "A",
                    "DESC"
            );

            HeaderRequestDTO header = headerService.createCommonHeader("inquireTransactionHistoryList", userKey);

            return accountService.getAccountHistoryList(historyRequest, header)
                    .map(response -> {
                        Long totalAmountToday = response.getRec().getHistory().stream()
                                .mapToLong(ClientAccountHistoryListResponseDTO.Record.HistoryInfo::getTransactionBalance)
                                .sum();

                        if (totalAmountToday + requestPayload.getTransactionBalance() > dailyTransferLimit) {
                            return TransferCheckResult.LIMIT;
                        }
                        return TransferCheckResult.SUCCESS;
                    });
        }

        return Mono.just(TransferCheckResult.SUCCESS);
    }
}
