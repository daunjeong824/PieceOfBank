package com.fintech.pob.domain.notification.service.expo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fintech.pob.domain.notification.dto.expo.ExpoNotificationMessageDto;
import com.fintech.pob.domain.notification.dto.expo.ExpoNotificationRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@Component
@Service
@RequiredArgsConstructor
public class ExpoServiceImpl implements ExpoService {

    @Value("${expo.api.url}")
    private String EXPO_API_URL;

    @Override
    public void sendPushNotification(ExpoNotificationRequestDto expoNotificationRequestDto) {
        // 메시지 객체 생성
        ExpoNotificationMessageDto message = new ExpoNotificationMessageDto(
                expoNotificationRequestDto.getTo(),
                expoNotificationRequestDto.getTitle(),
                expoNotificationRequestDto.getContent()
        );

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("Accept-Encoding", "gzip, deflate");


        // 메시지를 JSON 문자열로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        String messageJson;
        try {
            messageJson = objectMapper.writeValueAsString(message);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("메시지 변환 중 오류 발생", e);
        }

        // HTTP 요청 본문 설정
        HttpEntity<String> entity = new HttpEntity<>(messageJson, headers);
        RestTemplate restTemplate = new RestTemplate();
        try {
            restTemplate.postForEntity(EXPO_API_URL, entity, String.class);
        } catch (RestClientException e) {
            throw new RuntimeException("푸시 알림 전송 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
