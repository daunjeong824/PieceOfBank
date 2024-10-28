package com.fintech.pob.domain.userToken.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserTokenRequestDto {
    private UUID userKey;
    private String token;
}