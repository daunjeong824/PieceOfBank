package com.fintech.pob.domain.media.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "media")
@NoArgsConstructor
@AllArgsConstructor
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "media_id")
    private Long mediaId;
    private Long transactionUniqueNo;
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private MediaTypeENUM type;
    private String url;
    private String content;


}
