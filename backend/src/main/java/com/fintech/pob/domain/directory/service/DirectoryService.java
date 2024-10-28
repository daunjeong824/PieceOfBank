package com.fintech.pob.domain.directory.service;


import com.fintech.pob.domain.directory.entity.DirectoryRequestDto;

import java.util.List;
import java.util.UUID;

public interface DirectoryService {

    public DirectoryRequestDto createDirectory(DirectoryRequestDto directoryDTO,UUID userKey );
    public List<DirectoryRequestDto> getDirectoryById(UUID userKey);
    public DirectoryRequestDto updateDirectory(Long id,DirectoryRequestDto directoryRequestDto);
    public void deleteDirectory(String accoutNo);
}
