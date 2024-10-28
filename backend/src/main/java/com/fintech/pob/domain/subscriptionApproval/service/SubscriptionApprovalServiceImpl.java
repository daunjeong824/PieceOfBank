package com.fintech.pob.domain.subscriptionApproval.service;

import com.fintech.pob.domain.notification.entity.Notification;
import com.fintech.pob.domain.notification.entity.NotificationStatus;
import com.fintech.pob.domain.notification.entity.NotificationType;
import com.fintech.pob.domain.notification.repository.NotificationRepository;
import com.fintech.pob.domain.notification.repository.NotificationTypeRepository;
import com.fintech.pob.domain.subscription.dto.SubscriptionRequestDto;
import com.fintech.pob.domain.subscription.entity.Subscription;
import com.fintech.pob.domain.subscription.service.SubscriptionService;
import com.fintech.pob.domain.subscriptionApproval.dto.SubscriptionApprovalKeyDto;
import com.fintech.pob.domain.subscriptionApproval.dto.SubscriptionApprovalRequestDto;
import com.fintech.pob.domain.subscriptionApproval.dto.SubscriptionApprovalResponseDto;
import com.fintech.pob.domain.subscriptionApproval.entity.SubscriptionApproval;
import com.fintech.pob.domain.subscriptionApproval.entity.SubscriptionApprovalStatus;
import com.fintech.pob.domain.subscriptionApproval.repository.SubscriptionApprovalRepository;
import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Component
@Service
@RequiredArgsConstructor
public class SubscriptionApprovalServiceImpl implements SubscriptionApprovalService {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationTypeRepository notificationTypeRepository;
    private final SubscriptionApprovalRepository subscriptionApprovalRepository;
    private final SubscriptionService subscriptionService;

    @Override
    @Transactional
    public Long requestSubscription(SubscriptionApprovalRequestDto subscriptionApprovalRequestDto) {

        NotificationType notificationType = notificationTypeRepository.findByTypeName("구독 신청 알림")
                .orElseThrow(() -> new IllegalArgumentException("Notification Type not found"));
        User receiver = userRepository.findByUserId(subscriptionApprovalRequestDto.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver user not found"));
        User sender = userRepository.findByUserKey(subscriptionApprovalRequestDto.getSenderKey())
                .orElseThrow(() -> new IllegalArgumentException("Sender user not found"));

        // Notification 생성
        Notification notification = Notification.builder()
                .senderUser(sender) // 자식이 구독 신청을 요청함
                .receiverUser(receiver)
                .type(notificationType)
                .created(LocalDateTime.now())
                .notificationStatus(NotificationStatus.UNREAD)
                .build();
        notificationRepository.save(notification);

        // SubscriptionApproval 생성
        SubscriptionApproval subscriptionApproval = SubscriptionApproval.builder()
                .notification(notification)
                .requesterName(sender.getUserName())
                .status(SubscriptionApprovalStatus.PENDING).build();
        SubscriptionApproval savedApproval = subscriptionApprovalRepository.save(subscriptionApproval);

        return savedApproval.getSubscriptionApprovalId();
    }

    @Override
    public SubscriptionApprovalResponseDto getSubscriptionApprovalByNotificationId(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        SubscriptionApproval subscriptionApproval = subscriptionApprovalRepository.findByNotification_NotificationId(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("구독 승인 알림 내역이 없습니다: " + notificationId));

        return SubscriptionApprovalResponseDto.builder()
                .subscriptionId(subscriptionApproval.getSubscriptionApprovalId())
                .requesterName(subscriptionApproval.getRequesterName())
                .userKey(notification.getSenderUser().getUserKey())
                .build();
    }

    @Override
    @Transactional
    public Subscription approveSubscriptionRequest(Long subscriptionApprovalId) {
        SubscriptionApproval subscriptionApproval = subscriptionApprovalRepository.findById(subscriptionApprovalId)
                .orElseThrow(() -> new IllegalArgumentException("Subscription Approval not found"));
        subscriptionApproval.setStatus(SubscriptionApprovalStatus.APPROVED);
        subscriptionApprovalRepository.save(subscriptionApproval);

        Notification notification = subscriptionApproval.getNotification();
        SubscriptionRequestDto subscriptionRequestDto = new SubscriptionRequestDto();
        subscriptionRequestDto.setUserKey(notification.getSenderUser().getUserKey());
        subscriptionRequestDto.setTargetKey(notification.getReceiverUser().getUserKey());
        Subscription subscription = subscriptionService.create(subscriptionRequestDto);

        notification.setNotificationStatus(NotificationStatus.READ); // 읽음 처리
        notificationRepository.save(notification);

        return subscription;
    }

    @Override
    public SubscriptionApprovalKeyDto refuseSubscriptionRequest(Long subscriptionApprovalId) {
        SubscriptionApproval subscriptionApproval = subscriptionApprovalRepository.findById(subscriptionApprovalId)
                .orElseThrow(() -> new IllegalArgumentException("Subscription Approval not found"));
        subscriptionApproval.setStatus(SubscriptionApprovalStatus.REFUSED);
        subscriptionApprovalRepository.save(subscriptionApproval);

        Notification notification = subscriptionApproval.getNotification();

        return SubscriptionApprovalKeyDto.builder()
                .protectKey(notification.getSenderUser().getUserKey())
                .targetKey(notification.getReceiverUser().getUserKey())
                .build();
    }

}
