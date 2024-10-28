
export interface account {
    accountBalance: number, 
    accountCreatedDate: string, 
    accountExpiryDate: string, 
    accountName: string, 
    accountNo: string 
    accountTypeCode: string, 
    accountTypeName: string, 
    bankCode: string, 
    bankName: string, 
    currency: string, 
    dailyTransferLimit: number, 
    lastTransactionDate: string, 
    oneTimeTransferLimit: number, 
    username: null | string
}

    /*
    accountId: number,
    userKey: string, // 필요한가?
    bankId: number, // 필요한가?
    
    accountNo: string,
    accountName: string,
    accountBalance: number,
    dailyTransferLimit: number,
    oneTimeTransferLimit: number,
    currency: string,

    accountCreatedDate: string,
    accountExperityDate: string,
    lastTranscationDate: string,
    */

// < 추가 구현 > - 계좌에서 돈 계산하는 함수