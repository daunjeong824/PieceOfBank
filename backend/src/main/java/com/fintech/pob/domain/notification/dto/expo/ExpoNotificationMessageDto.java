package com.fintech.pob.domain.notification.dto.expo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExpoNotificationMessageDto {
    private String to;
    private String title;
    private String body;

    public ExpoNotificationMessageDto(String to, String title, String body) {
        this.to = to;
        this.title = title;
        this.body = body;
    }
}
