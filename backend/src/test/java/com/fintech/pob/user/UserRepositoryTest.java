package com.fintech.pob.user;

import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=none"
})
@Transactional
@Rollback(false) // 롤백 방지
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testCreateAndFindUser() {
        // Given
        UUID senderKey = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
        UUID receiverKey = UUID.fromString("987e6543-e21b-12d3-a456-426614174000");

        User sender = new User();
        sender.setUserId("sender");
        sender.setUserKey(senderKey);
        sender.setUserName("Sender User");
        sender.setUserPassword("password123");
        sender.setCreated(LocalDateTime.now());
        sender.setUpdated(LocalDateTime.now());
        sender.setSubscriptionType(1);

        User receiver = new User();
        receiver.setUserId("receiver");
        receiver.setUserKey(receiverKey);
        receiver.setUserName("Receiver User");
        receiver.setUserPassword("password456");
        receiver.setCreated(LocalDateTime.now());
        receiver.setUpdated(LocalDateTime.now());
        receiver.setSubscriptionType(2);

        // When
        userRepository.save(sender);
        userRepository.save(receiver);

        // Then
        Optional<User> foundSender = userRepository.findByUserKey(senderKey);
        Optional<User> foundReceiver = userRepository.findByUserKey(receiverKey);

        assertThat(foundSender).isPresent();
        assertThat(foundSender.get().getUserName()).isEqualTo("Sender User");

        assertThat(foundReceiver).isPresent();
        assertThat(foundReceiver.get().getUserName()).isEqualTo("Receiver User");
    }
}