package com.fintech.pob.domain.account.service.schedule;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduledCheckService {

    private final List<ScheduledChecker> checkers;

    public ScheduledCheckService(List<ScheduledChecker> checkers) {
        this.checkers = checkers;
    }

    @Scheduled(cron = "0 0 12 * * ?") // 매일 정오에 실행
    public void runScheduledChecks() {
        for (ScheduledChecker checker : checkers) {
            checker.check();
        }
    }
}
