package com.fintech.pob.domain.userToken.service;

import java.util.UUID;

public interface UserTokenService {
    void saveUserToken(UUID userKey, String token);
    String getUserTokenByUserKey(UUID userKey);
    void deleteUserToken(UUID userKey);
}
