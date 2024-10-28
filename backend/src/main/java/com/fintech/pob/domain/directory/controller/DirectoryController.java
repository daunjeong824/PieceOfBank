package com.fintech.pob.domain.directory.controller;

import com.fintech.pob.domain.account.service.account.AccountClientService;
import com.fintech.pob.domain.account.service.account.AccountService;
import com.fintech.pob.domain.directory.entity.Directory;
import com.fintech.pob.domain.directory.entity.DirectoryRequestDto;
import com.fintech.pob.domain.directory.repository.DirectoryRepository;
import com.fintech.pob.domain.directory.service.DirectoryService;
import com.fintech.pob.domain.media.service.MediaService;
import com.fintech.pob.domain.media.service.MediaUploadService;
import com.fintech.pob.domain.subscription.entity.Subscription;
import com.fintech.pob.domain.subscription.service.SubscriptionService;
import com.fintech.pob.domain.user.service.UserServiceImpl;
import com.fintech.pob.global.auth.jwt.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/directory")
@AllArgsConstructor
public class DirectoryController {


    private final DirectoryService directoryService;
    private final MediaUploadService mediaUploadService;
    private final DirectoryRepository directoryRepository;
    private final SubscriptionService subscriptionService;
    private final JwtUtil jwtUtil;
    private final AccountClientService accountService;
    @PostMapping("/create")
    public ResponseEntity<DirectoryRequestDto> createDirectory(
            @RequestParam("name") String name,
            @RequestParam("phone") String phone,
            @RequestParam("bank") String bank,
            @RequestParam("account") String account,
            @RequestHeader("Authorization") String token
    ) throws IOException {


        try {
            String key = (String) jwtUtil.extractUserKey(token);
            DirectoryRequestDto directoryDTO = new DirectoryRequestDto();
            UUID userKey = UUID.fromString(key);

            // Attempt to fetch the subscription
            Subscription subscription = subscriptionService.getSubscriptionByProtectUserKey(userKey);
            if (subscription == null) {
                // If no subscription is found, return a 404 response
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null); // Optionally, you can return a message or error DTO
            }

            UUID parentKey = subscription.getTargetUser().getUserKey();

            directoryDTO.setAccount(account);
            directoryDTO.setName(name);
            directoryDTO.setPhone(phone);
            directoryDTO.setBank(bank);

            DirectoryRequestDto createdDirectory = directoryService.createDirectory(directoryDTO, parentKey);
            return ResponseEntity.ok(createdDirectory);
        } catch (NoSuchElementException e) {
            // This handles case when user or subscription not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null); // Optionally, include an error message
        } catch (Exception e) {
            // Catch-all for any other exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // You can include more details about the error
        }
//  //      String url = mediaUploadService.uploadFile(file);
//        String key = (String) jwtUtil.extractUserKey(token);
//
//
//        DirectoryRequestDto directoryDTO= new DirectoryRequestDto();
//
//        UUID userKey = UUID.fromString(key);
//
//        Subscription subscription= subscriptionService.getSubscriptionByProtectUserKey(userKey);
//
//        System.out.println("자식 정보(구독관계에서가져옴)");
//        System.out.println(subscription);
//
//        UUID parentKey = subscription.getTargetUser().getUserKey();
//
//        directoryDTO.setAccount(account);
//        System.out.println(account);
//        directoryDTO.setName(name);
//        directoryDTO.setPhone(phone);
//        directoryDTO.setBank(bank);
//
//        System.out.println("parentkey: "+parentKey);
//
//        directoryDTO.setUserKey(userKey);
//        DirectoryRequestDto createdDirectory = directoryService.createDirectory(directoryDTO, parentKey);
//        return ResponseEntity.ok(createdDirectory);
    }


    @GetMapping("/find")
    public ResponseEntity<List<DirectoryRequestDto>> getDirectoryById(@RequestHeader("Authorization") String token) {
        String key = (String) jwtUtil.extractUserKey(token);
        UUID userKey = UUID.fromString(key);


        List<DirectoryRequestDto> directoryDTO = directoryService.getDirectoryById(userKey);



        return ResponseEntity.ok(directoryDTO);
    }

    @GetMapping("/findUserImage")
    public ResponseEntity<Resource> findMedia(
            @RequestParam("accountNo") String accountNo) {
        Optional<Directory> media = directoryRepository.findByAccountNo(accountNo);
        if (media.isPresent()) {
            try {
                String mediaUrl = media.get().getUrl();
                log.info(mediaUrl);
                Path filePath = Paths.get(mediaUrl);
                Resource resource = (Resource) new UrlResource(filePath.toUri());
                if (resource.exists() || resource.isReadable()) {

                    String contentType = Files.probeContentType(filePath);
                    if (contentType == null) {
                        contentType = "application/octet-stream"; // 기본 MIME 타입 설정
                    }

                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(contentType))
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                            .body(resource);

                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                }

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }


    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DirectoryRequestDto> updateDirectory(
            @PathVariable Long id,
            @RequestBody DirectoryRequestDto directoryDTO,
            @RequestHeader("Authorization") String token
    ) {

        String key = (String) jwtUtil.extractUserKey(token);
        UUID userKey = UUID.fromString(key);
        directoryDTO.setUserKey(userKey);
        DirectoryRequestDto updatedDirectory = directoryService.updateDirectory(id, directoryDTO);
        return ResponseEntity.ok(updatedDirectory);
    }


    @DeleteMapping("/delete/{accountNo}")
    public ResponseEntity<Void> deleteDirectory(@PathVariable String accountNo) {
        directoryService.deleteDirectory(accountNo);
        return ResponseEntity.noContent().build();
    }
}
