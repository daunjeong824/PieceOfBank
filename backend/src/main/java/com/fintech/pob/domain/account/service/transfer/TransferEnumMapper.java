package com.fintech.pob.domain.account.service.transfer;

import java.util.EnumMap;
import java.util.Map;

public class TransferEnumMapper {

    private static final Map<TransferCheckResult, String> NOTIFICATION_MESSAGES = new EnumMap<>(TransferCheckResult.class);

    static {
        NOTIFICATION_MESSAGES.put(TransferCheckResult.LIMIT, "한도 초과 알림");
        NOTIFICATION_MESSAGES.put(TransferCheckResult.BALANCE, "잔액 부족 알림");
        NOTIFICATION_MESSAGES.put(TransferCheckResult.INACTIVITY, "계좌 비활성 알림");
    }

    public static String getNotificationMessage(TransferCheckResult checkResult) {
        return NOTIFICATION_MESSAGES.get(checkResult);
    }
}
