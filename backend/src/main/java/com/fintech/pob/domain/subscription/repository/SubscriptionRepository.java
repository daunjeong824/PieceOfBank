package com.fintech.pob.domain.subscription.repository;

import com.fintech.pob.domain.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByTargetUser_UserKey(UUID userKey);

    Subscription findByProtectUserUserKey(UUID userKey);
    Subscription findByTargetUserUserKey(UUID userKey);
}
