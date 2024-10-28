package com.fintech.pob.domain.transactionApproval.service;

import com.fintech.pob.domain.transactionApproval.dto.TransactionApprovalRequestDto;
import com.fintech.pob.domain.transactionApproval.dto.TransactionApprovalResponseDto;

public interface TransactionApprovalService {
    Long requestTransfer(TransactionApprovalRequestDto transactionApprovalRequestDto, String typeName);
    TransactionApprovalResponseDto approveTransferRequest(Long transactionApprovalId);
    TransactionApprovalResponseDto refuseTransferRequest(Long transactionApprovalId);
    TransactionApprovalResponseDto expireTransferRequest(Long transactionApprovalId);
}
