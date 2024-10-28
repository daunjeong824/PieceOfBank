package com.fintech.pob.domain.subscription.service;


import com.fintech.pob.domain.subscription.dto.SubscriptionRequestDto;
import com.fintech.pob.domain.subscription.entity.Subscription;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubscriptionService {

    Subscription create(SubscriptionRequestDto subscriptionRequestDto);


    Optional<Subscription> findByTargetUserKey(UUID userKey);

    Subscription update(UUID userKey);
    List<Subscription> findAll();
    void delete(UUID userKey);
    Subscription getSubscriptionByTargetUserKey(UUID userKey);
    Subscription getSubscriptionByProtectUserKey(UUID userKey);
    void setOneTimeTransferLimit(UUID userKey,Long limit);
    void setDailyTransferLimit(UUID userKey,Long limit);
    Long getOneTimeTransferLimit(UUID userKey);
    Long getDailyTransferLimit(UUID userKey);
}
