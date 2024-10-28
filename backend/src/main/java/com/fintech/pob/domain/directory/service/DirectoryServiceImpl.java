package com.fintech.pob.domain.directory.service;

import com.fintech.pob.domain.account.entity.Account;
import com.fintech.pob.domain.account.service.account.AccountClientService;
import com.fintech.pob.domain.directory.entity.Directory;
import com.fintech.pob.domain.directory.entity.DirectoryRequestDto;
import com.fintech.pob.domain.directory.repository.DirectoryRepository;
import com.fintech.pob.domain.user.entity.User;
import com.fintech.pob.domain.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class DirectoryServiceImpl implements  DirectoryService{


    private final DirectoryRepository directoryRepository;
    private final UserRepository userRepository;
    private final AccountClientService accountService;
    @Override
    public DirectoryRequestDto createDirectory(DirectoryRequestDto directoryDTO,UUID userKey ) {

        Directory directory = new Directory();
        directory.setAccountNo(directoryDTO.getAccount());
        directory.setInstitutionCode(Integer.parseInt(directoryDTO.getBank()));
        directory.setName(directoryDTO.getName());
        directory.setUrl("");
        System.out.println();
        System.out.println();
        System.out.println("account Number " +directoryDTO.getAccount());
        System.out.println();
        System.out.println();
        directory.setUser(userRepository.findByUserKey(userKey).orElse(null));

        Directory savedDirectory = directoryRepository.save(directory);
        return directoryDTO;
    }

    @Override
    public List<DirectoryRequestDto> getDirectoryById(UUID userKey) {
        List<Directory> directories = directoryRepository.findByUser_UserKey(userKey);
        List<DirectoryRequestDto> directoryDtos = new ArrayList<>();


        //UUID targetKey =UUID.fromString(accountService.findByAccountNo())


        for (Directory directory : directories) {
            DirectoryRequestDto dto = new DirectoryRequestDto();

            Account account = accountService.findByAccountNo(directory.getAccountNo());

            UUID u = account.getUser().getUserKey();
            dto.setProtectKey(String.valueOf(u));
            //  dto.setDirectoryId(directory.getDirectoryId());
            dto.setAccount(directory.getAccountNo());
            //    dto.setBank((directory.getInstitutionCode()));
            dto.setName(directory.getName());
            //    dto.setUrl(directory.getUrl());


            directoryDtos.add(dto);
        }
        return directoryDtos;
    }


    @Override
    public DirectoryRequestDto updateDirectory(Long id,DirectoryRequestDto directoryRequestDto) {
        return null;
    }

    @Override
    public void deleteDirectory(String accountNo) {

      Directory directory= directoryRepository.findByAccountNo(accountNo).orElse(null);

        directoryRepository.delete(directory);

    }
}
