package com.fintech.pob.domain.notification.service.fcm;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintech.pob.domain.notification.dto.fcm.FCMMessageDto;
import com.fintech.pob.domain.notification.dto.fcm.FCMRequestDto;
import com.google.auth.oauth2.GoogleCredentials;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@Service
@RequiredArgsConstructor
public class FCMServiceImpl implements FCMService {

    @Value("${fcm.key.path}")
    private String SERVICE_ACCOUNT_JSON;
    @Value("${fcm.api.url}")
    private String FCM_API_URL;

    private final WebClient webClient;

    /**
     * 푸시 메시지 처리를 수행하는 비즈니스 로직
     *
     * @param notificationRequestDto 모바일에서 전달받은 Object
     * @return 성공(1), 실패(0)
     */
    public Mono<Integer> sendMessageTo(FCMRequestDto notificationRequestDto) throws IOException {
        String message = makeMessage(notificationRequestDto);
        log.info("+++++++++{}", message);
        String accessToken = getAccessToken();

        return webClient.post()
                .uri(FCM_API_URL)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .bodyValue(message)
                .retrieve()
                .toBodilessEntity()
                .map(response -> response.getStatusCode().is2xxSuccessful() ? 1 : 0)
                .doOnError(e -> {

                    log.error("[-] FCM 전송 오류 :: " + e.getMessage());
                    log.error("[" + notificationRequestDto.getToken() + "]이 유효하지 않습니다");
                })
                .onErrorReturn(0);
    }

    /**
     * Firebase Admin SDK의 비공개 키를 참조하여 Bearer 토큰을 발급 받습니다.
     *
     * @return Bearer token
     */
    private String getAccessToken() throws IOException {
        GoogleCredentials googleCredentials = GoogleCredentials
                .fromStream(new ClassPathResource(SERVICE_ACCOUNT_JSON).getInputStream())
                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

        googleCredentials.refreshIfExpired();
        log.info("getAccessToken() - googleCredentials: {} ", googleCredentials.getAccessToken().getTokenValue());
        return googleCredentials.getAccessToken().getTokenValue();
    }

    /**
     * FCM 전송 정보를 기반으로 메시지를 구성합니다. (Object -> String)
     *
     * @param notificationRequestDto notificationRequestDto
     * @return String
     */
    private String makeMessage(FCMRequestDto notificationRequestDto) throws JsonProcessingException {
        ObjectMapper om = new ObjectMapper();
        FCMMessageDto fcmMessageDto = FCMMessageDto
                .builder()
                .message(FCMMessageDto.Message.builder()
                        .token(notificationRequestDto.getToken()) // 1:1 전송 시 대상 토큰
                        .notification(FCMMessageDto.Notification.builder()
                                .title(notificationRequestDto.getTitle())
                                .body(notificationRequestDto.getBody())
                                .image(null)
                                .build()
                        ).build())
                .validateOnly(false)
                .build();

        return om.writeValueAsString(fcmMessageDto);
    }
}
