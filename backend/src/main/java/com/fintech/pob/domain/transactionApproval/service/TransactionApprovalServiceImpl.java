package com.fintech.pob.domain.transactionApproval.service;

import com.fintech.pob.domain.notification.dto.expo.ExpoNotificationRequestDto;
import com.fintech.pob.domain.notification.entity.Notification;
import com.fintech.pob.domain.notification.entity.NotificationStatus;
import com.fintech.pob.domain.notification.entity.NotificationType;
import com.fintech.pob.domain.notification.repository.NotificationRepository;
import com.fintech.pob.domain.notification.repository.NotificationTypeRepository;
import com.fintech.pob.domain.notification.service.expo.ExpoService;
import com.fintech.pob.domain.pendinghistory.service.PendingHistoryService;
import com.fintech.pob.domain.transactionApproval.repository.TransactionApprovalRepository;
import com.fintech.pob.domain.transactionApproval.dto.TransactionApprovalRequestDto;
import com.fintech.pob.domain.transactionApproval.dto.TransactionApprovalResponseDto;
import com.fintech.pob.domain.transactionApproval.entity.TransactionApproval;
import com.fintech.pob.domain.transactionApproval.entity.TransactionApprovalStatus;
import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.repository.UserRepository;
import com.fintech.pob.domain.userToken.service.UserTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Component
@Service
@RequiredArgsConstructor
public class TransactionApprovalServiceImpl implements TransactionApprovalService {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationTypeRepository notificationTypeRepository;
    private final TransactionApprovalRepository transactionApprovalRepository;
    private final UserTokenService userTokenService;
    private final ExpoService expoService;
    private final PendingHistoryService pendingHistoryService;

    @Override
    @Transactional
    public Long requestTransfer(TransactionApprovalRequestDto transactionApprovalRequestDto, String typeName) {
        NotificationType notificationType;
        if (typeName.equals("한도 초과 알림")) {
            notificationType = notificationTypeRepository.findByTypeName("한도 초과 알림")
                    .orElseThrow(() -> new IllegalArgumentException("한도 초과 알림 타입이 없습니다."));
        } else if (typeName.equals("계좌 비활성 알림")) {
            notificationType = notificationTypeRepository.findByTypeName("계좌 비활성 알림")
                    .orElseThrow(() -> new IllegalArgumentException("계좌 비활성 알림 타입이 없습니다."));
        }
        else {
            throw new IllegalArgumentException("잘못된 알림 타입입니다: " + typeName);
        }

        User sender = userRepository.findByUserKey(transactionApprovalRequestDto.getSenderKey())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findByUserKey(transactionApprovalRequestDto.getReceiverKey())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        // Notification 생성
        Notification notification = Notification.builder()
                .senderUser(sender)
                .receiverUser(receiver)
                .type(notificationType)
                .created(LocalDateTime.now())
                .notificationStatus(NotificationStatus.UNREAD)
                .build();
        notificationRepository.save(notification);

        // TransactionApproval 생성
        TransactionApproval transactionApproval = TransactionApproval.builder()
                .notification(notification)
                .receiverName(transactionApprovalRequestDto.getReceiverName())
                .amount(transactionApprovalRequestDto.getAmount())
                .transactionApprovalStatus(TransactionApprovalStatus.PENDING)
                .build();
        TransactionApproval savedApproval = transactionApprovalRepository.save(transactionApproval);

        // 푸시 알림 보내기
        sendPushMessage(receiver.getUserKey(), typeName, "거래 승인 알림이 도착했습니다!");

        return savedApproval.getTransactionApprovalId();
    }

    private void sendPushMessage(UUID userKey, String typeName, String content) {
        String to = userTokenService.getUserTokenByUserKey(userKey);

        ExpoNotificationRequestDto expoNotificationRequestDto = ExpoNotificationRequestDto.builder()
                .to(to)
                .title(typeName)
                .content(content)
                .build();
        expoService.sendPushNotification(expoNotificationRequestDto);
    }

    @Override
    @Transactional
    public TransactionApprovalResponseDto approveTransferRequest(Long notificationId) {
        Long transactionApprovalId = getTransactionApprovalIdByNotificationId(notificationId);
        TransactionApproval transactionApproval = transactionApprovalRepository.findById(transactionApprovalId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction Approval not found"));
        transactionApproval.setStatus(TransactionApprovalStatus.APPROVED);
        transactionApprovalRepository.save(transactionApproval);

        Notification notification = transactionApproval.getNotification();
        notification.setNotificationStatus(NotificationStatus.READ); // 읽음 처리
        notificationRepository.save(notification);

        try {
            pendingHistoryService.approvePendingHistory(notificationId);
        } catch (Exception e) {
            throw new RuntimeException("Pending history approval failed", e);
        }

        // 거래 완료 푸시 알림 전송(자식 -> 부모)
        User target = userRepository.findByUserKey(notification.getSenderUser().getUserKey())
                .orElseThrow(() -> new IllegalArgumentException("TargetKey(parent) not found"));
        sendPushMessage(target.getUserKey(), "거래 승인 알림", "보호자가 거래를 승인했습니다.");

        return TransactionApprovalResponseDto.builder()
                .senderKey(notification.getSenderUser().getUserKey())
                .receiverKey(notification.getReceiverUser().getUserKey())
                .receiverName(transactionApproval.getReceiverName())
                .amount(transactionApproval.getAmount())
                .status(transactionApproval.getStatus())
                .build();
    }

    @Override
    public TransactionApprovalResponseDto refuseTransferRequest(Long notificationId) {
        Long transactionApprovalId = getTransactionApprovalIdByNotificationId(notificationId);
        TransactionApproval transactionApproval = transactionApprovalRepository.findById(transactionApprovalId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction Refusal not found"));
        transactionApproval.setStatus(TransactionApprovalStatus.REFUSED);
        transactionApprovalRepository.save(transactionApproval);

        Notification notification = transactionApproval.getNotification();

        try {
            pendingHistoryService.refusePendingHistory(notificationId);
        } catch (Exception e) {
            throw new RuntimeException("Pending history approval failed", e);
        }

        // 거래 완료 푸시 알림 전송(자식 -> 부모)
        User target = userRepository.findByUserKey(notification.getSenderUser().getUserKey())
                .orElseThrow(() -> new IllegalArgumentException("TargetKey(parent) not found"));
        sendPushMessage(target.getUserKey(), "거래 거절 알림", "보호자가 거래를 거절했습니다.");

        return TransactionApprovalResponseDto.builder()
                .senderKey(notification.getSenderUser().getUserKey())
                .receiverKey(notification.getReceiverUser().getUserKey())
                .receiverName(transactionApproval.getReceiverName())
                .amount(transactionApproval.getAmount())
                .status(transactionApproval.getStatus())
                .build();
    }

    public Long getTransactionApprovalIdByNotificationId(Long notificationId) {
        return transactionApprovalRepository.findTransactionApprovalIdByNotificationId(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("No transaction approval found for notificationId: " + notificationId));
    }

    @Override
    public TransactionApprovalResponseDto expireTransferRequest(Long transactionApprovalId) {
        TransactionApproval transactionApproval = transactionApprovalRepository.findById(transactionApprovalId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction Expiry not found"));
        transactionApproval.setStatus(TransactionApprovalStatus.EXPIRED);
        transactionApprovalRepository.save(transactionApproval);

        Notification notification = transactionApproval.getNotification();

        return TransactionApprovalResponseDto.builder()
                .senderKey(notification.getSenderUser().getUserKey())
                .receiverKey(notification.getReceiverUser().getUserKey())
                .receiverName(transactionApproval.getReceiverName())
                .amount(transactionApproval.getAmount())
                .status(transactionApproval.getStatus())
                .build();
    }
}
