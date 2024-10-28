package com.fintech.pob.domain.notification.dto.fcm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * FCM 전송 Format DTO
 *
 */
@Getter
@Builder
public class FCMMessageDto {
    private boolean validateOnly;
    private FCMMessageDto.Message message;

    @Builder
    @AllArgsConstructor
    @Getter
    public static class Message {
        private FCMMessageDto.Notification notification;
        private String token;
    }

    @Builder
    @AllArgsConstructor
    @Getter
    public static class Notification {
        private String title;
        private String body;
        private String image;
    }
}