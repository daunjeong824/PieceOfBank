package com.fintech.pob.domain.userToken.service;

import com.fintech.pob.domain.userToken.entity.UserToken;
import com.fintech.pob.domain.userToken.repository.UserTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserTokenServiceImpl implements UserTokenService {

    private final UserTokenRepository userTokenRepository;

    public UserTokenServiceImpl(UserTokenRepository userTokenRepository) {
        this.userTokenRepository = userTokenRepository;
    }

    @Override
    public void saveUserToken(UUID userKey, String token) {
        Optional<UserToken> existingToken = userTokenRepository.findByUserKey(userKey);

        if (existingToken.isPresent()) {
            UserToken userToken = existingToken.get();
            userToken.setToken(token);
            userToken.setCreated(LocalDateTime.now());
            userTokenRepository.save(userToken);
        } else {
            UserToken newUserToken = new UserToken(userKey, token);
            userTokenRepository.save(newUserToken);
        }
    }

    @Override
    public String getUserTokenByUserKey(UUID userKey) {
        return userTokenRepository.findByUserKey(userKey)
                .map(UserToken::getToken)
                .orElseThrow(() -> new IllegalArgumentException("유저의 푸시 토큰을 찾을 수 없습니다: " + userKey));
    }

    @Override
    public void deleteUserToken(UUID userKey) {
        userTokenRepository.findByUserKey(userKey).ifPresent(userTokenRepository::delete);
    }
}
