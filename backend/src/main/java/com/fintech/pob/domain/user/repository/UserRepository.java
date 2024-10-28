package com.fintech.pob.domain.user.repository;

import com.fintech.pob.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserKey(UUID userKey);
    User findByUserIdAndUserPassword(String userId, String userPassword);
    Optional<User> findByUserId(String userId);
}


