package com.fintech.pob.domain.account.service.account;

import com.fintech.pob.domain.account.entity.Account;
import com.fintech.pob.domain.account.repository.AccountRepository;
import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.service.LocalUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountClientService {

    private final AccountRepository accountRepository;

    public void saveAccount(User user, String accountNo) {
        Account account = new Account();
        account.setUser(user);
        account.setAccountNo(accountNo);
        accountRepository.save(account);
    }

    public Account findByUser(User user) {
        return accountRepository.findByUser(user);
    }

    public Account findByAccountNo(String accountNo) {
        return accountRepository.findByAccountNo(accountNo);
    }
}
