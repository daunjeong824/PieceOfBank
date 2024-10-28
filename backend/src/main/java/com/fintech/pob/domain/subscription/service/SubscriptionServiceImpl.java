package com.fintech.pob.domain.subscription.service;

import com.fintech.pob.domain.notification.service.NotificationService;
import com.fintech.pob.domain.subscription.dto.SubscriptionRequestDto;
import com.fintech.pob.domain.subscription.entity.Subscription;
import com.fintech.pob.domain.subscription.repository.SubscriptionRepository;
import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.repository.UserRepository;
import com.fintech.pob.domain.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor

public class SubscriptionServiceImpl implements SubscriptionService{

    private final UserService userService;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final NotificationService notificationService;

    @Override
    public Subscription create(SubscriptionRequestDto dto) {

        User protectUser = userRepository.findByUserKey(dto.getUserKey()).orElse(null);
        User targetUser = userRepository.findByUserKey(dto.getTargetKey()).orElse(null);

        Subscription subscription = new Subscription();
        subscription.setProtectUser(protectUser);
        subscription.setTargetUser(targetUser);
        subscriptionRepository.save(subscription);
        return subscription;
    }



    @Override
    public Optional<Subscription> findByTargetUserKey(UUID userKey) {
        return subscriptionRepository.findByTargetUser_UserKey(userKey);
    }

    @Override
    public Subscription update(UUID userKey) {
        return null;
    }

    @Override
    public List<Subscription> findAll() {
        return subscriptionRepository.findAll();
    }

    @Override
    public void delete(UUID userKey) {

//        Subscription subscription = subscriptionRepository.findOne(userKey);
//        subscriptionRepository.delete(subscription);
    }

    @Override
    @Transactional
    public void setOneTimeTransferLimit(UUID userKey,Long limit) {

        Subscription subscription  = subscriptionRepository.findByProtectUserUserKey(userKey);
        subscription.setOneTimeTransferLimit(limit);

        subscriptionRepository.save(subscription);

       // notificationService.sendNotification(userKey, subscription.getProtectUser().getUserKey(), "한도 변경 알림");
    }

    @Override
    @Transactional
    public void setDailyTransferLimit(UUID userKey,Long limit) {

        Subscription subscription  =subscriptionRepository.findByProtectUserUserKey(userKey);
        subscription.setDailyTransferLimit(limit);
        subscriptionRepository.save(subscription);

      //  notificationService.sendNotification(userKey, subscription.getProtectUser().getUserKey(), "한도 변경 알림");
    }

@Override
    public Long getOneTimeTransferLimit(UUID userKey) {
        Subscription subscription = subscriptionRepository.findByTargetUserUserKey(userKey);
        return subscription.getOneTimeTransferLimit();
    }

    @Override
    public Long getDailyTransferLimit(UUID userKey) {
        Subscription subscription = subscriptionRepository.findByTargetUserUserKey(userKey);
        return subscription.getDailyTransferLimit();
    }

    @Override
    public Subscription getSubscriptionByProtectUserKey(UUID userKey) {
        return subscriptionRepository.findByProtectUserUserKey(userKey);
    }

    @Override
    public Subscription getSubscriptionByTargetUserKey(UUID userKey) {
        return subscriptionRepository.findByTargetUserUserKey(userKey);
    }

}
