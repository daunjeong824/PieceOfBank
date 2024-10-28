package com.fintech.pob.domain.userToken.repository;


import com.fintech.pob.domain.userToken.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {
    Optional<UserToken> findByUserKey(UUID userKey);
}
