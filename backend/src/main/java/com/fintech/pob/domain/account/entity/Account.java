package com.fintech.pob.domain.account.entity;

import com.fintech.pob.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @ManyToOne
    @JoinColumn(name = "user_key", nullable = false)
    private User user;

    @Column(name = "accountNo", nullable = false)
    private String accountNo;
}
