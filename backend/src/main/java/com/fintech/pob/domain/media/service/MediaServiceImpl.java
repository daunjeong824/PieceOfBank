package com.fintech.pob.domain.media.service;

import com.fintech.pob.domain.media.entity.Media;
import com.fintech.pob.domain.media.repository.MediaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;

    @Override
    public void createMedia(Media media) {
        mediaRepository.save(media);
    }

    @Override
    public Optional<Media> findMedia(Long number) {
        Optional<Media> find = mediaRepository.findByTransactionUniqueNo(number);
        log.info(String.valueOf(find));
        return find;
    }
}
