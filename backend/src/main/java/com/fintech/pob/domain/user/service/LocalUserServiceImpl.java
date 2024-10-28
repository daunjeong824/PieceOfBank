package com.fintech.pob.domain.user.service;

import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class LocalUserServiceImpl implements LocalUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void saveUser(UUID userKey, String userId, String userName, String userPassword, int userSubscriptionType) {
        User user = new User();
        if (userKey == null) {
            throw new IllegalArgumentException("userKey는 null이거나 비어 있을 수 없습니다.");
        }

        user.setUserKey(userKey);
        user.setUserName(userName);
        user.setUserId(userId);
        user.setUserPassword(userPassword);
        user.setSubscriptionType(userSubscriptionType);
        user.setAccountNo(null);


        userRepository.save(user);
    }

    @Override
    public User authenticate(String userId, String password) {
        return userRepository.findByUserIdAndUserPassword(userId, password);
    }

    @Override
    public User findByUserKey(String userKey) {
        return userRepository.findByUserKey(UUID.fromString(userKey))
                .orElseThrow(() -> new IllegalArgumentException("해당 userKey 찾을 수 없음"));
    }

    @Override
    public void updateAccountNo(UUID userKey, String accountNo) {
        log.info("----------{}------>{}", userKey.toString(), accountNo);
        User user = userRepository.findByUserKey(userKey)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setAccountNo(accountNo);
        userRepository.save(user);
        log.info("---------{}", user.toString());
    }

    @Override
    public Optional<User> getUserByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }


}
