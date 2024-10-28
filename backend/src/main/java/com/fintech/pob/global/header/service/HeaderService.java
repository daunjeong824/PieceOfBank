package com.fintech.pob.global.header.service;


import com.fintech.pob.global.header.dto.HeaderRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class HeaderService {

    private final AtomicInteger serialNumber = new AtomicInteger(1);

    @Value("${api.key}")
    private String apiKey;

    public HeaderRequestDTO createCommonHeader(String apiName, String userKey) {
        HeaderRequestDTO header = new HeaderRequestDTO();
        LocalDateTime now = LocalDateTime.now();
        header.setApiName(apiName);
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionCode("00100");
        header.setFintechAppNo("001");
        header.setApiServiceCode(apiName);
        header.setInstitutionTransactionUniqueNo(generateTransactionUniqueNo(now));
        header.setApiKey(apiKey);
        header.setUserKey(userKey);

        return header;
    }

    private String generateTransactionUniqueNo(LocalDateTime now) {
        return now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + String.format("%06d", serialNumber.getAndIncrement());
    }
}
