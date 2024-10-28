package com.fintech.pob.domain.notification.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequestDto {
    private UUID senderKey;
    private UUID receiverKey;
    private String notificationType;
}