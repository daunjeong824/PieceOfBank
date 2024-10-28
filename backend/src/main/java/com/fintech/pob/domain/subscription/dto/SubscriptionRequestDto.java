package com.fintech.pob.domain.subscription.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class SubscriptionRequestDto {

    UUID userKey;
    UUID targetKey;

}
