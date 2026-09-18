package com.thillai.martialarts.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GalleryResponse {
    private Long id;
    private String title;
    private String category;
    private String url;
    private String mediaType;
    private String videoUrl;
}
