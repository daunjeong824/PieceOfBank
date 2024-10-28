package com.fintech.pob.domain.user.service;

import com.fintech.pob.domain.user.entity.User;

import java.util.Optional;
import java.util.UUID;

public interface LocalUserService {
    void saveUser(UUID userKey, String userId, String userName, String userPassword, int userSubscriptionType);

    User authenticate(String userId, String password);

    User findByUserKey(String userKey);

    void updateAccountNo(UUID userKey, String accountNo);

    Optional<User> getUserByUserId(String userId);
}
