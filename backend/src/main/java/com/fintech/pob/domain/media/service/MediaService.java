package com.fintech.pob.domain.media.service;

import com.fintech.pob.domain.media.entity.Media;

import java.util.Optional;

public interface MediaService {
    void createMedia(Media media);
    Optional<Media> findMedia(Long number);
}
