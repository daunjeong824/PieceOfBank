package com.fintech.pob.domain.transactionApproval.controller;

import com.fintech.pob.domain.transactionApproval.dto.TransactionApprovalRequestDto;
import com.fintech.pob.domain.transactionApproval.service.TransactionApprovalService;
import com.fintech.pob.domain.transactionApproval.dto.TransactionApprovalResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/transfers")
public class TransactionApprovalController {

    private final TransactionApprovalService transactionApprovalService;

    public TransactionApprovalController(TransactionApprovalService transactionApprovalService) {
        this.transactionApprovalService = transactionApprovalService;
    }

    @PostMapping("/request")
    public ResponseEntity<Long> requestTransfer(@RequestBody TransactionApprovalRequestDto transactionApprovalRequestDto, @RequestParam("typeName") String typeName) {
        Long transactionApprovalId = transactionApprovalService.requestTransfer(transactionApprovalRequestDto, typeName);
        return ResponseEntity.ok(transactionApprovalId);
    }

    @PatchMapping("/approval")
    public ResponseEntity<TransactionApprovalResponseDto> approveTransferRequest(@RequestBody Long notificationId) {
        TransactionApprovalResponseDto transactionApprovalResponseDto = transactionApprovalService.approveTransferRequest(notificationId);
        return ResponseEntity.ok(transactionApprovalResponseDto);
    }

    @PatchMapping("/refusal")
    public ResponseEntity<TransactionApprovalResponseDto> refuseTransferRequest(@RequestBody Long notificationId) {
        TransactionApprovalResponseDto transactionApprovalResponseDto = transactionApprovalService.refuseTransferRequest(notificationId);
        return ResponseEntity.ok(transactionApprovalResponseDto);
    }

    @PatchMapping("/expiry")
    public ResponseEntity<TransactionApprovalResponseDto> expireTransferRequest(@RequestBody Long transactionApprovalId) {
        TransactionApprovalResponseDto transactionApprovalResponseDto = transactionApprovalService.expireTransferRequest(transactionApprovalId);
        return ResponseEntity.ok(transactionApprovalResponseDto);
    }
}
