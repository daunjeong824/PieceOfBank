package com.fintech.pob.domain.directory.entity;

import lombok.Data;

import java.util.UUID;

@Data
public class DirectoryRequestDto {
  //  private Long directoryId;
    private UUID userKey;
    private String account;
    private String name;
    private String bank;
    private String phone;
    private String protectKey;
}
