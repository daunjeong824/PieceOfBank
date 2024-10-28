package com.fintech.pob.domain.account.controller;

import com.fintech.pob.domain.account.dto.client.*;
import com.fintech.pob.domain.account.dto.request.*;
import com.fintech.pob.domain.account.service.account.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/account/client")
public class ClientAccountController {

    private final AccountService accountService;

    @PostMapping("/createDemandDepositAccount")
    public Mono<ResponseEntity<ClientAccountCreationResponseDTO>> createClientAccount(
            @RequestBody AccountCreationRequestDTO requestPayload) {
        return accountService.createAccount(requestPayload)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/inquireDemandDepositAccountList")
    public Mono<ResponseEntity<ClientAccountListResponseDTO>> getClientAccountList(HttpServletRequest request) {
        return accountService.getSortedAccountList()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null)));
    }

    @PostMapping("/inquireDemandDepositAccount")
    public Mono<ResponseEntity<ClientAccountDetailResponseDTO>> getClientAccountDetail(
            @RequestBody AccountDetailRequestDTO requestPayload) {
        return accountService.getAccountDetail(requestPayload)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/updateDemandDepositAccountTransfer")
    public Mono<ResponseEntity<ClientAccountTransferResponseDTO>> updateClientAccountTransfer(
            @RequestBody AccountTransferRequestDTO requestPayload) {
        return accountService.updateAccountTransfer(requestPayload)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/inquireTransactionHistoryList")
    public Mono<ResponseEntity<ClientAccountHistoryListResponseDTO>> getClientAccountHistoryList(
            @RequestBody AccountHistoryListRequestDTO requestPayload) {
        return accountService.getAccountHistoryList(requestPayload)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/inquireTransactionHistory")
    public Mono<ResponseEntity<ClientAccountHistoryDetailResponseDTO>> getClientAccountHistoryDetail(
            @RequestBody AccountHistoryDetailRequestDTO requestPayload) {
        return accountService.getAccountHistoryDetail(requestPayload)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/updateDemandDepositAccountDeposit")
    public Mono<ResponseEntity<ClientAccountDepositResponseDTO>> updateClientAccountDeposit(
            @RequestBody AccountDepositRequestDTO requestPayload) {
        return accountService.updateAccountDeposit(requestPayload)
                .map(ResponseEntity::ok);
    }

}
