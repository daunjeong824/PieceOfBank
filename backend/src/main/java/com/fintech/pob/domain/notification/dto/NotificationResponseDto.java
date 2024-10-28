package com.fintech.pob.domain.notification.dto;

import com.fintech.pob.domain.notification.entity.NotificationStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 알림 내역 조회 시 받을 객체
 *
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseDto {
    private Long notificationId;
    private UUID senderKey;
    private UUID receiverKey;
    private String notificationType;
    private LocalDateTime created;
    private LocalDateTime readAt;
    private NotificationStatus notificationStatus;
}
