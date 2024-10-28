package com.fintech.pob.domain.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
    private String userKey;
    private String userId;
    private String userName;
    private String userPassword;
    private int userSubscriptionType;
}
