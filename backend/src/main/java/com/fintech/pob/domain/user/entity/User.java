package com.fintech.pob.domain.user.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "user_key", unique = true, nullable = false, updatable = false)
    private UUID userKey;

    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;

    @Column(name = "user_password", nullable = false)
    private String userPassword;

    @Column(name = "created", nullable = false, updatable = false)
    private LocalDateTime created;

    @Column(name = "updated", nullable = false)
    private LocalDateTime updated;

    @Column(name = "subscription_type", nullable = false)
    private int subscriptionType;

    @Column(name = "account_number", nullable = true)
    private String accountNo;

    @PrePersist
    protected void onCreate() {
        this.created = LocalDateTime.now();
        this.updated = LocalDateTime.now(); // 최초 생성 시 updated 설정
    }

    @PreUpdate
    protected void onUpdate() {
        this.updated = LocalDateTime.now(); // 수정 시 updated 설정
    }

    @Override
    public String toString() {
        return "User{" +
                "userKey=" + userKey +
                ", userId='" + userId + '\'' +
                ", userName='" + userName + '\'' +
                ", userPassword='" + userPassword + '\'' +
                ", created=" + created +
                ", updated=" + updated +
                ", subscriptionType=" + subscriptionType +
                ", accountNo='" + accountNo + '\'' +
                '}';
    }
}
