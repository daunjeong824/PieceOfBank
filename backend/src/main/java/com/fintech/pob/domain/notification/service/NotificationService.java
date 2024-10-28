package com.fintech.pob.domain.notification.service;

import com.fintech.pob.domain.notification.dto.NotificationResponseDto;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationResponseDto> getAllNotificationsByReceiverKey(UUID receiverKey);
    NotificationResponseDto getNotificationByNotificationId(Long notificationId);
    NotificationResponseDto updateNotificationStatusToRead(Long notificationId);
    NotificationResponseDto updateNotificationStatusToDelete(Long notificationId);
    Long sendNotification(UUID senderKey, UUID receiverKey, String typeName);
}
