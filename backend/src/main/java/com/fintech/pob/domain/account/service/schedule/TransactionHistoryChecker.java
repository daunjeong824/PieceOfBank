package com.fintech.pob.domain.account.service.schedule;

import com.fintech.pob.domain.account.dto.client.ClientAccountListResponseDTO;
import com.fintech.pob.domain.account.service.account.AccountService;
import com.fintech.pob.domain.notification.service.NotificationService;
import com.fintech.pob.domain.subscription.entity.Subscription;
import com.fintech.pob.domain.subscription.service.SubscriptionService;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import com.fintech.pob.global.header.service.HeaderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionHistoryChecker implements ScheduledChecker {

    private final AccountService accountService;
    private final HeaderService headerService;
    private final SubscriptionService subscriptionService;
    private final NotificationService notificationService;

    @Override
    public void check() {
        List<Subscription> subscriptions = subscriptionService.findAll();

        for (Subscription subscription : subscriptions) {
            HeaderRequestDTO header = headerService.createCommonHeader("inquireDemandDepositAccountList",
                    String.valueOf(subscription.getTargetUser().getUserKey()));
            Mono<ClientAccountListResponseDTO> accountListMono = accountService.getAccountList(header);

            accountListMono.subscribe(accountListResponse -> {
                List<ClientAccountListResponseDTO.Record> accounts = accountListResponse.getRec();

                for (ClientAccountListResponseDTO.Record account : accounts) {
                    String lastTransactionDate = account.getLastTransactionDate();
                    String accountNo = account.getAccountNo();

                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

                    //if (lastTransactionDate == "" || LocalDate.parse(lastTransactionDate, formatter).isEqual(LocalDate.now())) {
                    if (lastTransactionDate == "" || LocalDate.parse(lastTransactionDate, formatter).isBefore(LocalDate.now().minusDays(3))) {
                        log.info("[ScheduledChecker]: ", accountNo, subscription.getTargetUser());
                        notificationService.sendNotification(UUID.fromString(header.getUserKey()), subscription.getProtectUser().getUserKey(), "거래 내역 없음 알림");
                        break;
                    }
                }
            });
        }
    }
}
