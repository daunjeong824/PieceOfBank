package com.fintech.pob.domain.pendinghistory.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintech.pob.domain.account.dto.request.AccountTransferRequestDTO;
import com.fintech.pob.domain.account.service.account.AccountTransferEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Component
@RequiredArgsConstructor
public class PendingHistoryService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ApplicationEventPublisher eventPublisher;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public void savePendingHistory(Long notificationId, AccountTransferRequestDTO requestPayload) {
        String redisKey = "PendingHistory:" + notificationId;

        Map<String, String> pendingHistoryData = new HashMap<>();
        pendingHistoryData.put("depositAccountNo", requestPayload.getDepositAccountNo());
        pendingHistoryData.put("transactionBalance", String.valueOf(requestPayload.getTransactionBalance()));
        pendingHistoryData.put("withdrawalAccountNo", requestPayload.getWithdrawalAccountNo());
        pendingHistoryData.put("depositTransactionSummary", requestPayload.getDepositTransactionSummary());
        pendingHistoryData.put("withdrawalTransactionSummary", requestPayload.getWithdrawalTransactionSummary());

        try {
            String redisValue = objectMapper.writeValueAsString(pendingHistoryData);
            redisTemplate.opsForList().rightPush(redisKey, redisValue);
            redisTemplate.expire(redisKey, 24, TimeUnit.HOURS);
            //showPendingData();
        } catch (Exception e) {
            log.error("[PendingHistory 저장] 직렬화 오류", e);
        }
    }

    public void showPendingData() {
        String pattern = "PendingHistory:*";

        try {
            Set<String> keys = redisTemplate.keys(pattern);

            if (keys != null && !keys.isEmpty()) {
                for (String redisKey : keys) {
                    List<String> pendingHistoryList = redisTemplate.opsForList().range(redisKey, 0, -1);

                    if (pendingHistoryList != null && !pendingHistoryList.isEmpty()) {
                        log.info("Data for key: ", redisKey);
                        for (String redisValue : pendingHistoryList) {

                            Map<String, String> pendingHistoryData = objectMapper.readValue(redisValue, Map.class);

                            log.info("Deposit Account No: ", pendingHistoryData.get("depositAccountNo"));
                            log.info("Transaction Balance: ", pendingHistoryData.get("transactionBalance"));
                            log.info("Withdrawal Account No: ", pendingHistoryData.get("withdrawalAccountNo"));
                            log.info("Deposit Transaction Summary: ", pendingHistoryData.get("depositTransactionSummary"));
                            log.info("Withdrawal Transaction Summary: ", pendingHistoryData.get("withdrawalTransactionSummary"));
                            log.info("--------------------------------------------");
                        }
                    } else {
                        log.info("No data found for key: ", redisKey);
                    }
                }
            } else {
                log.info("No pending history data found.");
            }
        } catch (Exception e) {
            log.error("[PendingHistory 조회] 직렬화 오류", e);
        }
    }

    public void approvePendingHistory(Long notificationId) {
        String redisKey = "PendingHistory:" + notificationId;

        try {
            String redisValue = redisTemplate.opsForList().leftPop(redisKey);

            if (redisValue != null) {
                Map<String, String> pendingHistoryData = objectMapper.readValue(redisValue, Map.class);
                publishAccountTransferEvent(pendingHistoryData);

                deletePendingHistory(redisKey);
            } else {
                log.info("[PendingHistory 승인] Notfound notificationId: ", notificationId);
            }
        } catch (Exception e) {
            log.error("[PendingHistory 승인] 데이터 처리 오류: ", notificationId, e);
        }
    }

    public void refusePendingHistory(Long notificationId) {
        String redisKey = "PendingHistory:" + notificationId;
        deletePendingHistory(redisKey);
    }

    public void deletePendingHistory(String redisKey) {
        try {
            redisTemplate.delete(redisKey);
            log.info("[PendingHistory 삭제] 데이터 삭제 완료: ", redisKey);
        } catch (Exception e) {
            log.error("[PendingHistory 삭제] Redis 데이터 삭제 오류: ", redisKey, e);
        }
    }

    public void publishAccountTransferEvent(Map<String, String> pendingHistoryData) {
        AccountTransferRequestDTO requestPayload = AccountTransferRequestDTO.builder()
                .depositAccountNo(pendingHistoryData.get("depositAccountNo"))
                .transactionBalance(Long.valueOf(pendingHistoryData.get("transactionBalance")))
                .withdrawalAccountNo(pendingHistoryData.get("withdrawalAccountNo"))
                .depositTransactionSummary(pendingHistoryData.get("depositTransactionSummary"))
                .withdrawalTransactionSummary(pendingHistoryData.get("withdrawalTransactionSummary"))
                .build();

        eventPublisher.publishEvent(new AccountTransferEvent(requestPayload));
    }
}
