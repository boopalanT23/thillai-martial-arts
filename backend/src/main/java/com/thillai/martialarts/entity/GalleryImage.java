package com.thillai.martialarts.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "gallery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    /** competitions | training | championships | events | yoga | fitness | celebrations */
    @Column(nullable = false, length = 40)
    private String category;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(length = 20)
    @Builder.Default
    private String mediaType = "IMAGE";

    @Column(length = 500)
    private String videoUrl;

    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    public String getMediaType() {
        return (mediaType == null || mediaType.isBlank()) ? "IMAGE" : mediaType;
    }

    @PrePersist
    void onCreate() {
        if (this.uploadedAt == null) {
            this.uploadedAt = LocalDateTime.now();
        }
        if (this.mediaType == null || this.mediaType.isBlank()) {
            this.mediaType = "IMAGE";
        }
    }
}
