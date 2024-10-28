package com.fintech.pob.domain.notification.service.fcm;

import com.fintech.pob.domain.notification.dto.fcm.FCMRequestDto;
import reactor.core.publisher.Mono;

import java.io.IOException;

public interface FCMService {
    Mono<Integer> sendMessageTo(FCMRequestDto notificationSendDto) throws IOException;
}
