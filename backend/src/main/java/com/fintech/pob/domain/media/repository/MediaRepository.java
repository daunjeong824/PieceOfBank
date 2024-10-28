package com.fintech.pob.domain.media.repository;

import com.fintech.pob.domain.media.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media,Long> {
    Optional<Media> findByTransactionUniqueNo(Long transactionUniqueNo);

}
