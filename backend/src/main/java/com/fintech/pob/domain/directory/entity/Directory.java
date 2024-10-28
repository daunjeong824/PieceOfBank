package com.fintech.pob.domain.directory.entity;

import com.fintech.pob.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "directory")
@Data
@NoArgsConstructor
public class Directory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "directory_id")
    private Long directoryId;

    @ManyToOne
    @JoinColumn(name = "user_key", referencedColumnName = "user_key", nullable = false)
    private User user;

    @Column(name = "account_no", nullable = false)
    private String accountNo;

    @Column(name = "institution_code", nullable = false)
    private Integer institutionCode;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "created", nullable = false, updatable = false)
    private LocalDateTime created;


    @Column(name = "updated", nullable = false)
    private LocalDateTime updated;

    @Column(name = "url", nullable = true)
    private String url;

    @PrePersist
    protected void onCreate() {
        this.created = LocalDateTime.now();
        this.updated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updated = LocalDateTime.now();
    }
}