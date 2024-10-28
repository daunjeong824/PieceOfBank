package com.fintech.pob.domain.notification.entity;

import com.fintech.pob.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "sender_key", unique = false)
    private User senderUser;

    @ManyToOne
    @JoinColumn(name = "receiver_key", unique = false)
    private User receiverUser;

    @ManyToOne
    @JoinColumn(name = "notification_type_id", nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private LocalDateTime created;

    @Column(nullable = true)
    private LocalDateTime read_at;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus notificationStatus;

    @PrePersist
    protected void onCreate() {
        this.created = LocalDateTime.now();
    }

    @Builder
    public Notification(User senderUser, User receiverUser, NotificationType type, LocalDateTime created, NotificationStatus notificationStatus) {
        this.senderUser = senderUser;
        this.receiverUser = receiverUser;
        this.type = type;
        this.created = created;
        this.notificationStatus = notificationStatus;
    }
}
