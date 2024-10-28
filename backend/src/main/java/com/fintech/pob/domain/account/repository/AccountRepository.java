package com.fintech.pob.domain.account.repository;

import com.fintech.pob.domain.account.entity.Account;
import com.fintech.pob.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByUser(User user);
    Account findByAccountNo(String accountNo);
}
