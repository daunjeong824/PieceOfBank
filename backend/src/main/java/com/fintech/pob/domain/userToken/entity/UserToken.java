package com.fintech.pob.domain.userToken.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID userKey;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private LocalDateTime created;

    public UserToken(UUID userKey, String token) {
        this.userKey = userKey;
        this.token = token;
        this.created = LocalDateTime.now();
    }
}


