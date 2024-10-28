package com.fintech.pob.domain.notification.service.initializer;

import com.fintech.pob.domain.notification.entity.NotificationType;
import com.fintech.pob.domain.notification.repository.NotificationTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initNotificationTypes(NotificationTypeRepository notificationTypeRepository) {
        return args -> {
            if (notificationTypeRepository.count() == 0) {
                // (1) 구독 관계 관련 알림
                notificationTypeRepository.save(new NotificationType(null, "구독 신청 알림"));
                notificationTypeRepository.save(new NotificationType(null, "한도 변경 알림"));
                // (2) 3일 동안 거래 내역 없을 때 보호자에게 알림
                notificationTypeRepository.save(new NotificationType(null, "거래 내역 없음 알림"));
                // (3) 계좌 이체할 때 보호자에게 알림
                notificationTypeRepository.save(new NotificationType(null, "잔액 부족 알림"));
                notificationTypeRepository.save(new NotificationType(null, "한도 초과 알림"));
                notificationTypeRepository.save(new NotificationType(null, "계좌 비활성 알림"));
            }
        };
    }
}

