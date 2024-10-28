package com.fintech.pob.domain.notification.dto.expo;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

/**
 * 모바일에서 전달받은 객체
 *
 */
@Slf4j
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ExpoNotificationRequestDto {
    private String to;
    private String title;
    private String content;
}
