package com.fintech.pob.domain.account.service.account;

import com.fintech.pob.domain.account.dto.client.*;
import com.fintech.pob.domain.account.dto.request.*;
import com.fintech.pob.domain.account.dto.transfer.TransferCheckDTO;
import com.fintech.pob.domain.account.service.transfer.TransferCheckResult;
import com.fintech.pob.domain.account.service.transfer.TransferCheckService;
import com.fintech.pob.domain.account.service.transfer.TransferEnumMapper;
import com.fintech.pob.domain.notification.service.NotificationService;
import com.fintech.pob.domain.pendinghistory.service.PendingHistoryService;
import com.fintech.pob.domain.subscription.entity.Subscription;
import com.fintech.pob.domain.subscription.service.SubscriptionService;
import com.fintech.pob.domain.transactionApproval.dto.TransactionApprovalRequestDto;
import com.fintech.pob.domain.transactionApproval.service.TransactionApprovalService;
import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.service.LocalUserService;
import com.fintech.pob.global.auth.jwt.JwtUtil;
import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import com.fintech.pob.global.header.service.HeaderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

    private final WebClient webClient;
    private final HttpServletRequest request;
    private final TransferCheckService transferCheckService;
    private final SubscriptionService subscriptionService;
    private final PendingHistoryService pendingHistoryService;
    private final NotificationService notificationService;
    private final HeaderService headerService;
    private final AccountClientService accountClientService;
    private final LocalUserService localUserService;
    private final JwtUtil jwtUtil;
    private final TransactionApprovalService transactionApprovalService;

    @EventListener
    public void handleAccountTransferEvent(AccountTransferEvent event) {
        AccountTransferRequestDTO requestPayload = event.getRequestPayload();
        handlePendingHistory(requestPayload)
                .doOnSuccess(response -> log.info("[Account Transfer Event] 계좌 이체 성공: ", response))
                .doOnError(error -> log.error("[Account Transfer Event] 계좌 이체 중 오류 발생: ", error))
                .subscribe();
    }

    @Transactional
    public Mono<ClientAccountCreationResponseDTO> createAccount(AccountCreationRequestDTO requestPayload) {
        HeaderRequestDTO header = (HeaderRequestDTO) request.getAttribute("header");

        ClientAccountCreationRequestDTO requestDTO = new ClientAccountCreationRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setAccountTypeUniqueNo(requestPayload.getAccountTypeUniqueNo());

        return webClient.post()
                .uri("demandDeposit/createDemandDepositAccount")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountCreationResponseDTO.class)
                .flatMap(response -> {
                    String userKey = header.getUserKey();
                    User user = localUserService.findByUserKey(userKey);
                    String accountNo = response.getRec().getAccountNo();
                    accountClientService.saveAccount(user, accountNo);
                    localUserService.updateAccountNo(user.getUserKey(), accountNo);
                    return Mono.just(response);
                });
    }

    public Mono<ClientAccountListResponseDTO> getAccountList() {
        HeaderRequestDTO header = (HeaderRequestDTO) request.getAttribute("header");

        ClientAccountListRequestDTO requestDTO = new ClientAccountListRequestDTO();
        requestDTO.setHeader(header);

        return webClient.post()
                .uri("demandDeposit/inquireDemandDepositAccountList")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountListResponseDTO.class);
    }

    public Mono<ClientAccountListResponseDTO> getSortedAccountList() {
        String token = request.getHeader("Authorization");

        // 유저 키 추출
        String userKeyString;
        try {
            userKeyString = jwtUtil.extractUserKey(token);
        } catch (Exception e) {
            return Mono.error(new RuntimeException("Unauthorized"));
        }

        if (userKeyString == null) {
            return Mono.error(new RuntimeException("Unauthorized"));
        }

        // 유저 정보 조회
        User user = localUserService.findByUserKey(userKeyString);
        String accountNo = user.getAccountNo();

        // 계좌 리스트 조회 및 정렬
        return getAccountList().map(accountListResponse -> {
            List<ClientAccountListResponseDTO.Record> sortedAccountList;

            if (accountNo != null && !accountNo.isEmpty()) {
                sortedAccountList = accountListResponse.getRec().stream()
                        .sorted((record1, record2) -> {
                            if (record1.getAccountNo().equals(accountNo)) {
                                return -1;
                            } else if (record2.getAccountNo().equals(accountNo)) {
                                return 1;
                            }
                            return 0;
                        })
                        .collect(Collectors.toList());
            } else {
                sortedAccountList = accountListResponse.getRec();
            }

            ClientAccountListResponseDTO sortedResponse = new ClientAccountListResponseDTO();
            sortedResponse.setHeader(accountListResponse.getHeader());
            sortedResponse.setRec(sortedAccountList);

            return sortedResponse;
        });
    }

    public Mono<ClientAccountListResponseDTO> getAccountList(HeaderRequestDTO header) {
        ClientAccountListRequestDTO requestDTO = new ClientAccountListRequestDTO();
        requestDTO.setHeader(header);

        return webClient.post()
                .uri("demandDeposit/inquireDemandDepositAccountList")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountListResponseDTO.class);
    }

    public Mono<ClientAccountHistoryListResponseDTO> getAccountHistoryList(AccountHistoryListRequestDTO requestPayload) {
        HeaderRequestDTO header = (HeaderRequestDTO) request.getAttribute("header");
        if (!Objects.equals(header.getApiName(), "inquireTransactionHistoryList")) {
            header = headerService.createCommonHeader("inquireTransactionHistoryList", header.getUserKey());
        }

        ClientAccountHistoryListRequestDTO requestDTO = ClientAccountHistoryListRequestDTO.of(header, requestPayload);

        return webClient.post()
                .uri("demandDeposit/inquireTransactionHistoryList")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountHistoryListResponseDTO.class);
    }

    public Mono<ClientAccountDetailResponseDTO> getAccountDetail(AccountDetailRequestDTO requestPayload) {
        HeaderRequestDTO header = (HeaderRequestDTO) request.getAttribute("header");

        ClientAccountDetailRequestDTO requestDTO = new ClientAccountDetailRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setAccountNo(requestPayload.getAccountNo());

        return webClient.post()
                .uri("demandDeposit/inquireDemandDepositAccount")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountDetailResponseDTO.class);
    }

    public Mono<ClientAccountDetailResponseDTO> getAccountDetail(AccountDetailRequestDTO requestPayload, HeaderRequestDTO header) {
        ClientAccountDetailRequestDTO requestDTO = new ClientAccountDetailRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setAccountNo(requestPayload.getAccountNo());

        return webClient.post()
                .uri("demandDeposit/inquireDemandDepositAccount")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountDetailResponseDTO.class);
    }

    public Mono<ClientAccountTransferResponseDTO> updateAccountTransfer(AccountTransferRequestDTO requestPayload) {
        HeaderRequestDTO header = (HeaderRequestDTO) request.getAttribute("header");

        Optional<Subscription> subscriptionOptional = subscriptionService.findByTargetUserKey(UUID.fromString(header.getUserKey()));
        if (subscriptionOptional.isPresent()) {
            UUID depositUserToken = accountClientService.findByAccountNo(requestPayload.getDepositAccountNo()).getUser().getUserKey();
            HeaderRequestDTO depositHeader = headerService.createCommonHeader("inquireDemandDepositAccount", depositUserToken.toString());
            Mono<ClientAccountDetailResponseDTO> accountDepositMono = getAccountDetail(new AccountDetailRequestDTO(requestPayload.getDepositAccountNo()), depositHeader);

            UUID withdrawalUserToken = accountClientService.findByAccountNo(requestPayload.getWithdrawalAccountNo()).getUser().getUserKey();
            HeaderRequestDTO withdrawalHeader = headerService.createCommonHeader("inquireDemandDepositAccount", withdrawalUserToken.toString());
            Mono<ClientAccountDetailResponseDTO> accountWithdrawMono = getAccountDetail(new AccountDetailRequestDTO(requestPayload.getWithdrawalAccountNo()), withdrawalHeader);

            return Mono.zip(accountDepositMono, accountWithdrawMono)
                    .flatMap(tuple -> {
                        ClientAccountDetailResponseDTO accountDeposit = tuple.getT1();
                        ClientAccountDetailResponseDTO accountWithdraw = tuple.getT2();

                        TransferCheckDTO transferCheckDTO = TransferCheckDTO.of(header.getUserKey(), requestPayload, accountDeposit, accountWithdraw);

                        return transferCheckService.checkTransfer(transferCheckDTO)
                                .flatMap(checkResult -> {
                                    log.info("--------------------------------------");
                                    log.info(String.valueOf(checkResult));
                                    log.info("--------------------------------------");

                                    if (checkResult != TransferCheckResult.SUCCESS) {
                                        // 알림 전송
                                        UUID senderKey = UUID.fromString(header.getUserKey());
                                        UUID receiverKey = subscriptionOptional.get().getProtectUser().getUserKey();
                                        String typeName = TransferEnumMapper.getNotificationMessage(checkResult);

                                        if (checkResult == TransferCheckResult.LIMIT || checkResult == TransferCheckResult.INACTIVITY) {
                                            // pendingHistory 추가
                                            User receiver = accountClientService.findByAccountNo(requestPayload.getDepositAccountNo()).getUser();
                                            TransactionApprovalRequestDto transactionApprovalRequestDto =
                                                    TransactionApprovalRequestDto.of(senderKey, receiverKey, receiver.getUserName(), requestPayload.getTransactionBalance());
                                            Long notiId = transactionApprovalService.requestTransfer(transactionApprovalRequestDto, typeName);
                                            pendingHistoryService.savePendingHistory(notiId, requestPayload);
                                        } else {
                                            notificationService.sendNotification(senderKey, receiverKey, typeName);
                                        }
                                        return Mono.error(new RuntimeException("Transfer failed: " + checkResult));
                                    }

                                    header.setApiName("updateDemandDepositAccountTransfer");
                                    ClientAccountTransferRequestDTO requestDTO = ClientAccountTransferRequestDTO.of(header, requestPayload);

                                    return webClient.post()
                                            .uri("demandDeposit/updateDemandDepositAccountTransfer")
                                            .accept(MediaType.APPLICATION_JSON)
                                            .bodyValue(requestDTO)
                                            .retrieve()
                                            .bodyToMono(ClientAccountTransferResponseDTO.class);
                                });
                    });
        }

        ClientAccountTransferRequestDTO requestDTO = ClientAccountTransferRequestDTO.of(header, requestPayload);

        return webClient.post()
                .uri("demandDeposit/updateDemandDepositAccountTransfer")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountTransferResponseDTO.class);
    }


    public Mono<ClientAccountTransferResponseDTO> handlePendingHistory(AccountTransferRequestDTO requestPayload) {
        String userKey = String.valueOf(accountClientService.findByAccountNo(requestPayload.getWithdrawalAccountNo()).getUser().getUserKey());
        HeaderRequestDTO header = headerService.createCommonHeader("updateDemandDepositAccountTransfer", userKey);

        ClientAccountTransferRequestDTO requestDTO = ClientAccountTransferRequestDTO.of(header, requestPayload);

        return webClient.post()
                .uri("demandDeposit/updateDemandDepositAccountTransfer")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountTransferResponseDTO.class);
    }

    public Mono<ClientAccountHistoryDetailResponseDTO> getAccountHistoryDetail(AccountHistoryDetailRequestDTO requestPayload) {
        HeaderRequestDTO header = (HeaderRequestDTO) request.getAttribute("header");

        ClientAccountHistoryDetailRequestDTO requestDTO = ClientAccountHistoryDetailRequestDTO.of(header, requestPayload);

        return webClient.post()
                .uri("demandDeposit/inquireTransactionHistory")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountHistoryDetailResponseDTO.class);
    }

    public Mono<ClientAccountDepositResponseDTO> updateAccountDeposit(AccountDepositRequestDTO requestPayload) {
        HeaderRequestDTO header = (HeaderRequestDTO) request.getAttribute("header");

        ClientAccountDepositRequestDTO requestDTO = ClientAccountDepositRequestDTO.of(header, requestPayload);

        return webClient.post()
                .uri("demandDeposit/updateDemandDepositAccountDeposit")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(ClientAccountDepositResponseDTO.class);
    }
}

