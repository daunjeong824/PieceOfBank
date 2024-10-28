package com.fintech.pob.domain.directory.repository;

import com.fintech.pob.domain.directory.entity.Directory;
import com.fintech.pob.domain.media.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DirectoryRepository  extends JpaRepository<Directory,Long> {
    List<Directory> findByUser_UserKey(UUID userKey);
    Optional<Directory> findByAccountNo(String accountNo);

}
