package com.fintech.pob.domain.notification.service.expo;

import com.fintech.pob.domain.notification.dto.expo.ExpoNotificationRequestDto;

public interface ExpoService {
    void sendPushNotification(ExpoNotificationRequestDto expoNotificationRequestDto);
}
