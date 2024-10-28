package com.fintech.pob.domain.subscription.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewLimitRequestDto {
    private Long newLimit;
}